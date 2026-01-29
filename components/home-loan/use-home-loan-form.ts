'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { submitHomeLoanEnquiry } from '@/lib/api/home-loan-service';
import {
  DEFAULT_HOME_LOAN_FORM_STATE,
  buildHomeLoanPayload,
  validateHomeLoanForm,
  type HomeLoanFormState,
} from './home-loan-form.config';

interface UseHomeLoanFormReturn {
  formValues: HomeLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof HomeLoanFormState, value: string | boolean) => void;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  showSuccess: boolean;
  canSubmit: boolean;
}

function splitFullName(fullName: string | undefined): { firstName: string; lastName: string } {
  if (!fullName?.trim()) return { firstName: '', lastName: '' };
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ') ?? '';
  return { firstName, lastName };
}

export const useHomeLoanForm = (): UseHomeLoanFormReturn => {
  const { isAuthenticated, user } = useAuth();
  const [formValues, setFormValues] = useState<HomeLoanFormState>(DEFAULT_HOME_LOAN_FORM_STATE);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const hasPrefilledRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

  const handleFieldChange = useCallback(
    (key: keyof HomeLoanFormState, value: string | boolean): void => {
      setFormValues((prev) => ({ ...prev, [key]: value }));
      setFormErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const errors = validateHomeLoanForm(formValues);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formValues]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = buildHomeLoanPayload(formValues);
      const success = await submitHomeLoanEnquiry(payload);

      if (!isMountedRef.current) return;
      if (success) {
        setShowSuccess(true);
        setFormValues(DEFAULT_HOME_LOAN_FORM_STATE);
        setFormErrors({});
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  }, [formValues, isSubmitting, validateForm]);

  const canSubmit = useMemo((): boolean => {
    if (!formValues.consent) return false;
    const errors = validateHomeLoanForm(formValues);
    return Object.keys(errors).length === 0;
  }, [formValues]);

  // Auth prefill: set firstName, lastName, mobile from user once when available.
  useEffect(() => {
    if (!isAuthenticated || !user || hasPrefilledRef.current) return;
    hasPrefilledRef.current = true;

    const { firstName, lastName } = splitFullName(user.name);
    setFormValues((prev) => ({
      ...prev,
      ...(firstName && !prev.firstName ? { firstName } : {}),
      ...(lastName && !prev.lastName ? { lastName } : {}),
      ...(user.phoneNumber && !prev.mobile ? { mobile: user.phoneNumber } : {}),
    }));
  }, [isAuthenticated, user]);

  return {
    formValues,
    formErrors,
    handleFieldChange,
    handleSubmit,
    isSubmitting,
    showSuccess,
    canSubmit,
  };
};
