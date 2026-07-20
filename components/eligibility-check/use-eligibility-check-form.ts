'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { queueEligibilityCheck } from '@/lib/api/eligibility-check-service';
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
  /** Opens the credit-score processing screen after local validation. */
  onProcessing?: () => void;
}

export const useEligibilityCheckForm = (
  options: UseEligibilityCheckFormOptions = {}
): UseEligibilityCheckFormReturn => {
  const { onProcessing } = options;
  const { isAuthenticated, user } = useAuth();
  const [formValues, setFormValues] = useState<EligibilityCheckFormValues>(
    DEFAULT_ELIGIBILITY_CHECK_FORM_VALUES
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isSubmitting = false;
  const hasPrefilledRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user || hasPrefilledRef.current) return;
    hasPrefilledRef.current = true;

    setFormValues((prev) => ({
      ...prev,
      ...(user.phoneNumber && !prev.phoneNumber ? { phoneNumber: user.phoneNumber } : {}),
      ...(user.email && !prev.email ? { email: user.email } : {}),
    }));
  }, [isAuthenticated, user]);


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
    if (!validateForm()) return;

    const payload = buildEligibilityCheckPayload(formValues);
    queueEligibilityCheck(payload);
    if (onProcessing) {
      onProcessing();
    }
  }, [formValues, onProcessing, validateForm]);

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
