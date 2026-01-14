'use client';

/**
 * Hook for fetching dynamic form fields from the lenders-form-filled API
 * Used in campaign forms to get lender-specific form configuration
 */

import { useState, useCallback } from 'react';
import { leadService } from '@/lib/api/lead-service';
import type { FormField } from '@/types/lead';

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
}

/**
 * Hook to fetch dynamic form fields for a specific lender
 * @returns Object containing fields, loading state, error, and fetch function
 * @example
 * ```tsx
 * const { fields, isLoading, error, fetchFields } = useFetchFormFields();
 *
 * useEffect(() => {
 *   fetchFields('abfl', true);
 * }, [fetchFields]);
 * ```
 */
export function useFetchFormFields(): UseFetchFormFieldsReturn {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = useCallback(async (
    lenderName: string,
    fetchDetails: boolean = true
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const result = await leadService.fetchFormFields(lenderName, fetchDetails);
    if (result.success && result.data) {
      setFields(result.data);
    } else {
      setError(result.error || 'Failed to fetch form fields');
    }
    setIsLoading(false);
  }, []);

  const reset = useCallback((): void => {
    setFields([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    fields,
    isLoading,
    error,
    fetchFields,
    reset,
  };
}
