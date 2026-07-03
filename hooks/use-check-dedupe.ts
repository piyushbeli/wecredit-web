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
import { requiresMultiLenderLeadForm } from '@/lib/utils/wecredit-lead-data';
import { hasMatchingStatusLender } from '@/lib/utils/common-helper';

/**
 * Return type for useCheckDedupe hook
 */
interface UseCheckDedupeReturn {
  /** Whether API call is in progress */
  isLoading: boolean;
  /** Whether user needs to fill form (1003, 1004 without lenders, or 1004 non-WeCredit data) */
  needsForm: boolean;
  /** Raw response data from API */
  response: CheckDedupeResponse | null;
  /** Error message if API call failed */
  error: string | null;
  /** Function to trigger dedupe check */
  checkDedupe: (mobile: string, partnerCode: string, options?: CheckDedupeOptions) => Promise<boolean>;
  /** Reset state */
  reset: () => void;
}

interface CheckDedupeOptions {
  /**
   * Single-lender flows must verify status before opening the lender form.
   * If this lender already exists in status, the caller should route to offers instead.
   */
  statusBeforeFormLenderName?: string;
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

  // Helper function to check if user exists and needs to fill form for a single lender
  const checkSingleLenderStatusBeforeForm = async (mobile: string, token: string, options: CheckDedupeOptions): Promise<boolean> => {
    const lenderName = options.statusBeforeFormLenderName?.trim();
    if (!lenderName) {
      setNeedsForm(true);
      return true;
    }

    const statusResult = await checkStatusAll(mobile, token);

    if (!statusResult.success) {
      const toastMsg = statusResult.error || 'Unable to verify your application status. Please try again.';
      toast.error(toastMsg);
      setError(toastMsg);
      setNeedsForm(false);
      return false;
    }

    const lenders = statusResult.data?.lenders ?? [];
    setNeedsForm(!hasMatchingStatusLender(lenders, lenderName));
    return true;
  };

  /**
   * Checks if user exists and needs to fill form
   * @param mobile - User's 10-digit mobile number
   * @param partnerCode - Partner code (default: WC001)
   * @returns true if API call succeeded, false otherwise
   */
  const checkDedupe = useCallback(async (
    mobile: string,
    partnerCode: string,
    options: CheckDedupeOptions = {}
  ): Promise<boolean> => {

    // Get token from cookies
    const token = getCookie(STORAGE_AUTH_TOKEN) as string;

    if (!token) {
      setError('Session expired. Please login again.');
      return false; // STOP
    }

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

      // Get status code and isWecreditWebsiteData from response
      const statusCode = result.data.statusCode;
      const isWecreditWebsiteData = result.data.isWecreditWebsiteData;

      const statusCodeNumber = typeof statusCode === 'number' ? statusCode : Number(statusCode);

      const isNewUserStatus = statusCodeNumber === 1003;
      const isExistingMobileStatus = statusCodeNumber === 1004;

      // 1003: new user always needs to fill the form
      if (isNewUserStatus) {
        return checkSingleLenderStatusBeforeForm(mobile, token, options);
      }

      if (isExistingMobileStatus) {

        // Non-WeCredit website data → must fill multi-lender lead form.
        // Only explicit false triggers this; missing/true keeps the normal flow.
        if (requiresMultiLenderLeadForm(isWecreditWebsiteData)) {
          setNeedsForm(true);
          return true;
        }

        const statusResult = await checkStatusAll(mobile, token);

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
