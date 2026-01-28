'use client';

/**
 * Hook for fetching dynamic form fields from the lenders-form-filled API
 * Used in campaign forms to get lender-specific form configuration
 *
 * NOTE: Per product requirement, we intentionally do NOT cache responses in the FE.
 * Each `fetchFields` call always hits the API to ensure we show the latest data.
 */

import { useState, useCallback } from 'react';
import { leadService } from '@/lib/api/lead-service';
import type { FormField } from '@/types/lead';
import { useLoading } from '@/hooks/use-loading';

/** Return type for useFetchFormFields hook */
interface UseFetchFormFieldsReturn {
  /** Array of form fields sorted by order */
  fields: FormField[];
  /** Loading state while fetching */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Function to fetch form fields for a lender */
  fetchFields: (lenderName: string, fetchDetails?: boolean) => Promise<void>;
  /** Reset fields and error state */
  reset: () => void;
  /**
   * Backwards-compatible no-op (caching removed).
   * Kept to avoid refactors across call sites.
   */
  clearCache: (lenderName?: string) => void;
}

/**
 * Hook to fetch dynamic form fields for a specific lender
 * 
 * Features:
 * - Always fetches latest data (no FE caching)
 * 
 * @returns Object containing fields, loading state, error, and fetch function
 * @example
 * ```tsx
 * const { fields, isLoading, error, fetchFields, clearCache } = useFetchFormFields();
 *
 * useEffect(() => {
 *   fetchFields('abfl', true);
 * }, [fetchFields]);
 * 
 * // No-op (caching removed)
 * clearCache('abfl');
 * ```
 */
export function useFetchFormFields(): UseFetchFormFieldsReturn {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showLoading, hideLoading } = useLoading();

  const fetchFields = useCallback(async (
    lenderName: string,
    fetchDetails: boolean = true
  ): Promise<void> => {
    // Always fetch from API (no FE caching) to guarantee fresh values.
    setIsLoading(true);
    setError(null);

    showLoading('Loading form...', 'Preparing your application.');
    try {
      const result = await leadService.fetchFormFields(lenderName, fetchDetails);

      if (result.success && result.data) {
        setFields(result.data);
      } else {
        setError(result.error || 'Failed to fetch form fields');
      }
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  }, [hideLoading, showLoading]);

  const reset = useCallback((): void => {
    setFields([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const clearCache = useCallback((lenderName?: string): void => {
    // Intentionally no-op: caching removed.
    void lenderName;
  }, []);

  return {
    fields,
    isLoading,
    error,
    fetchFields,
    reset,
    clearCache,
  };
}
