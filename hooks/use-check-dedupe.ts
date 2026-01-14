'use client';

/**
 * Hook for checking if user exists in system (dedupe check)
 * Determines if user needs to fill form or can proceed to offers
 */

import { useState, useCallback } from 'react';
import { leadService } from '@/lib/api/lead-service';
import type { CheckDedupeResponse } from '@/types/lead';
import type { LeadServiceResult } from '@/lib/api/lead-service';

/**
 * Return type for useCheckDedupe hook
 */
interface UseCheckDedupeReturn {
  /** Whether API call is in progress */
  isLoading: boolean;
  /** Whether user needs to fill form (statusCode === 1003) */
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
    setIsLoading(true);
    setNeedsForm(false);
    setError(null);
    setResponse(null);

    try {
      const result: LeadServiceResult<CheckDedupeResponse> = await leadService.checkDedupe(
        mobile,
        partnerCode
      );

      if (result.success && result.data) {
        setResponse(result.data);
        
        // Check if user needs to fill form (statusCode 1003)
        const statusCodeNumber = typeof result.data.statusCode === 'number' 
          ? result.data.statusCode 
          : parseInt(String(result.data.statusCode), 10);
        
        setNeedsForm(statusCodeNumber === 1003);
        return true;
      } else {
        setError(result.error || 'Failed to check dedupe');
        return false;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
