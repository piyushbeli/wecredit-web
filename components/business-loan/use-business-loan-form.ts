import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormik, type FormikProps } from 'formik';
import { useAuth } from '@/hooks/use-auth';
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import { fetchBusinessLoanStatus, submitBusinessLoanEnquiry } from '@/lib/api/business-loan-service';
import {
  DEFAULT_FORM_STATE,
  BUSINESS_LOAN_PREFILL_TEST_VALUES,
  BUSINESS_LOAN_STEP_FIELD_MAPPING,
  BUSINESS_LOAN_STEP_TITLES,
  BUSINESS_LOAN_TOTAL_STEPS,
  buildBusinessLoanPayload,
  validateBusinessLoanForm,
  type BusinessLoanFormState,
  type BusinessLoanStepFieldKey,
} from './business-loan-form.config';

export interface BusinessLoanStepConfig {
  stepNumber: number;
  title: string;
  fieldKeys: BusinessLoanStepFieldKey[];
}

interface BusinessLoanFormStateResult {
  formik: FormikProps<BusinessLoanFormState>;
  isSubmitting: boolean;
  showSuccess: boolean;
  canSubmit: boolean;
  getFieldError: (field: keyof BusinessLoanFormState) => string | undefined;
  currentStep: number;
  totalSteps: number;
  currentStepConfig: BusinessLoanStepConfig;
  currentStepFields: BusinessLoanStepFieldKey[];
  handleNext: () => void;
  handleBack: () => void;
  validateCurrentStep: () => boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

/** Derive firstName and lastName from a single name string (e.g. from auth user). */
function splitFullName(fullName: string | undefined): { firstName: string; lastName: string } {
  if (!fullName?.trim()) return { firstName: '', lastName: '' };
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ') ?? '';
  return { firstName, lastName };
}

const PREFILL_QUERY_KEY = 'prefill';
const PREFILL_QUERY_VALUE = '1';

export const useBusinessLoanForm = (): BusinessLoanFormStateResult => {
  const { isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();
  const enableBusinessLoanPrefill = useFeatureFlag('enableBusinessLoanPrefill');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const hasPrefilledRef = useRef(false);
  const hasTestPrefilledRef = useRef(false);
  const isMountedRef = useRef(true);
  const hasCheckedStatusRef = useRef(false);

  // Prefill enabled by feature flag or by ?prefill=1 in non-production (testing only).
  const isPrefillEnabled =
    enableBusinessLoanPrefill ||
    (process.env.NODE_ENV !== 'production' && searchParams?.get(PREFILL_QUERY_KEY) === PREFILL_QUERY_VALUE);

  // Prevent state updates after unmount during async submit.
  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

  const initialValues = useMemo<BusinessLoanFormState>(() => {
    const { firstName, lastName } = splitFullName(user?.name);
    return {
      ...DEFAULT_FORM_STATE,
      mobile: user?.phoneNumber || '',
      email: user?.email || '',
      firstName: firstName || DEFAULT_FORM_STATE.firstName,
      lastName: lastName || DEFAULT_FORM_STATE.lastName,
    };
  }, [user]);

  const formik = useFormik<BusinessLoanFormState>({
    initialValues,
    enableReinitialize: false,
    validateOnMount: true,
    validate: validateBusinessLoanForm,
    onSubmit: async (values, helpers) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      const payload = buildBusinessLoanPayload(values);
      const success = await submitBusinessLoanEnquiry(payload);

      if (!isMountedRef.current) return;
      setIsSubmitting(false);

      if (success) {
        setShowSuccess(true);
        setCurrentStep(1);
        helpers.resetForm({ values: DEFAULT_FORM_STATE });
      }
    },
  });

  useEffect(() => {
    // Prefill once to avoid overwriting user edits when auth state changes.
    if (!isAuthenticated || !user || hasPrefilledRef.current) return;
    hasPrefilledRef.current = true;

    const { firstName, lastName } = splitFullName(user.name);
    if (!formik.values.firstName && firstName) {
      formik.setFieldValue('firstName', firstName, false);
    }
    if (!formik.values.lastName && lastName) {
      formik.setFieldValue('lastName', lastName, false);
    }
    if (!formik.values.mobile && user.phoneNumber) {
      formik.setFieldValue('mobile', user.phoneNumber, false);
    }
    if (!formik.values.email && user.email) {
      formik.setFieldValue('email', user.email, false);
    }
  }, [isAuthenticated, user, formik]);

  // One-time test prefill: apply only when enabled, in non-production, and not yet applied (avoids overwriting user edits).
  // Pass validate=true so Formik re-runs validation and updates isValid, enabling the Apply button.
  useEffect(() => {
    if (!isPrefillEnabled || process.env.NODE_ENV === 'production' || hasTestPrefilledRef.current) return;
    hasTestPrefilledRef.current = true;
    formik.setValues(BUSINESS_LOAN_PREFILL_TEST_VALUES, true);
  }, [isPrefillEnabled, formik]);

  useEffect(() => {
    // Check existing lead once on page load to avoid duplicate submissions.
    if (!isAuthenticated || !user?.phoneNumber || hasCheckedStatusRef.current) return;
    hasCheckedStatusRef.current = true;

    const controller = new AbortController();

    const checkStatus = async (): Promise<void> => {
      const result = await fetchBusinessLoanStatus(user.phoneNumber, controller.signal);
      if (!isMountedRef.current) return;
      if (result.hasExistingLead) {
        setShowSuccess(true);
      }
    };

    checkStatus();

    return () => {
      // Ensure in-flight check doesn't update state after unmount.
      controller.abort();
    };
  }, [isAuthenticated, user?.phoneNumber]);

  const getFieldError = (field: keyof BusinessLoanFormState): string | undefined => {
    if (!formik.touched[field]) return undefined;
    return formik.errors[field];
  };

  const currentStepConfig: BusinessLoanStepConfig = useMemo(
    () => ({
      stepNumber: currentStep,
      title: BUSINESS_LOAN_STEP_TITLES[currentStep] ?? `Step ${currentStep}`,
      fieldKeys: BUSINESS_LOAN_STEP_FIELD_MAPPING[currentStep] ?? [],
    }),
    [currentStep]
  );

  const currentStepFields = currentStepConfig.fieldKeys;

  const validateCurrentStep = useCallback((): boolean => {
    const errors = validateBusinessLoanForm(formik.values);
    const stepKeys = currentStepConfig.fieldKeys;
    const hasStepError = stepKeys.some((key) => errors[key]);
    if (hasStepError) {
      stepKeys.forEach((key) => formik.setFieldTouched(key, true, false));
      return false;
    }
    return true;
  }, [formik, currentStepConfig.fieldKeys]);

  const handleNext = useCallback((): void => {
    if (!validateCurrentStep()) return;
    setCurrentStep((prev) => Math.min(BUSINESS_LOAN_TOTAL_STEPS, prev + 1));
  }, [validateCurrentStep]);

  const handleBack = useCallback((): void => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }, []);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === BUSINESS_LOAN_TOTAL_STEPS;

  return {
    formik,
    isSubmitting,
    showSuccess,
    canSubmit: formik.values.consent && formik.isValid,
    getFieldError,
    currentStep,
    totalSteps: BUSINESS_LOAN_TOTAL_STEPS,
    currentStepConfig,
    currentStepFields,
    handleNext,
    handleBack,
    validateCurrentStep,
    isFirstStep,
    isLastStep,
  };
};
