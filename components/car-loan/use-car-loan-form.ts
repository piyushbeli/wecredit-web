'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { submitCarLoanEnquiry } from '@/lib/api/car-loan-service';
import { useLoadingStore } from '@/stores/loading-store';
import {
  DEFAULT_CAR_LOAN_FORM_STATE,
  buildCarLoanPayload,
  validateCarLoanForm,
  type CarLoanFormState,
} from './car-loan-form.config';

interface UseCarLoanFormReturn {
  formValues: CarLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof CarLoanFormState, value: string | boolean) => void;
  handleFieldBlur: (key: keyof CarLoanFormState) => void;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  canSubmit: boolean;
}

interface UseCarLoanFormOptions {
  /** Called when the API submit succeeds so the parent can show success state. */
  onSuccess?: () => void;
}

function splitFullName(fullName: string | undefined): { firstName: string; lastName: string } {
  if (!fullName?.trim()) return { firstName: '', lastName: '' };
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ') ?? '';
  return { firstName, lastName };
}

export const useCarLoanForm = (
  options: UseCarLoanFormOptions = {}
): UseCarLoanFormReturn => {
  const { isAuthenticated, user } = useAuth();
  const { onSuccess } = options;
  const { show: showLoading, hide: hideLoading } = useLoadingStore();
  const [formValues, setFormValues] = useState<CarLoanFormState>(DEFAULT_CAR_LOAN_FORM_STATE);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasPrefilledRef = useRef(false);
  const isMountedRef = useRef(true);
  const formValuesRef = useRef(formValues);
  formValuesRef.current = formValues;

  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

  const handleFieldChange = useCallback(
    (key: keyof CarLoanFormState, value: string | boolean): void => {
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
    const errors = validateCarLoanForm(formValues);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formValues]);

  /** Validates a single field on blur and updates its error so inline feedback shows immediately. */
  const handleFieldBlur = useCallback((key: keyof CarLoanFormState): void => {
    const errors = validateCarLoanForm(formValuesRef.current);
    const message = errors[key];
    setFormErrors((prev) => {
      if (message) {
        return { ...prev, [key]: message };
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    showLoading({
      message: 'Submitting your car loan request...',
      subtext: 'This will only take a moment.',
    });
    try {
      const payload = buildCarLoanPayload(formValues);
      const success = await submitCarLoanEnquiry(payload);

      if (!isMountedRef.current) return;
      if (success) {
        if (onSuccess) {
          onSuccess();
        }
        setFormValues(DEFAULT_CAR_LOAN_FORM_STATE);
        setFormErrors({});
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
      hideLoading();
    }
  }, [formValues, hideLoading, isSubmitting, onSuccess, showLoading, validateForm]);

  /** Enable submit when consent is checked; full validation runs on submit. */
  const canSubmit = useMemo((): boolean => {
    if (!formValues.consent) return false;
    if (isSubmitting) return false;
    return true;
  }, [formValues.consent, isSubmitting]);

  useEffect(() => {
    if (!isAuthenticated || !user || hasPrefilledRef.current) return;
    hasPrefilledRef.current = true;

    const { firstName, lastName } = splitFullName(user.name);
    setFormValues((prev) => ({
      ...prev,
      ...(firstName && !prev.firstName ? { firstName } : {}),
      ...(lastName && !prev.lastName ? { lastName } : {}),
      ...(user.phoneNumber && !prev.mobile ? { mobile: user.phoneNumber } : {}),
      ...(user.email && !prev.email ? { email: user.email } : {}),
    }));
  }, [isAuthenticated, user]);

  return {
    formValues,
    formErrors,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    isSubmitting,
    canSubmit,
  };
};
