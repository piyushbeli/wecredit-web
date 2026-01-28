'use client';

/**
 * Hook for creating a lead via the create-lead API
 * Handles form data transformation and submission
 */

import { useState, useCallback } from 'react';
import { leadService } from '@/lib/api/lead-service';
import type { LeadFormData } from '@/types/lead';
import { useLoading } from '@/hooks/use-loading';

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
  /** Function to create a lead with form data */
  createLead: (
    formData: LeadFormData,
    partnerCode: string,
    lenderName?: string
  ) => Promise<boolean>;
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
 *   const success = await createLead(formData, 'WC001', 'abfl');
 *   if (success) {
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
  const { showLoading, hideLoading } = useLoading();

  const createLead = useCallback(async (
    formData: LeadFormData,
    partnerCode: string,
    lenderName?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setIsCreated(false);
    setError(null);
    setLeadId(null);
    showLoading('Submitting application...', 'Please wait while we process your details.');
    try {
      const result = await leadService.createLead(formData, partnerCode, lenderName);
      if (result.success && result.data) {
        setLeadId(result.data.leadId);
        setIsCreated(true);
        return true;
      }
      setError(result.error || 'Failed to create lead');
      return false;
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
  }, []);

  return {
    isLoading,
    isCreated,
    leadId,
    error,
    createLead,
    reset,
  };
}
