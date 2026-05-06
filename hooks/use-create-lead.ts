'use client';

/**
 * Hook for creating a lead via the create-lead API
 * Handles form data transformation and submission
 */

import { useState, useCallback } from 'react';
import { leadService } from '@/lib/api/lead-service';
import type { LeadFormData } from '@/types/lead';
import { useLoading } from '@/hooks/use-loading';

/** Outcome of a single create-lead submission (for navigation / UI branching). */
export type CreateLeadSubmissionResult =
  | { success: true; leadId: string; isPrimePlLead: boolean }
  | { success: false; error: string };

/** Return type for useCreateLead hook */
interface UseCreateLeadReturn {
  /** Loading state while creating lead */
  isLoading: boolean;
  /** Whether lead was successfully created */
  isCreated: boolean;
  /** Lead ID returned from API on success */
  leadId: string | null;
  /** Error message if creation failed */
  error: string | null;
  /** True when the successful response indicates Prime PL path */
  isPrimePlLeadSuccess: boolean;
  /** Function to create a lead with form data */
  createLead: (
    formData: LeadFormData,
    partnerCode: string,
    lenderName?: string,
    lenderUniqueId?: string
  ) => Promise<CreateLeadSubmissionResult>;
  /** Reset the hook state */
  reset: () => void;
}

/**
 * Hook to create a new lead with form data
 * @returns Object containing loading state, success flag, leadId, error, and create function
 * @example
 * ```tsx
 * const { createLead, isLoading, isCreated, error } = useCreateLead();
 *
 * const handleSubmit = async () => {
 *   const result = await createLead(formData, 'WC001', 'abfl');
 *   if (result.success && !result.isPrimePlLead) {
 *     router.push('/offers');
 *   }
 * };
 * ```
 */
export function useCreateLead(): UseCreateLeadReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPrimePlLeadSuccess, setIsPrimePlLeadSuccess] = useState(false);
  const { showLoading, hideLoading } = useLoading();

  const createLead = useCallback(async (
    formData: LeadFormData,
    partnerCode: string,
    lenderName?: string,
    lenderUniqueId?: string
  ): Promise<CreateLeadSubmissionResult> => {
    setIsLoading(true);
    setIsCreated(false);
    setError(null);
    setLeadId(null);
    setIsPrimePlLeadSuccess(false);
    showLoading('Submitting application...', 'Please wait while we process your details.');
    try {
      const result = await leadService.createLead(formData, partnerCode, lenderName, lenderUniqueId );
      if (result.success && result.data) {
        setLeadId(result.data.leadId);
        // Only strict true should switch UI copy; malformed values stay on default success text.
        const isPrime = result.data.isPrimePlLead === true;
        setIsPrimePlLeadSuccess(isPrime);
        setIsCreated(true);
        console.info('[useCreateLead]', {
          phase: 'success',
          isPrimePlLead: isPrime,
          leadIdLen: result.data.leadId?.length ?? 0,
        });
        return { success: true, leadId: result.data.leadId, isPrimePlLead: isPrime };
      }
      const message = result.error || 'Failed to create lead';
      setError(message);
      console.info('[useCreateLead]', { phase: 'failure', error: message });
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  }, [hideLoading, showLoading]);

  const reset = useCallback((): void => {
    setIsLoading(false);
    setIsCreated(false);
    setLeadId(null);
    setError(null);
    setIsPrimePlLeadSuccess(false);
  }, []);

  return {
    isLoading,
    isCreated,
    leadId,
    error,
    isPrimePlLeadSuccess,
    createLead,
    reset,
  };
}
