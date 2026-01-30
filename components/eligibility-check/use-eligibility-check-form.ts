'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { submitEligibilityCheck } from '@/lib/api/eligibility-check-service';
import {
  DEFAULT_ELIGIBILITY_CHECK_FORM_VALUES,
  buildEligibilityCheckPayload,
  validateEligibilityCheckForm,
  type EligibilityCheckFormValues,
} from './eligibility-check-form.config';

interface UseEligibilityCheckFormReturn {
  formValues: EligibilityCheckFormValues;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof EligibilityCheckFormValues, value: string) => void;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  canSubmit: boolean;
}

interface UseEligibilityCheckFormOptions {
  /** Called when the API submit succeeds so the parent can show success state. */
  onSuccess?: () => void;
}

export const useEligibilityCheckForm = (
  options: UseEligibilityCheckFormOptions = {}
): UseEligibilityCheckFormReturn => {
  const { onSuccess } = options;
  const [formValues, setFormValues] = useState<EligibilityCheckFormValues>(
    DEFAULT_ELIGIBILITY_CHECK_FORM_VALUES
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

  const handleFieldChange = useCallback(
    (key: keyof EligibilityCheckFormValues, value: string): void => {
      setFormValues((prev) => ({ ...prev, [key]: value }));
      setFormErrors((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const errors = validateEligibilityCheckForm(formValues);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formValues]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = buildEligibilityCheckPayload(formValues);
      const success = await submitEligibilityCheck(payload);

      if (!isMountedRef.current) return;
      if (success && onSuccess) {
        onSuccess();
        setFormValues(DEFAULT_ELIGIBILITY_CHECK_FORM_VALUES);
        setFormErrors({});
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  }, [formValues, isSubmitting, onSuccess, validateForm]);

  const canSubmit = useMemo((): boolean => {
    const requiredFilled =
      formValues.firstName.trim() &&
      formValues.lastName.trim() &&
      formValues.gender.trim() &&
      formValues.phoneNumber.replace(/\D/g, '').length === 10 &&
      formValues.dob.trim() &&
      formValues.pan.trim() &&
      formValues.pincode.replace(/\D/g, '').length === 6;
    return Boolean(requiredFilled);
  }, [formValues]);

  return {
    formValues,
    formErrors,
    handleFieldChange,
    handleSubmit,
    isSubmitting,
    canSubmit,
  };
};
