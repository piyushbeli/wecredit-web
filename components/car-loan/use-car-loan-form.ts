'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { submitCarLoanEnquiry } from '@/lib/api/car-loan-service';
import { useLoadingStore } from '@/stores/loading-store';
import {
  DEFAULT_CAR_LOAN_FORM_STATE,
  buildCarLoanPayload,
  validateCarLoanForm,
  type CarLoanEnquiryPayload,
  type CarLoanFormState,
} from './car-loan-form.config';

interface UseCarLoanFormReturn {
  formValues: CarLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof CarLoanFormState, value: string | boolean) => void;
  handleFieldBlur: (key: keyof CarLoanFormState) => void;
  handleSubmit: () => Promise<void>;
  getValidatedPayload: () => CarLoanEnquiryPayload | null;
  isSubmitting: boolean;
  canSubmit: boolean;
}

interface UseCarLoanFormOptions {
  /** Called when the API submit succeeds so the parent can show success state. */
  onSuccess?: () => void;
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
  const hasPrefilledRef = useRef(false)
  const formValuesRef = useRef(formValues);
  formValuesRef.current = formValues;

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

  /**
   * Scrolls the viewport to the first visible field with a validation error.
   * This mirrors the behaviour used in the Personal Loan and Gold Loan flows
   * so the user immediately sees where to start fixing issues after submit.
   */
  const scrollToFirstError = useCallback((): void => {
    const firstErrorElement = document.querySelector('.border-red-300, input:invalid');
    if (!firstErrorElement) return;
    firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors = validateCarLoanForm(formValues);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formValues]);

  /**
   * Validates the form and returns a submission payload.
   * Used by both direct submit and post-login flows so validation is consistent.
   */
  const getValidatedPayload = useCallback((): CarLoanEnquiryPayload | null => {
    if (!validateForm()) {
      // When validation fails, bring the first errored field into view so the user
      // can quickly understand what needs attention, consistent across loan forms.
      scrollToFirstError();
      return null;
    }
    return buildCarLoanPayload(formValues);
  }, [formValues, scrollToFirstError, validateForm]);

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
    const payload = getValidatedPayload();
    if (!payload) return;

    setIsSubmitting(true);
    showLoading({
      message: 'Submitting your car loan request...',
      subtext: 'This will only take a moment.',
    });
    try {
      const success = await submitCarLoanEnquiry(payload);

      if (success) {
        if (onSuccess) {
          onSuccess();
        }
        setFormValues(DEFAULT_CAR_LOAN_FORM_STATE);
        setFormErrors({});
      }
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  }, [getValidatedPayload, hideLoading, isSubmitting, onSuccess, showLoading]);

  /** Enable submit when consent is checked; full validation runs on submit. */
  const canSubmit = useMemo((): boolean => {
    if (!formValues.consent) return false;
    if (isSubmitting) return false;
    return true;
  }, [formValues.consent, isSubmitting]);

  useEffect(() => {
    if (!isAuthenticated || !user || hasPrefilledRef.current) return;
    hasPrefilledRef.current = true;

    // const { firstName, lastName } = splitFullName(user.name);
    setFormValues((prev) => ({
      ...prev,
      // ...(firstName && !prev.firstName ? { firstName } : {}),
      // ...(lastName && !prev.lastName ? { lastName } : {}),
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
    getValidatedPayload,
    isSubmitting,
    canSubmit,
  };
};
