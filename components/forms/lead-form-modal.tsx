'use client';

/**
 * Lead Form Modal Component
 * Full-screen mobile-first multi-step form for lead capture
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useFetchFormFields } from '@/hooks/use-fetch-form-fields';
import { useCreateLead } from '@/hooks/use-create-lead';
import { useLeadForm } from '@/hooks/use-lead-form';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { useAuth } from '@/hooks/use-auth';
import { useAppHeight } from '@/hooks/use-app-height';
import { useUrlParamsStore } from '@/stores/url-params-store';
import { Button } from '@/components/ui/button';
import { ActionButton } from '@/components/shared';
import { PARTNER_CODE } from '@/lib/constants/api-keys';
import { fetchUserIp, getCurrentDateTime } from '@/lib/api/lead-service';
import type { FormField, FormFieldKey, LeadFormData } from '@/types/lead';
import DynamicField from './dynamic-field';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lenderName: string;
  partnerCode?: string;
  onSuccess?: (leadId: string) => void;
  isAllLenders?: boolean;
  fetchDetails?: boolean;
}

const PREFILL_QUERY_KEY = 'prefill';
const PREFILL_QUERY_VALUE = '1';
const sampleLeadValues: Partial<Record<FormFieldKey, string>> = {
  name: 'Test User',
  mobile: '9876543210',
  phone: '9876543210',
  dob: '05-05-1999',
  email: 'test.user@example.com',
  pan: 'ABCDE1234F',
  pincode: '560001',
  gender: 'male',
  employmentType: 'salaried',
  salary: '50000',
  monthlyIncome: '50000',
  declaredIncome: '50000',
  loanAmount: '100000',
  companyName: 'Test Company',
  companyAddress: '123 Test Street',
  companyPincode: '560001',
  permanentAddress: '123 Test Street',
  addressType: 'current',
  maritalStatus: 'single',
  modeOfSalary: 'bank',
  consent: 'true',
};

interface PrefillOptions {
  fields: FormField[];
  isEnabled: boolean;
  userIp: string;
}

function getPrefillValue(fieldKey: FormFieldKey, userIp: string): string | null {
  if (fieldKey === 'ConsentIp' && userIp) return userIp;
  const sampleValue = sampleLeadValues[fieldKey];
  return sampleValue ?? null;
}

function getPrefilledFields({ fields, isEnabled, userIp }: PrefillOptions): FormField[] {
  if (!isEnabled) return fields;
  return fields.map((field) => {
    if (field.value?.trim()) return field;
    const prefillValue = getPrefillValue(field.key, userIp);
    if (!prefillValue) return field;
    return { ...field, value: prefillValue };
  });
}

const LeadFormModal = ({
  isOpen,
  onClose,
  lenderName,
  partnerCode = PARTNER_CODE,
  isAllLenders = false,
  onSuccess,
  fetchDetails = true,
}: LeadFormModalProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { partner, originSubLender, isConsumed, consumeParams } = useUrlParamsStore();
  const { fields, isLoading: isFieldsLoading, error: fieldsError, fetchFields, reset: resetFields } = useFetchFormFields();
  const { createLead, isLoading: isSubmitting, error: submitError } = useCreateLead();
  const [userIp, setUserIp] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const isIpFetchInFlight = useRef(false);
  
  // Use partner from URL if available and not yet consumed, otherwise use prop or default
  const effectivePartnerCode = !isConsumed && partner ? partner : partnerCode;

  const {
    currentStep,
    formValues,
    formErrors,
    currentStepConfig,
    currentStepFields,
    handleFieldChange,
    handleNext,
    handleBack,
    validateField,
    initializeFormValues,
  } = useLeadForm(fields);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 4;
  const isPrefillEnabled = process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production'
    && searchParams?.get(PREFILL_QUERY_KEY) === PREFILL_QUERY_VALUE;
  // Use visual viewport height to keep CTA visible above iOS Safari toolbars.
  const appHeightStyle = useAppHeight();
  const modalStyle: React.CSSProperties = {
    ...appHeightStyle,
    height: 'calc(var(--app-height, 1vh) * 100)',
  };

  // Reset any retained state on close (component stays mounted even when hidden).
  useEffect(() => {
    if (isOpen) return;
    setShowSuccess(false);
    setUserIp('');
    isIpFetchInFlight.current = false;
    resetFields();
  }, [isOpen, resetFields]);

  // Fetch user IP on every open (no FE caching).
  useEffect(() => {
    if (!isOpen) return;
    // Guard: avoid duplicate calls due to rapid toggles/renders.
    if (isIpFetchInFlight.current) return;
    isIpFetchInFlight.current = true;
    fetchUserIp()
      .then((ip) => {
        setUserIp(ip);
      })
      .finally(() => {
        isIpFetchInFlight.current = false;
      });
  }, [isOpen]);

  // Fetch form fields when modal opens (no FE caching).
  useEffect(() => {
    if (!isOpen) return;
    // Reset first to avoid briefly showing previous lender's fields while the fresh call is in flight.
    resetFields();

    if (isAllLenders) {
      fetchFields('', fetchDetails);
    } else if (lenderName) {
      fetchFields(lenderName, fetchDetails);
    }
  }, [isOpen, isAllLenders, lenderName, fetchDetails, fetchFields, resetFields]);

  // Initialize form values from API response
  useEffect(() => {
    if (fields.length > 0 && userIp) {
      const prefilledFields = getPrefilledFields({ fields, isEnabled: isPrefillEnabled, userIp });
      initializeFormValues(prefilledFields, userIp);
    }
  }, [fields, isPrefillEnabled, userIp, initializeFormValues]);

  // Lock body scroll when modal is open
  useBodyScrollLock(isOpen);

  const handleHeaderBackClick = useCallback((): void => {
    if (isFirstStep) {
      onClose();
    } else {
      handleBack();
    }
  }, [isFirstStep, onClose, handleBack]);

  const handleSubmit = useCallback(async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    // Check consent - always enforce when consent field is present, regardless of backend isMandatory flag.
    // This guarantees the user must actively agree before their personal data is submitted.
    const consentField = fields.find(f => f.key === 'consent');

    if (consentField) {
      const hasConsent = formValues.consent === 'true';
      if (!hasConsent) {
        // Don't submit if consent exists but is not checked
        return;
      }
    }

    // Convert date from YYYY-MM-DD (native input) to DD-MM-YYYY (API format)
    const formatDateForApi = (dateStr: string): string => {
      if (!dateStr) return '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
      }
      return dateStr;
    };

    // Build form data dynamically from all fields
    const formData: LeadFormData = {
      name: formValues.name || '',
      mobile: formValues.mobile || '',
      phone: formValues.phone || '',
      dob: formatDateForApi(formValues.dob || ''),
      email: formValues.email || '',
      pan: formValues.pan || '',
      pincode: formValues.pincode || '',
      gender: formValues.gender || '',
      employmentType: formValues.employmentType || '',
      salary: formValues.salary || '',
      monthlyIncome: formValues.monthlyIncome || '',
      declaredIncome: formValues.declaredIncome || '',
      loanAmount: formValues.loanAmount || '',
      maritalStatus: formValues.maritalStatus || '',
      addressType: formValues.addressType || '',
      permanentAddress: formValues.permanentAddress || '',
      modeOfSalary: formValues.modeOfSalary || '',
      companyName: formValues.companyName || '',
      companyAddress: formValues.companyAddress || '',
      companyPincode: formValues.companyPincode || '',
      ConsentIp: userIp || formValues.ConsentIp || '',
      ConsentDateTime: getCurrentDateTime(),
      consent: formValues.consent || 'false',
      // Add originSubLender from URL if available
      ...(originSubLender && !isConsumed && { originSubLender }),
    };

    const success = await createLead(formData, effectivePartnerCode, lenderName);
    if (success) {
      // Mark URL params as consumed after successful lead creation
      if (!isConsumed && (partner || originSubLender)) {
        consumeParams();
        console.log('[LeadForm] URL params consumed after successful submission');
      }
      setShowSuccess(true);
      if (onSuccess) {
        onSuccess('');
        onClose();
      } else {
        // Case A: Redirect to offers with newLead=true to trigger polling
        // Close first to avoid onClose navigation overriding the offers route.
        onClose();
        // router.push(`/offers?newLead=true`);
        router.push(`/offers?newLead=true&${lenderName ? `lenderName=${lenderName}` : ''}`);
      }
    }
  }, [formValues, userIp, createLead, effectivePartnerCode, lenderName, onSuccess, router, onClose, fields, partner, originSubLender, isConsumed, consumeParams]);


  const renderSubmitError = (): React.ReactElement | null => {
    if (!submitError) return null;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
      >
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-900">Submission Failed</p>
          <p className="text-sm text-red-700 mt-1">{submitError}</p>
        </div>
      </motion.div>
    );
  };

  const renderFooterButton = (): React.ReactElement => {
    if (!isLastStep) {
      return (
        <ActionButton
          type="button"
          onClick={handleNext}
          fullWidth
          className="h-14 text-base"
        >
          Next
        </ActionButton>
      );
    }

    // Always require consent in last step
    const hasConsent = formValues.consent === 'true';
    const isSubmitDisabled = !hasConsent;

    return (
      <ActionButton
        type="submit"
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        isLoading={isSubmitting}
        fullWidth
        className="h-14 text-base"
      >
        Submit
      </ActionButton>
    );
  };

  const renderStepContent = (): React.ReactElement | null => {
    // Debug logging
    if (process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production') {
      console.log(`[LeadFormModal] Rendering step ${currentStep}:`, {
        stepTitle: currentStepConfig.title,
        totalFieldsFromHook: currentStepFields.length,
        fields: currentStepFields.map(f => ({
          key: f.key,
          title: f.title,
          value: formValues[f.key] || f.value || '(empty)',
          hasError: !!formErrors[f.key],
        })),
        formValuesKeys: Object.keys(formValues),
      });
    }

    // currentStepFields already filters out hidden fields, no need to filter again
    const visibleFields = currentStepFields;

    // Handle empty step - show message
    if (visibleFields.length === 0) {
      if (process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production') {
        console.warn(`[LeadFormModal] Step ${currentStep} has no fields to render`);
      }
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No fields available for this step.</p>
        </div>
      );
    }

    // Render fields dynamically
    // Always show consent checkbox in last step, with Unity-specific text if lenderName === 'unity'
    if (isLastStep) {
      // Ensure consent is 'true' initially
      if (formValues['consent'] === undefined) {
        handleFieldChange('consent', 'true');
      }
      return (
        <>
          {visibleFields
            .filter(field => field.key !== 'consent')
            .map((field) => (
              <DynamicField
                key={field.key}
                field={field}
                value={formValues[field.key] || ''}
                onChange={(val) => handleFieldChange(field.key, val)}
                onBlur={() => validateField(field.key)}
                error={formErrors[field.key]}
                disabled={isSubmitting || ((field.key === 'mobile' || field.key === 'phone') && isAuthenticated)}
              />
            ))}
          <DynamicField
            field={{
              key: 'consent',
              title: 'Consent',
              type: 'boolean',
              options: [],
              value: 'true',
              isMandatory: true,
              order: 999,
              lenderName: lenderName === 'unity' ? 'unity' : undefined,
            }}
            value={formValues['consent'] || 'true'}
            onChange={(val) => handleFieldChange('consent', val)}
            onBlur={() => validateField('consent')}
            error={formErrors['consent']}
            disabled={isSubmitting}
          />
        </>
      );
    }
    // Default: render all fields
    return (
      <>
        {visibleFields.map((field) => {
          return (
            <DynamicField
              key={field.key}
              field={field}
              value={formValues[field.key] || ''}
              onChange={(val) => handleFieldChange(field.key, val)}
              onBlur={() => validateField(field.key)}
              error={formErrors[field.key]}
              disabled={isSubmitting || ((field.key === 'mobile' || field.key === 'phone') && isAuthenticated)}
            />
          );
        })}
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 bg-white flex flex-col"
        style={modalStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="absolute inset-0 bg-white z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                  <p className="text-gray-600 mt-2">Your application has been submitted</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="bg-white border-b px-4 py-4 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleHeaderBackClick}
            className="p-1 text-gray-700 hover:text-gray-900"
            aria-label={isFirstStep ? 'Close' : 'Back'}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-base font-medium text-gray-900">
            Personal Loan ({currentStep}/4)
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-h-0 max-w-xl mx-auto w-full">
          {isFieldsLoading ? (
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-12 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : fieldsError ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="lead-form-heading mb-2">Unable to load form</h3>
                <p className="text-red-600 mb-6">{fieldsError}</p>
                <Button
                  onClick={() => {
                    if (isAllLenders) {
                      fetchFields('', fetchDetails);
                    } else {
                      fetchFields(lenderName, fetchDetails);
                    }
                  }}
                  variant="outline"
                  className="min-w-[140px]"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <h2 className="lead-form-heading">
                    {currentStepConfig.title}
                  </h2>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      {renderStepContent()}
                    </motion.div>
                  </AnimatePresence>

                  {renderSubmitError()}
                </form>
              </div>

              {/* Footer Button */}
              <div className="border-t bg-white px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shrink-0">
                {renderFooterButton()}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeadFormModal;
