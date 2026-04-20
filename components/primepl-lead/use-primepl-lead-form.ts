'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { submitPrimeplLeadEnquiry } from '@/lib/api/primepl-lead-service';
import { pushPrimeplFormSubmission } from '@/lib/gtm';
import { useLoadingStore } from '@/stores/loading-store';
import {
  DEFAULT_PRIMEPL_LEAD_FORM_STATE,
  buildPrimeplLeadPayload,
  validatePrimeplLeadForm,
  type PrimeplLeadEnquiryPayload,
  type PrimeplLeadFormState,
} from './primepl-lead-form.config';

interface UsePrimeplLeadFormReturn {
  formValues: PrimeplLeadFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof PrimeplLeadFormState, value: string | boolean) => void;
  handleFieldBlur: (key: keyof PrimeplLeadFormState) => void;
  handleSubmit: () => Promise<void>;
  getValidatedPayload: () => PrimeplLeadEnquiryPayload | null;
  isSubmitting: boolean;
  canSubmit: boolean;
}

interface UsePrimeplLeadFormOptions {
  /** Called when the API submit succeeds so the parent can show success state. */
  onSuccess?: () => void;
}

export const usePrimeplLeadForm = (
  options: UsePrimeplLeadFormOptions = {}
): UsePrimeplLeadFormReturn => {
  const { isAuthenticated, user } = useAuth();
  const { onSuccess } = options;
  const { show: showLoading, hide: hideLoading } = useLoadingStore();
  const [formValues, setFormValues] = useState<PrimeplLeadFormState>(DEFAULT_PRIMEPL_LEAD_FORM_STATE);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasPrefilledRef = useRef(false);
  const formValuesRef = useRef(formValues);
  formValuesRef.current = formValues;

  const handleFieldChange = useCallback(
    (key: keyof PrimeplLeadFormState, value: string | boolean): void => {
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

  const scrollToFirstError = useCallback((): void => {
    const firstErrorElement = document.querySelector('.border-red-300, input:invalid');
    if (!firstErrorElement) return;
    firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors = validatePrimeplLeadForm(formValues);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formValues]);

  const getValidatedPayload = useCallback((): PrimeplLeadEnquiryPayload | null => {
    if (!validateForm()) {
      scrollToFirstError();
      return null;
    }
    return buildPrimeplLeadPayload(formValues);
  }, [formValues, scrollToFirstError, validateForm]);

  const handleFieldBlur = useCallback((key: keyof PrimeplLeadFormState): void => {
    const errors = validatePrimeplLeadForm(formValuesRef.current);
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
      message: 'Submitting your request...',
      subtext: 'This will only take a moment.',
    });
    try {
      const success = await submitPrimeplLeadEnquiry(payload);

      if (success) {
        pushPrimeplFormSubmission({
          status: 'success',
          declaredSalary: payload.netSalaryPm,
          empType: payload.occupation,
        });
        if (onSuccess) {
          onSuccess();
        }
        setFormValues(DEFAULT_PRIMEPL_LEAD_FORM_STATE);
        setFormErrors({});
      }
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  }, [getValidatedPayload, hideLoading, isSubmitting, onSuccess, showLoading]);

  const canSubmit = useMemo((): boolean => {
    if (!formValues.consent) return false;
    if (isSubmitting) return false;
    return true;
  }, [formValues.consent, isSubmitting]);

  useEffect(() => {
    if (!isAuthenticated || !user || hasPrefilledRef.current) return;
    hasPrefilledRef.current = true;

    setFormValues((prev) => ({
      ...prev,
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
