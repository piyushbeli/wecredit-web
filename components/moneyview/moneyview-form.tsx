'use client';

/**
 * MoneyView Form Component
 * Personal loan application form with MoneyView branding
 * Reuses existing hooks for form state, field fetching, and lead creation
 */

import { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import { useFetchFormFields } from '@/hooks/use-fetch-form-fields';
import { useCreateLead } from '@/hooks/use-create-lead';
import { useLeadForm } from '@/hooks/use-lead-form';
import { useAuth } from '@/hooks/use-auth';
import { useUrlParamsStore } from '@/stores/url-params-store';

import { PARTNER_CODE } from '@/lib/constants/api-keys';
import { fetchUserIp, getCurrentDateTime } from '@/lib/api/lead-service';
import { isMultiLenderCreditCardSectionComplete } from '@/lib/utils/form-helpers';

import DynamicField from '@/components/forms/dynamic-field';
import { ActionButton } from '@/components/shared';
import MoneyViewHeader from './moneyview-header';
import MoneyViewHero from './moneyview-hero';

import type { FormField, FormFieldKey, LeadFormData } from '@/types/lead';

interface MoneyViewFormProps {
  onSuccess?: (leadId: string) => void;
  onClose?: () => void;
}

const LENDER_NAME = 'moneyview';

/**
 * Maps Yes/No strings to boolean for the API payload
 */
function resolveHasCreditCardForPayload(
  hasCreditCardField: boolean,
  creditCardAnswer: string | undefined,
): boolean | undefined {
  if (!hasCreditCardField) return undefined;
  if (creditCardAnswer === 'true') return true;
  if (creditCardAnswer === 'false') return false;
  return undefined;
}

/** Hide credit limit until user selects Yes — same rule as LeadFormModal. */
function shouldRenderFieldGivenCreditCardChoice(
  field: FormField,
  isCreditCardYes: boolean,
): boolean {
  return field.key !== 'creditCardLimit' || isCreditCardYes;
}

const MoneyViewForm = ({ onSuccess, onClose }: MoneyViewFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { partner, originSubLender } = useUrlParamsStore();
  const lenderUniqueId = useUrlParamsStore.getState().lenderUniqueId ?? '';

  const {
    fields,
    isLoading: isFieldsLoading,
    error: fieldsError,
    fetchFields,
    reset: resetFields,
  } = useFetchFormFields();

  const {
    createLead,
    isLoading: isSubmitting,
    error: submitError,
    isPrimePlLeadSuccess,
  } = useCreateLead();

  const [userIp, setUserIp] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const isIpFetchInFlight = useRef(false);

  const effectivePartnerCode = partner || PARTNER_CODE;
  const hasCreditCardQuestionField = fields.some((field) => field.key === 'hasCreditCard');

  const {
    formValues,
    formErrors,
    currentStepFields,
    handleFieldChange,
    validateCurrentStep,
    validateField,
    initializeFormValues,
    isSinglePage,
  } = useLeadForm(fields, { singlePage: true });

  const creditCardAnswer = formValues.hasCreditCard;
  const isCreditCardYes = creditCardAnswer === 'true';
  const hasWeCreditConsent = formValues.consent === 'true';

  const isCreditCardSectionComplete = isMultiLenderCreditCardSectionComplete(
    hasCreditCardQuestionField,
    creditCardAnswer,
    formValues.creditCardLimit,
  );

  const visibleFormFields = currentStepFields.filter(
    (field) =>
      field.key !== 'consent' &&
      shouldRenderFieldGivenCreditCardChoice(field, isCreditCardYes),
  );

  // Fetch user IP on mount
  useEffect(() => {
    if (isIpFetchInFlight.current) return;
    isIpFetchInFlight.current = true;
    fetchUserIp()
      .then((ip) => setUserIp(ip))
      .finally(() => {
        isIpFetchInFlight.current = false;
      });
  }, []);

  // Fetch form fields on mount
  useEffect(() => {
    resetFields();
    fetchFields(LENDER_NAME, true);
  }, [fetchFields, resetFields]);

  // Initialize form values when fields load
  useEffect(() => {
    if (fields.length > 0 && userIp) {
      initializeFormValues(fields, userIp);
    }
  }, [fields, userIp, initializeFormValues]);

  const handlePrimePlContinue = useCallback(() => {
    router.replace('/');
  }, [router]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent): Promise<void> => {
      event.preventDefault();

      if (!validateCurrentStep()) {
        const firstError = document.querySelector('.border-red-300, input:invalid');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const consentField = fields.find((f) => f.key === 'consent');
      if (consentField && !hasWeCreditConsent) return;

      if (
        !isMultiLenderCreditCardSectionComplete(
          hasCreditCardQuestionField,
          creditCardAnswer,
          formValues.creditCardLimit,
        )
      ) {
        return;
      }

      const formatDateForApi = (dateStr: string): string => {
        if (!dateStr) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const [year, month, day] = dateStr.split('-');
          return `${day}-${month}-${year}`;
        }
        return dateStr;
      };

      const creditCardBool = resolveHasCreditCardForPayload(
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
        companyName: formValues.companyName || '',
        companyAddress: formValues.companyAddress || '',
        companyPincode: formValues.companyPincode || '',
        ConsentIp: userIp || formValues.ConsentIp || '',
        ConsentDateTime: getCurrentDateTime(),
        consent: formValues.consent || 'false',
        ...(originSubLender && { originSubLender }),
        hasCreditCard: creditCardBool,
        creditCardLimit: formValues.creditCardLimit || '',
      };

      const submission = await createLead(formData, effectivePartnerCode, LENDER_NAME, lenderUniqueId);

      if (submission.success) {
        setShowSuccess(true);
        if (submission.isPrimePlLead) {
          console.info('[MoneyViewForm] Prime PL lead — showing success overlay.');
        } else {
          const qs = new URLSearchParams(searchParams?.toString() ?? '');
          qs.set('newLead', 'true');
          qs.set('lenderName', LENDER_NAME);
          router.push(`/offers?${qs.toString()}`);
        }
        onSuccess?.(submission.leadId || '');
      }
    },
    [
      validateCurrentStep,
      fields,
      hasWeCreditConsent,
      hasCreditCardQuestionField,
      creditCardAnswer,
      formValues,
      userIp,
      originSubLender,
      createLead,
      effectivePartnerCode,
      lenderUniqueId,
      searchParams,
      router,
      onSuccess,
    ],
  );

  const renderField = (field: FormField) => (
    <DynamicField
      key={field.key}
      field={field}
      value={formValues[field.key] || ''}
      onChange={(val) => handleFieldChange(field.key, val)}
      onBlur={() => validateField(field.key)}
      error={formErrors[field.key]}
      disabled={isSubmitting || ((field.key === 'mobile' || field.key === 'phone') && isAuthenticated)}
      theme="moneyview"
    />
  );

  const renderSubmitError = () => {
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

  // Success overlay
  if (showSuccess) {
    return (
      <motion.div
        className="min-h-screen bg-white flex flex-col items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
          >
            <CheckCircle2 className="w-16 h-16 text-mv-green mx-auto" />
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
            {isPrimePlLeadSuccess && (
              <ActionButton
                type="button"
                className="mt-8 min-w-[200px] bg-mv-green! hover:bg-mv-green/90!"
                onClick={handlePrimePlContinue}
              >
                Continue
              </ActionButton>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Loading state
  if (isFieldsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <MoneyViewHeader />
        <MoneyViewHero />
        <div className="p-6 space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (fieldsError) {
    return (
      <div className="min-h-screen bg-white">
        <MoneyViewHeader />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to load form</h3>
            <p className="text-red-600 mb-6">{fieldsError}</p>
            <ActionButton
              onClick={() => fetchFields(LENDER_NAME, true)}
              className="bg-mv-green! hover:bg-mv-green/90!"
            >
              Try Again
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col ">
      {/* Header */}
      <MoneyViewHeader />

      {/* Hero with carousel */}
      <MoneyViewHero />

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-xl mx-auto w-full">
        <div className="flex-1 px-4 py-6 space-y-5">
          {visibleFormFields.map((field) => renderField(field))}

          {/* Consent checkbox */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                checked={hasWeCreditConsent}
                onChange={(e) => handleFieldChange('consent', e.target.checked ? 'true' : 'false')}
                className="mt-1 h-5 w-5 min-w-[20px] min-h-[20px] rounded border-gray-300 accent-mv-green focus:ring-mv-green cursor-pointer shrink-0"
              />
              <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
                I agree to the{' '}
                <Link
                  href="/terms-of-service"
                  target="_blank"
                  className="text-mv-green underline"
                >
                  Terms of Services.
                </Link>
              </label>
            </div>
            {formErrors.consent && (
              <p className="text-xs text-red-600 ml-8">{formErrors.consent}</p>
            )}
          </div>

          {renderSubmitError()}
        </div>

        {/* Fixed bottom button */}
        <div className="border-t bg-white px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <ActionButton
            type="submit"
            disabled={!hasWeCreditConsent || !isCreditCardSectionComplete}
            isLoading={isSubmitting}
            fullWidth
            className="h-12 text-lg !bg-mv-green hover:!bg-mv-green/90"
          >
            Next
          </ActionButton>
        </div>
      </form>
    </div>
  );
};

export default MoneyViewForm;
