'use client';

/**
 * Lead Form Modal Component
 * Full-screen mobile-first multi-step form for lead capture
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
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
import { fetchUserIp, getCurrentDateTime } from '@/lib/api/lead-service';
import {
  isMultiLenderCreditCardSectionComplete,
} from '@/lib/utils/form-helpers';
import { MULTILENDER_PARTNER_TERMS_HREF, UNITY_CONSENT } from '@/lib/constants/common';
import type { FormField, FormFieldKey, LeadFormData } from '@/types/lead';
import DynamicField from './dynamic-field';
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
const MULTI_LENDER_PARTNER_CONSENT_KEY: FormFieldKey = 'consentPartnerTerms';

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

/* LNT CONSENTS */
const LNT_CONSENTS = [
  {
    key: 'consentHardPull',
    consentCode: 'HARD_PULL',
    apiText:
      'I confirm that submission of Aadhaar/Proof of possession of AADHAAR number for KYC purposes is not mandatory, however, I voluntarily consent for providing the same for authentication & verification.',
    uiText:
      'I confirm that submission of Aadhaar/Proof of possession of AADHAAR number for KYC purposes is not mandatory, however, I voluntarily consent for providing the same for authentication & verification.'
  },
  {
    key: 'consentPrivacyPolicy',
    consentCode: 'PRIVACY_POLICY',
    apiText:
      'I hereby consent in favour of L&T Finance Ltd. to collect, store & process my personal data...',
    uiText:
      'I hereby also agree to have read & understood the Personal Loan Terms & Conditions and Privacy Policy and consent to the same.',
    links: [
      {
        label: 'Personal Loan Terms & Conditions',
        url: 'https://www.ltfinance.com/docs/default-source/default-document-library/pl_application_t-c.pdf?sfvrsn=ebbca65c_3',
      },
      {
        label: 'Privacy Policy',
        url: 'https://www.ltfinance.com/privacy-policy',
      },
    ],
  },
  {
    key: 'consentIndianResident',
    consentCode: 'RESIDENTIAL_STATUS_INDIAN',
    apiText: 'I hereby consent that I am an Indian Resident.',
    uiText: 'I confirm that I am an Indian resident.',
  },
  {
    key: 'consentIncome',
    consentCode: 'HOUSEHOLD_INCOME_GTE_3L',
    apiText: 'I hereby consent that my household income is greater than Rs 3,00,000.',
    uiText: 'I hereby consent that my household income is greater than Rs 3,00,000',
  },
];

interface LntConsentPayload {
  consentCode: string;
  consentText: string;
  submittedAt: string;
}

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
  requiredLoanAmount: '100000',
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

/**
 * Maps Yes/No strings from the dynamic form to the boolean on LeadFormData.
 * Returns undefined when the lender did not ask the question or the answer is not yet Yes/No.
 */
function resolveHasCreditCardForLeadPayload(
  hasCreditCardQuestionField: boolean,
  creditCardAnswer: string | undefined,
): boolean | undefined {
  if (!hasCreditCardQuestionField) {
    return undefined;
  }
  if (creditCardAnswer === 'true') {
    return true;
  }
  if (creditCardAnswer === 'false') {
    return false;
  }
  return undefined;
}

/**
 * Hide credit limit until the user selects Yes, regardless of single-page or stepper layout.
 */
function shouldRenderFieldGivenCreditCardChoice(
  field: FormField,
  isCreditCardYes: boolean,
): boolean {
  return field.key !== 'creditCardLimit' || isCreditCardYes;
}

/**
 * Builds `/offers` navigation with `newLead=true`, optional `lenderName` from the form,
 * and affiliate / tracking params preserved from the current page query and session store
 * (so UTM, partner, etc. survive after submit when they were present on the landing URL).
 */
function buildOffersPathAfterLeadSuccess(
  lenderNameProp: string,
  searchParams: ReadonlyURLSearchParams | null,
): string {
  const qs = new URLSearchParams(searchParams?.toString() ?? '');
  qs.delete('pre_auth');
  qs.delete('mn');
  qs.set('newLead', 'true');
  if (lenderNameProp) {
    qs.set('lenderName', lenderNameProp);
  }

  const st = useUrlParamsStore.getState();
  const mergeIfMissing = (key: string, value: string | null): void => {
    if (!value?.trim()) return;
    if (!qs.has(key)) {
      qs.set(key, value.trim());
    }
  };
  mergeIfMissing('partner', st.partner);
  mergeIfMissing('originSubLender', st.originSubLender);
  mergeIfMissing('utm_source', st.utm_source);
  mergeIfMissing('utm_medium', st.utm_medium);
  mergeIfMissing('utm_campaign', st.utm_campaign);

  if (!lenderNameProp && st.lendername) {
    if (!qs.has('lenderName') && !qs.has('lendername')) {
      qs.set('lenderName', st.lendername);
    }
  }

  return `/offers?${qs.toString()}`;
}

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
  const [showSuccess, setShowSuccess] = useState(false);
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
    setShowSuccess(false);
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

    let consents: LntConsentPayload[] = [];

    if (isLntLenderOrUpswignLntLender) {

      const allChecked = LNT_CONSENTS.every(c => formValues[c.key] === 'true');
      if (!allChecked) return;

      consents = LNT_CONSENTS.map(c => ({
        consentCode: c.consentCode,
        consentText: c.apiText,
        submittedAt: new Date().toISOString()
      }));

    }

    const formatDateForApi = (dateStr: string): string => {
      if (!dateStr) return '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
      }
      return dateStr;
    };

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

    const creditCardBool = resolveHasCreditCardForLeadPayload(
      hasCreditCardQuestionField,
      creditCardAnswer,
    );

    const formData: LeadFormData = {
      name: (formValues.name || '').trim(),
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
      requiredLoanAmount: formValues.requiredLoanAmount || '',
      maritalStatus: formValues.maritalStatus || '',
      addressType: formValues.addressType || '',
      permanentAddress: formValues.permanentAddress || '',
      modeOfSalary: formValues.modeOfSalary || '',
      companyName: isLntLenderOrUpswignLntLender ? lntCompanyName : formValues.companyName || '',
      companyAddress: formValues.companyAddress || '',
      companyPincode: formValues.companyPincode || '',
      ConsentIp: userIp || formValues.ConsentIp || '',
      ConsentDateTime: getCurrentDateTime(),
      consent: formValues.consent || 'false',
      consentPartnerTerms: formValues[MULTI_LENDER_PARTNER_CONSENT_KEY] || 'false',
      ...(isLntLenderOrUpswignLntLender && { consents }),
      ...(originSubLender && { originSubLender }),
      hasCreditCard: creditCardBool,
      creditCardLimit: formValues.creditCardLimit || '',
    };

    const submission = await createLead(formData, effectivePartnerCode, lenderName, lenderUniqueId);
    if (submission.success) {
      setShowSuccess(true);
      // Immediate navigation unmounts this route's modal before the overlay paints; Prime PL stays here.
      if (submission.isPrimePlLead) {
        console.info('[LeadFormModal] Prime PL lead — skipping /offers navigation so success overlay stays visible.', {
          lenderName: lenderName || '(all-lenders)',
        });
        pushOfferpageEvent({
          offerList: ['primepl'],
          maxLoanAmount: 0,
          declaredSalary: formValues.salary,
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
    formValues,
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
    const hasLntConsents =
      !isLntLenderOrUpswignLntLender ||
      LNT_CONSENTS.every(c => formValues[c.key] === 'true');
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

            const fieldsToRender =
              section.title === 'Identity Verification'
                ? sectionFields.filter((field) => shouldRenderFieldGivenCreditCardChoice(field, isCreditCardYes))
                : sectionFields;
            return (
              <section key={section.title} className="space-y-4">
                <h3 className="lead-form-heading">{section.title}</h3>
                <div className="space-y-5">
                  {section.title === 'Identity Verification'
                    ? fieldsToRender
                      .filter((field) => field.key !== 'consent')
                      .map((field) => renderField(field))
                    : fieldsToRender.map((field) => renderField(field))}
                  {section.title === 'Identity Verification' && (
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
          )}
            {isLntLenderOrUpswignLntLender && LNT_CONSENTS.map(consent => (
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
              className="absolute inset-0 bg-white z-100 flex flex-col items-center justify-center"
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
                  <h3 className="text-2xl font-bold text-gray-900">
                    {isPrimePlLeadSuccess ? 'Thank you' : 'Success!'}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {isPrimePlLeadSuccess
                      ? 'Our team will contact you shortly.'
                      : 'Your application has been submitted'}
                  </p>
                  {isPrimePlLeadSuccess ? (
                    <ActionButton
                      type="button"
                      className="mt-8 min-w-[200px]"
                      onClick={onClose}
                    >
                      Continue
                    </ActionButton>
                  ) : null}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            {isAllLenders ? 'Personal Loan' : `Personal Loan (${currentStep}/4)`}
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
                  {!isSinglePage && (
                    <h2 className="lead-form-heading">
                      {currentStepConfig.title}
                    </h2>
                  )}

                  {isSinglePage ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      {renderStepContent()}
                    </motion.div>
                  ) : (
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
                  )}

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
