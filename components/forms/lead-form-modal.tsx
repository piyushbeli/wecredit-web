'use client';

/**
 * Lead Form Modal Component
 * Full-screen mobile-first multi-step form for lead capture
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useFetchFormFields } from '@/hooks/use-fetch-form-fields';
import { useCreateLead } from '@/hooks/use-create-lead' ;
import { useLeadForm } from '@/hooks/use-lead-form';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { useAuth } from '@/hooks/use-auth';
import { useAppHeight } from '@/hooks/use-app-height';
import { useUrlParamsStore } from '@/stores/url-params-store';
import { Button } from '@/components/ui/button';
import { ActionButton } from '@/components/shared';
import { PARTNER_CODE } from '@/lib/constants/api-keys';
import { fetchUserIp } from '@/lib/api/lead-service';
import {
  isMultiLenderCreditCardSectionComplete,
} from '@/lib/utils/form-helpers';
import {
  MULTI_LENDER_PARTNER_CONSENT_KEY,
  LNT_CONSENTS,
  areLntConsentsComplete,
  getPrefilledFields,
  shouldRenderFieldGivenCreditCardChoice,
  buildOffersPathAfterLeadSuccess,
  buildLeadFormData,
} from '@/lib/utils/lead-form-modal-helpers';
import { MULTILENDER_PARTNER_TERMS_HREF, UNITY_CONSENT } from '@/lib/constants/common';
import type { FormField, FormFieldKey } from '@/types/lead';
import DynamicField from './dynamic-field';
import PrimePlSuccessOverlay from './prime-pl-success-overlay';
import Link from 'next/link';
import { useInfoSearchParams } from '@/hooks/use-info-search-params';
import { pushOfferpageEvent } from '@/lib/gtm';

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

const STEP_SECTIONS: Array<{ title: string; fieldKeys: FormFieldKey[] }> = [
  {
    title: 'Personal Information',
    fieldKeys: ['name', 'mobile', 'dob', 'email', 'gender', 'maritalStatus'],
  },
  {
    title: 'Address Information',
    fieldKeys: ['addressType', 'permanentAddress', 'pincode'],
  },
  {
    title: 'Employment & Income',
    fieldKeys: ['employmentType', 'salary', 'monthlyIncome', 'declaredIncome', 'loanAmount', 'requiredLoanAmount', 'modeOfSalary', 'companyName', 'companyAddress', 'companyPincode'],
  },
  {
    title: 'Identity Verification',
    fieldKeys: ['pan', 'hasCreditCard', 'creditCardLimit', 'consent'],
  },
];

const LeadFormModal = ({
  isOpen,
  onClose,
  lenderName,
  partnerCode = PARTNER_CODE,
  isAllLenders = false,
  fetchDetails = true,
}: LeadFormModalProps) => {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { partner, originSubLender } = useUrlParamsStore();
  const lenderUniqueId = useUrlParamsStore.getState().lenderUniqueId ?? '';
  const { fields, isLoading: isFieldsLoading, error: fieldsError, fetchFields, reset: resetFields } = useFetchFormFields();
  const {
    createLead,
    isLoading: isSubmitting,
    error: submitError,
    isPrimePlLeadSuccess,
  } = useCreateLead();
  const [userIp, setUserIp] = useState<string>('');
  const [lntCompanyName, setLntCompanyName] = useState('');
  const [showPartnerConsentError, setShowPartnerConsentError] = useState(false);
  const {isAffiliate} = useInfoSearchParams();

  const isIpFetchInFlight = useRef(false);
  
  // Use partner from URL if available and not yet consumed, otherwise use prop or default
  const effectivePartnerCode =  partner ? partner : partnerCode;
  const isUnitySingleLender = lenderName?.toLowerCase() === 'unity' && !isAllLenders;
  const consentTitle = isUnitySingleLender ? UNITY_CONSENT : 'Consent';
  const isLntLenderOrUpswignLntLender = lenderName?.toLowerCase() === 'lnt' || lenderName?.toLowerCase() === 'upswing_lnt';
  /**
   * Credit card questions are only valid for all-lenders flow when:
   * user chose to proceed without full details fetch.
   * This single gate controls UI + validation + payload inclusion.
   */
  const hasCreditCardQuestionField = fields.some((field) => field.key === 'hasCreditCard');

  const {
    currentStep,
    formValues,
    formErrors,
    currentStepConfig,
    currentStepFields,
    handleFieldChange,
    handleNext,
    handleBack,
    validateCurrentStep,
    validateField,
    initializeFormValues,
    isSinglePage,
  } = useLeadForm(fields, { singlePage: isAllLenders });

  /** UI stores Yes/No as 'true' | 'false' strings — never use Boolean(string) here. */
  const creditCardAnswer = formValues.hasCreditCard;
  const isCreditCardYes = creditCardAnswer === 'true';

  const isFirstStep = currentStep === 1;
  const isLastStep = isSinglePage || currentStep === 4;
  const hasWeCreditConsent = formValues.consent === 'true';
  const hasPartnerConsent = formValues[MULTI_LENDER_PARTNER_CONSENT_KEY] === 'true';
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
    setShowPartnerConsentError(false);
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
    if (isAllLenders || isFirstStep) {
      onClose();
    } else {
      handleBack();
    }
  }, [isAllLenders, isFirstStep, onClose, handleBack]);

  // Prime PL is a terminal success path — user should land on home, not stay on /offers.
  const handlePrimePlContinueClick = useCallback((): void => {
    onClose();
    router.replace('/');
  }, [onClose, router]);

  const handleSubmit = useCallback(async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setShowPartnerConsentError(false);

    if (!validateCurrentStep()) {
      const firstError = document.querySelector('.border-red-300, input:invalid');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Check consent - always enforce when consent field is present, regardless of backend isMandatory flag.
    // This guarantees the user must actively agree before their personal data is submitted.
    const consentField = fields.find(f => f.key === 'consent');

    if (consentField) {
      if (!hasWeCreditConsent) return;
    }

    if (isAllLenders && !hasPartnerConsent) {
      // Partner terms consent is FE-only for now and must be explicitly checked.
      setShowPartnerConsentError(true);
      return;
    }

    if (isLntLenderOrUpswignLntLender && !areLntConsentsComplete(formValues)) {
      return;
    }

    // Multi-lender + flag: enforce credit card answers before hitting the API.
    if (
      !isMultiLenderCreditCardSectionComplete(
        hasCreditCardQuestionField,
        creditCardAnswer,
        formValues.creditCardLimit,
      )
    ) {
      return;
    }

    const formData = buildLeadFormData({
      formValues,
      userIp,
      isLntLenderOrUpswignLntLender,
      lntCompanyName,
      originSubLender,
      hasCreditCardQuestionField,
    });

    const submission = await createLead(formData, effectivePartnerCode, lenderName, lenderUniqueId);
    if (submission.success) {
      // Immediate navigation unmounts this route's modal before the overlay paints; Prime PL stays here.
      if (submission.isPrimePlLead) {
        console.info('[LeadFormModal] Prime PL lead — skipping /offers navigation so success overlay stays visible.', {
          lenderName: lenderName || '(all-lenders)',
        });
        pushOfferpageEvent({
          offerList: ['primepl'],
          maxLoanAmount: 0,
          declaredSalary: formValues.salary,
          requiredLoanAmount: formValues.requiredLoanAmount,
          empType: formValues.employmentType,
        });
      } else {
        console.info('[LeadFormModal] Standard lead — navigating to offers after success.', {
          lenderName: lenderName || '(all-lenders)',
        });
        router.push(buildOffersPathAfterLeadSuccess(lenderName, searchParams));
      }
    }
  }, [
    formValues,
    validateCurrentStep,
    fields,
    hasPartnerConsent,
    hasWeCreditConsent,
    isAllLenders,
    userIp,
    createLead,
    effectivePartnerCode,
    lenderName,
    lntCompanyName,
    originSubLender,
    router,
    searchParams,
  ]);

  /**
   * Browser default: Enter in an input submits the enclosing <form>.
   * On intermediate wizard steps that must advance with "Next", not create-lead.
   */
  const handleFormSubmit = useCallback(
    (event: React.FormEvent): void => {
      event.preventDefault();
      if (!isLastStep) {
        handleNext();
        return;
      }
      void handleSubmit(event);
    },
    [handleNext, handleSubmit, isLastStep],
  );


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
    if (!isSinglePage && !isLastStep) {
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
    const hasLntConsents = !isLntLenderOrUpswignLntLender || areLntConsentsComplete(formValues);
    const requiresPartnerConsent = isAllLenders;
    const canSubmitMultiLender = !requiresPartnerConsent || hasPartnerConsent;

    const isCreditCardSectionComplete = isMultiLenderCreditCardSectionComplete(
      hasCreditCardQuestionField,
      creditCardAnswer,
      formValues.creditCardLimit,
    );

    const isSubmitDisabled = !hasLntConsents || !isCreditCardSectionComplete || !canSubmitMultiLender ;

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

  const renderField = (field: FormField): React.ReactElement => (
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

  const renderMultiLenderPartnerConsent = (): React.ReactElement | null => {
    if (!isAllLenders) return null;
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id={MULTI_LENDER_PARTNER_CONSENT_KEY}
            checked={hasPartnerConsent}
            onChange={(event) => {
              const value = event.target.checked ? 'true' : 'false';
              handleFieldChange(MULTI_LENDER_PARTNER_CONSENT_KEY, value);
              if (event.target.checked) {
                setShowPartnerConsentError(false);
              }
            }}
            className="mt-1 h-5 w-5 min-w-[20px] min-h-[20px] rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
          />
          <label htmlFor={MULTI_LENDER_PARTNER_CONSENT_KEY} className="text-sm text-gray-700 leading-relaxed">
            I agree to the{' '}
            <Link target="_blank" href={MULTILENDER_PARTNER_TERMS_HREF} className="text-blue-600 underline">
              Terms & Conditions
            </Link>{' '}
            of the partners of WeCredit.
          </label>
        </div>
        {showPartnerConsentError && (
          <p className="text-xs text-red-600 ml-8">Please accept partner terms to continue.</p>
        )}
      </div>
    );
  };

  const renderMultiLenderWeCreditConsent = (): React.ReactElement => (
    <DynamicField
      field={{
        key: 'consent',
        title: consentTitle,
        type: 'boolean',
        options: [],
        value: 'true',
        isMandatory: true,
        order: 999,
        lenderName: isUnitySingleLender ? 'unity' : undefined,
      }}
      value={formValues.consent || 'true'}
      onChange={(val) => handleFieldChange('consent', val)}
      onBlur={() => validateField('consent')}
      error={formErrors.consent}
      disabled={isSubmitting}
    />
  );

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

    if (isSinglePage) {
      return (
        <div className="space-y-8">
          {STEP_SECTIONS.map((section) => {
            const sectionFields = currentStepFields.filter((field) => section.fieldKeys.includes(field.key));
            if (sectionFields.length === 0) {
              return null;
            }

            const isIdentityVerificationSection = section.title === 'Identity Verification';
            let sectionFieldsToRender: FormField[];
            if (isIdentityVerificationSection) {
              sectionFieldsToRender = sectionFields
                .filter((field) => shouldRenderFieldGivenCreditCardChoice(field, isCreditCardYes))
                .filter((field) => field.key !== 'consent');
            } else {
              sectionFieldsToRender = sectionFields;
            }
            return (
              <section key={section.title} className="space-y-4">
                <h3 className="lead-form-heading">{section.title}</h3>
                <div className="space-y-5">
                  {sectionFieldsToRender.map((field) => renderField(field))}
                  {isIdentityVerificationSection && (
                    <>
                      {renderMultiLenderWeCreditConsent()}
                      {renderMultiLenderPartnerConsent()}
                    </>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      );
    }

    // Render fields dynamically
    // Always show consent checkbox in last step, with Unity-specific text for the single-lender Unity flow
    if (isLastStep) {
      // Ensure consent is 'true' initially
      if (formValues['consent'] === undefined) {
        handleFieldChange('consent', 'true');
      }
      const lastStepFieldsExcludingConsent = visibleFields.filter((field) => field.key !== 'consent');
      // Match single-page behaviour: only show credit limit after user chooses Yes (API may include both on step 4).
      const lastStepFieldsToRender = lastStepFieldsExcludingConsent.filter((field) =>
        shouldRenderFieldGivenCreditCardChoice(field, isCreditCardYes),
      );
      return (
        <>
          {lastStepFieldsToRender.map((field) => renderField(field))}
          {isLntLenderOrUpswignLntLender && (
            <>
              <div className="space-y-2">
                <label className="lead-form-label">
                  Company Name
                </label>

                <input
                  type="text"
                  value={lntCompanyName}
                  onChange={(e) => setLntCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full px-4 py-3 rounded-lg border text-base border-gray-300 bg-white
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {LNT_CONSENTS.map(consent => (
              <div key={consent.key} className="space-y-1">

                <DynamicField
                  field={{
                    key: consent.key as FormFieldKey,
                    title:
  consent.key === 'consentPrivacyPolicy'
    ? `I hereby consent in favour of L&T Finance Ltd. to collect, store & process my personal data (incl. Aadhaar details, location, audio/video data collected during appraisal process) including fetching and verifying my KYC, bureau and digilocker information and sharing it with third parties for my loan application. I hereby also agree to have read & understood the`
    : consent.uiText,
                    type: 'boolean',
                    options: [],
                    value: 'true',
                    isMandatory: true,
                    order: 998,
                  }}
                  value={formValues[consent.key] || 'false'}
                  onChange={(val) => handleFieldChange(consent.key as FormFieldKey, val)}
                  onBlur={() => validateField(consent.key as FormFieldKey)}
                  error={formErrors[consent.key]}
                  disabled={isSubmitting}
                />
    {consent.key === 'consentPrivacyPolicy' && (
    <div className="ml-7 text-sm">
      <a
        href="https://www.ltfinance.com/docs/default-source/default-document-library/pl_application_t-c.pdf?sfvrsn=ebbca65c_3"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline mr-2"
      >
        Personal Loan terms & Conditions
      </a>
      and
      <a
        href="https://www.ltfinance.com/privacy-policy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline ml-2"
      >
        Privacy Policy
      </a>
      {' '}and consent to the same
    </div>
  )}


              </div>
              ))}
            </>
          )}
          <DynamicField
            field={{
              key: 'consent',
              title: consentTitle,
              type: 'boolean',
              options: [],
              value: 'true',
              isMandatory: true,
              order: 999,
              lenderName: isUnitySingleLender ? 'unity' : undefined,
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
        {visibleFields.map((field) => renderField(field))}
      </>
    );
  };

  const renderModalBody = (): React.ReactElement => {
    if (isFieldsLoading) {
      return (
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      );
    }

    if (fieldsError) {
      return (
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
      );
    }

    let stepContent: React.ReactNode;
    if (isSinglePage) {
      stepContent = (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-5"
        >
          {renderStepContent()}
        </motion.div>
      );
    } else {
      stepContent = (
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
      );
    }

    return (
      <>
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
            {!isSinglePage && (
              <h2 className="lead-form-heading">
                {currentStepConfig.title}
              </h2>
            )}

            {stepContent}

            {renderSubmitError()}
          </form>
        </div>

        {/* Footer Button */}
        <div className="border-t bg-white px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shrink-0">
          {renderFooterButton()}
        </div>
      </>
    );
  };

  const renderModalheadingLabel = () => {
    if (lenderName === 'basichomeloan') {
      return `Home loan (${currentStep}/4)`;
    }
    if (isAllLenders) {
      return 'Personal Loan';
    }
    return `Personal loan (${currentStep}/4)`;
  }

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
        <PrimePlSuccessOverlay
          isVisible={isPrimePlLeadSuccess}
          onContinue={handlePrimePlContinueClick}
        />

        {/* Header */}
        <div className="bg-white border-b px-4 py-4 flex items-center gap-3 shrink-0">
          {!isAffiliate &&<button
            type="button"
            onClick={handleHeaderBackClick}
            className="p-1 text-gray-700 hover:text-gray-900"
            aria-label={isAllLenders || isFirstStep ? 'Close' : 'Back'}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>}
          <h1 className="text-base font-medium text-gray-900">
            {renderModalheadingLabel()}
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-h-0 max-w-xl mx-auto w-full">
          {renderModalBody()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeadFormModal;
