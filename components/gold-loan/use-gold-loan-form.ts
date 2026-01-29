'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { submitGoldLoanEnquiry } from '@/lib/api/gold-loan-service';
import { useLoadingStore } from '@/stores/loading-store';
import {
  DEFAULT_GOLD_LOAN_FORM_STATE,
  buildGoldLoanPayload,
  validateGoldLoanForm,
  type GoldLoanFormState,
} from './gold-loan-form.config';

interface UseGoldLoanFormReturn {
  formValues: GoldLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof GoldLoanFormState, value: string | boolean) => void;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  canSubmit: boolean;
}

interface UseGoldLoanFormOptions {
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
  const isMountedRef = useRef(true);

  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

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

  const validateForm = useCallback((): boolean => {
    const errors = validateGoldLoanForm(formValues);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formValues]);

  useEffect(() => {
    // Provide immediate feedback for PAN/DOB formatting without blocking CTA enablement.
    setFormErrors((prev) => {
      const nextErrors = { ...prev };
      const validationErrors = validateGoldLoanForm(formValues);

      if (formValues.pan.trim()) {
        if (validationErrors.pan) {
          nextErrors.pan = validationErrors.pan;
        } else if (nextErrors.pan) {
          delete nextErrors.pan;
        }
      } else if (nextErrors.pan) {
        delete nextErrors.pan;
      }

      if (formValues.dob.trim()) {
        if (validationErrors.dob) {
          nextErrors.dob = validationErrors.dob;
        } else if (nextErrors.dob) {
          delete nextErrors.dob;
        }
      } else if (nextErrors.dob) {
        delete nextErrors.dob;
      }

      return nextErrors;
    });
  }, [formValues.dob, formValues.pan]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    showLoading({
      message: 'Submitting your gold loan request...',
      subtext: 'This will only take a moment.',
    });
    try {
      const payload = buildGoldLoanPayload(formValues);
      const success = await submitGoldLoanEnquiry(payload);

      if (!isMountedRef.current) return;
      if (success) {
        if (onSuccess) {
          onSuccess();
        }
        setFormValues(DEFAULT_GOLD_LOAN_FORM_STATE);
        setFormErrors({});
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
      hideLoading();
    }
  }, [formValues, hideLoading, isSubmitting, onSuccess, showLoading, validateForm]);

  const canSubmit = useMemo((): boolean => {
    if (!formValues.consent) return false;
    // Keep the CTA enabled once required fields are present; format validation runs on submit.
    const requiredFieldsFilled =
      formValues.firstName.trim() &&
      formValues.lastName.trim() &&
      formValues.mobile.trim() &&
      formValues.dob.trim() &&
      formValues.pan.trim() &&
      formValues.state.trim() &&
      formValues.city.trim() &&
      formValues.loanAmount.trim();
    console.log('Can submit requiredFieldsFilled', requiredFieldsFilled);
    return Boolean(requiredFieldsFilled);
  }, [formValues]);

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
    canSubmit,
  };
};
