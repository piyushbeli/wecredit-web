'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { submitGoldLoanEnquiry } from '@/lib/api/gold-loan-service';
import { useLoadingStore } from '@/stores/loading-store';
import {
  DEFAULT_GOLD_LOAN_FORM_STATE,
  buildGoldLoanPayload,
  validateGoldLoanForm,
  type GoldLoanEnquiryPayload,
  type GoldLoanFormState,
} from './gold-loan-form.config';

interface UseGoldLoanFormReturn {
  formValues: GoldLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof GoldLoanFormState, value: string | boolean) => void;
  handleFieldBlur: (key: keyof GoldLoanFormState) => void;
  handleSubmit: () => Promise<void>;
  getValidatedPayload: () => GoldLoanEnquiryPayload | null;
  isSubmitting: boolean;
  canSubmit: boolean;
}

interface UseGoldLoanFormOptions {
  /** Called when the API submit succeeds so the parent can show success state. */
  onSuccess?: () => void;
}

export const useGoldLoanForm = (
  options: UseGoldLoanFormOptions = {}
): UseGoldLoanFormReturn => {
  const { isAuthenticated, user } = useAuth();
  const { onSuccess } = options;
  const { show: showLoading, hide: hideLoading } = useLoadingStore();
  const [formValues, setFormValues] = useState<GoldLoanFormState>(DEFAULT_GOLD_LOAN_FORM_STATE);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasPrefilledRef = useRef(false);
  const formValuesRef = useRef(formValues);
  formValuesRef.current = formValues;

  const handleFieldChange = useCallback(
    (key: keyof GoldLoanFormState, value: string | boolean): void => {
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
   * Mirrors the behaviour used in the Personal Loan multi-step form so the user
   * immediately sees where to start fixing issues after submit.
   */
  const scrollToFirstError = useCallback((): void => {
    const firstErrorElement = document.querySelector('.border-red-300, input:invalid');
    if (!firstErrorElement) return;
    firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = validateGoldLoanForm(formValues);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formValues]);

  /**
   * Validates the form and returns a submission payload.
   * Used by both direct submit and post-login flows so validation is consistent.
   */
  const getValidatedPayload = useCallback((): GoldLoanEnquiryPayload | null => {
    if (!validateForm()) {
      // When validation fails, bring the first errored field into view so the user
      // can quickly understand what needs attention, similar to Personal Loan flow.
      scrollToFirstError();
      return null;
    }
    return buildGoldLoanPayload(formValues);
  }, [formValues, scrollToFirstError, validateForm]);

  /** Validates a single field on blur and updates its error so inline feedback shows immediately. */
  const handleFieldBlur = useCallback((key: keyof GoldLoanFormState): void => {
    const errors: Record<string, string> = validateGoldLoanForm(formValuesRef.current);
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
      message: 'Submitting your gold loan request...',
      subtext: 'This will only take a moment.',
    });
    try {
      const success = await submitGoldLoanEnquiry(payload);
      if (success) {
        if (onSuccess) {
          onSuccess();
        }
        setFormValues(DEFAULT_GOLD_LOAN_FORM_STATE);
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
