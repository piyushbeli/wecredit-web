'use client';

/**
 * Hook for checking if user exists in system (dedupe check)
 * Determines if user needs to fill form or can proceed to offers
 */

import { useState, useCallback } from 'react';
import { leadService } from '@/lib/api/lead-service';
import type { CheckDedupeResponse } from '@/types/lead';
import type { LeadServiceResult } from '@/lib/api/lead-service';
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import { checkStatusAll } from '@/lib/api';
import { getCookie } from 'cookies-next';
import { STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';
import { toast } from 'sonner';

/**
 * Return type for useCheckDedupe hook
 */
interface UseCheckDedupeReturn {
  /** Whether API call is in progress */
  isLoading: boolean;
  /** Whether user needs to fill form (1003 or 1004 without existing lenders) */
  needsForm: boolean;
  /** Raw response data from API */
  response: CheckDedupeResponse | null;
  /** Error message if API call failed */
  error: string | null;
  /** Function to trigger dedupe check */
  checkDedupe: (mobile: string, partnerCode: string) => Promise<boolean>;
  /** Reset state */
  reset: () => void;
}

/**
 * Custom hook for check-dedupe API
 * 
 * Usage:
 * ```tsx
 * const { needsForm, checkDedupe, isLoading } = useCheckDedupe();
 * 
 * const handleCheck = async () => {
 *   const success = await checkDedupe(mobile, partnerCode);
 *   if (success && needsForm) {
 *     // Open form modal
 *   } else {
 *     // Navigate to offers
 *   }
 * };
 * ```
 */
export function useCheckDedupe(): UseCheckDedupeReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [needsForm, setNeedsForm] = useState(false);
  const [response, setResponse] = useState<CheckDedupeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bypassDedupeCheck = useFeatureFlag('bypassDedupeCheck');

  /**
   * Checks if user exists and needs to fill form
   * @param mobile - User's 10-digit mobile number
   * @param partnerCode - Partner code (default: WC001)
   * @returns true if API call succeeded, false otherwise
   */
  const checkDedupe = useCallback(async (
    mobile: string,
    partnerCode: string
  ): Promise<boolean> => {
    // Feature flag: Bypass dedupe check for testing
    if (bypassDedupeCheck) {
      console.info('[FeatureFlag] Bypassing dedupe check');
      setNeedsForm(true);
      setResponse({
        statusCode: 1003,
        statusMessage: 'Dedupe check bypassed (feature flag)',
      });
      return true;
    }

    setIsLoading(true);
    setNeedsForm(false);
    setError(null);
    setResponse(null);

    try {
      const result: LeadServiceResult<CheckDedupeResponse> = await leadService.checkDedupe(
        mobile,
        partnerCode
      );

      if (!result.success || !result.data) {
        setError(result.error || 'Failed to check dedupe');
        return false;
      }

      setResponse(result.data);

      const statusCodeNumber = typeof result.data.statusCode === 'number'
        ? result.data.statusCode
        : parseInt(String(result.data.statusCode), 10);

      const isNewUserStatus = statusCodeNumber === 1003;
      const isExistingMobileStatus = statusCodeNumber === 1004;

      // 1003: new user always needs to fill the form
      if (isNewUserStatus) {
        setNeedsForm(true);
        return true;
      }

      if (isExistingMobileStatus) {
        const token = getCookie(STORAGE_AUTH_TOKEN);

        if (!token) {
          setError('Session expired. Please login again.');
          return false; // STOP
        }

        const statusResult = await checkStatusAll(mobile, token as string);

        // ✅ GUARD: stop user if status API fails
        if (!statusResult.success) {
          const toastMsg = statusResult.error || 'Unable to verify your application status. Please try again.';
          toast.error(toastMsg);
          setError(toastMsg);
          setNeedsForm(false);
          return false; 
        }

        const lenders = statusResult.data?.lenders ?? [];
        const hasLenders = lenders.length > 0;

        setNeedsForm(!hasLenders);
        return true;
      }


      // Any other status code → no form needed, user can proceed
      setNeedsForm(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [bypassDedupeCheck]);

  /**
   * Reset all state to initial values
   */
  const reset = useCallback((): void => {
    setIsLoading(false);
    setNeedsForm(false);
    setResponse(null);
    setError(null);
  }, []);

  return { 
    isLoading, 
    needsForm, 
    response, 
    error, 
    checkDedupe,
    reset,
  };
}
