import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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

interface UseBusinessLoanFormReturn {
  formValues: BusinessLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof BusinessLoanFormState, value: string | boolean) => void;
  getFieldError: (field: keyof BusinessLoanFormState) => string | undefined;
  validateCurrentStep: () => boolean;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => Promise<void>;
  currentStep: number;
  totalSteps: number;
  currentStepConfig: BusinessLoanStepConfig;
  currentStepFields: BusinessLoanStepFieldKey[];
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  showSuccess: boolean;
  canSubmit: boolean;
}

const PREFILL_QUERY_KEY = 'prefill';
const PREFILL_QUERY_VALUE = '1';

interface UseBusinessLoanFormOptions {
  /** Called when the API submit succeeds so the parent can show success state. */
  onSuccess?: () => void;
}

export const useBusinessLoanForm = (options: UseBusinessLoanFormOptions = {}): UseBusinessLoanFormReturn => {
  const { onSuccess } = options;
  const { isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();
  const enableBusinessLoanPrefill = useFeatureFlag('enableBusinessLoanPrefill');
  const [formValues, setFormValues] = useState<BusinessLoanFormState>(DEFAULT_FORM_STATE);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const hasPrefilledRef = useRef(false);
  const hasTestPrefilledRef = useRef(false);

  const isPrefillEnabled =
    enableBusinessLoanPrefill ||
    (process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production' && searchParams?.get(PREFILL_QUERY_KEY) === PREFILL_QUERY_VALUE);

  const handleFieldChange = useCallback((key: keyof BusinessLoanFormState, value: string | boolean): void => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

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
    const errors = validateBusinessLoanForm(formValues);
    const stepKeys = currentStepConfig.fieldKeys;
    const stepErrors: Record<string, string> = {};
    stepKeys.forEach((key) => {
      if (errors[key]) {
        stepErrors[key] = errors[key];
      }
    });
    setFormErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [formValues, currentStepConfig.fieldKeys]);

  const handleNext = useCallback((): void => {
    if (!validateCurrentStep()) return;
    setCurrentStep((prev) => Math.min(BUSINESS_LOAN_TOTAL_STEPS, prev + 1));
  }, [validateCurrentStep]);

  const handleBack = useCallback((): void => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    setFormErrors({});
  }, []);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = buildBusinessLoanPayload(formValues);
      const success = await submitBusinessLoanEnquiry(payload);
      
      if (success) {
        const result = await fetchBusinessLoanStatus(user?.phoneNumber ?? '', new AbortController().signal);
        if (result.hasExistingLead) {
          setShowSuccess(true);
        }
        if (onSuccess) {
          onSuccess();
        }
        setCurrentStep(1);
        setFormValues(DEFAULT_FORM_STATE);
        setFormErrors({});
      }
    } finally {
        setIsSubmitting(false);
      
    }
  }, [formValues, isSubmitting]);

  const getFieldError = useCallback(
    (field: keyof BusinessLoanFormState): string | undefined => formErrors[field] ?? undefined,
    [formErrors]
  );

  const step3Keys = BUSINESS_LOAN_STEP_FIELD_MAPPING[3] ?? [];
  const canSubmit = useMemo((): boolean => {
    if (!formValues.consent) return false;
    const errors = validateBusinessLoanForm(formValues);
    const hasStep3Error = step3Keys.some((key) => errors[key]);
    return !hasStep3Error;
  }, [formValues, step3Keys]);

  // Auth prefill: set firstName, lastName, mobile, email from user once when available.
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

  // Test prefill: apply when ?prefill=1 in non-production.
  useEffect(() => {
    if (!isPrefillEnabled || process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' || hasTestPrefilledRef.current) return;
    hasTestPrefilledRef.current = true;
    setFormValues(BUSINESS_LOAN_PREFILL_TEST_VALUES);
    setFormErrors({});
  }, [isPrefillEnabled]);

  // Check existing lead when user is authenticated (runs on mount and when auth/phone change).
  useEffect(() => {
    if (!isAuthenticated || !user?.phoneNumber) return;

    const controller = new AbortController();

    const checkStatus = async (): Promise<void> => {
      const result = await fetchBusinessLoanStatus(user.phoneNumber, controller.signal);
      if (result.hasExistingLead) {
        setShowSuccess(true);
      }
    };

    checkStatus();

    return () => {
      controller.abort();
    };
  }, [isAuthenticated, user?.phoneNumber]);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === BUSINESS_LOAN_TOTAL_STEPS;

  return {
    formValues,
    formErrors,
    handleFieldChange,
    getFieldError,
    validateCurrentStep,
    handleNext,
    handleBack,
    handleSubmit,
    currentStep,
    totalSteps: BUSINESS_LOAN_TOTAL_STEPS,
    currentStepConfig,
    currentStepFields,
    isFirstStep,
    isLastStep,
    isSubmitting,
    showSuccess,
    canSubmit,
  };
};
