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
import { Button } from '@/components/ui/button';
import { ActionButton } from '@/components/shared';
import { PARTNER_CODE } from '@/lib/constants/api-keys';
import { fetchUserIp, getCurrentDateTime } from '@/lib/api/lead-service';
import type { FormField, FormFieldKey, LeadFormData } from '@/types/lead';
import { cn } from '@/lib/utils';
import PersonalInfoStep from './steps/personal-info-step';
import AddressInfoStep from './steps/address-info-step';
import EmploymentInfoStep from './steps/employment-info-step';
import IdentityVerificationStep from './steps/identity-verification-step';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lenderName: string;
  partnerCode?: string;
  onSuccess?: (leadId: string) => void;
  isAllLenders?: boolean;
}

const PREFILL_QUERY_KEY = 'prefill';
const PREFILL_QUERY_VALUE = '1';
const sampleLeadValues: Partial<Record<FormFieldKey, string>> = {
  name: 'Test User',
  mobile: '9876543210',
  dob: '01-01-1990',
  email: 'test.user@example.com',
  pan: 'ABCDE1234F',
  pincode: '560001',
  gender: 'male',
  employmentType: 'salaried',
  salary: '50000',
  companyName: 'Test Company',
  companyAddress: '123 Test Street',
  companyPincode: '560001',
  permanentAddress: '123 Test Street',
  addressType: 'current',
  maritalStatus: 'single',
  modeOfSalary: 'bank',
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
}: LeadFormModalProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fields, isLoading: isFieldsLoading, error: fieldsError, fetchFields } = useFetchFormFields();
  const { createLead, isLoading: isSubmitting, error: submitError } = useCreateLead();
  const [userIp, setUserIp] = useState<string>('');
  const [consent, setConsent] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const ipFetched = useRef(false);

  const {
    currentStep,
    firstName,
    lastName,
    formValues,
    formErrors,
    currentStepConfig,
    setFirstName,
    setLastName,
    handleFieldChange,
    handleNext,
    handleBack,
    initializeFormValues,
  } = useLeadForm(fields);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 4;
  const isPrefillEnabled = process.env.NODE_ENV !== 'production'
    && searchParams?.get(PREFILL_QUERY_KEY) === PREFILL_QUERY_VALUE;

  // Fetch user IP on mount
  useEffect(() => {
    if (isOpen && !ipFetched.current) {
      ipFetched.current = true;
      fetchUserIp().then(setUserIp);
    }
  }, [isOpen]);

  // Fetch form fields when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    if (isAllLenders) {
      fetchFields('', true);
    } else if (lenderName) {
      fetchFields(lenderName, true);
    }
  }, [isOpen, isAllLenders, lenderName, fetchFields]);

  // Initialize form values from API response
  useEffect(() => {
    if (fields.length > 0 && userIp) {
      const prefilledFields = getPrefilledFields({ fields, isEnabled: isPrefillEnabled, userIp });
      initializeFormValues(prefilledFields, userIp);
    }
  }, [fields, isPrefillEnabled, userIp, initializeFormValues]);

  const handleHeaderBackClick = useCallback((): void => {
    if (isFirstStep) {
      onClose();
    } else {
      handleBack();
    }
  }, [isFirstStep, onClose, handleBack]);

  const handleSubmit = useCallback(async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    
    if (!consent) {
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    
    const formData: LeadFormData = {
      name: fullName,
      mobile: formValues.mobile || '',
      dob: formValues.dob || '',
      email: formValues.email || '',
      pan: formValues.pan || '',
      pincode: formValues.pincode || '',
      gender: formValues.gender || '',
      employmentType: formValues.employmentType || '',
      salary: formValues.salary || '',
      maritalStatus: formValues.maritalStatus || '',
      addressType: formValues.addressType || '',
      permanentAddress: formValues.permanentAddress || '',
      modeOfSalary: formValues.modeOfSalary || '',
      companyName: formValues.companyName || '',
      companyAddress: formValues.companyAddress || '',
      companyPincode: formValues.companyPincode || '',
      ConsentIp: userIp || formValues.ConsentIp || '',
      ConsentDateTime: getCurrentDateTime(),
    };
    
    const success = await createLead(formData, partnerCode, lenderName);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess('');
        } else {
          // Case A: Redirect to offers with newLead=true to trigger polling
          router.push('/offers?newLead=true');
        }
        onClose();
      }, 2000);
    }
  }, [consent, firstName, lastName, formValues, userIp, createLead, partnerCode, lenderName, onSuccess, router, onClose]);

  const renderConsentSection = (): React.ReactElement | null => {
    if (!isLastStep) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pt-6 border-t border-gray-200"
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="modal-consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="modal-consent" className="text-sm text-gray-700 cursor-pointer flex-1">
            I agree to the{' '}
            <a
              href="/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Privacy Policy
            </a>{' '}
            of WeCredit. I authorize WeCredit and its partners to contact me.
          </label>
        </div>
        {!consent && (
          <p className="text-xs text-red-500 mt-2 ml-8">Please accept to continue</p>
        )}
      </motion.div>
    );
  };

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

    return (
      <ActionButton
        type="submit"
        onClick={handleSubmit}
        disabled={!consent}
        isLoading={isSubmitting}
        fullWidth
        className="h-14 text-base"
      >
        Submit
      </ActionButton>
    );
  };

  const renderStepContent = (): React.ReactElement | null => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            firstName={firstName}
            lastName={lastName}
            mobile={formValues.mobile || ''}
            dob={formValues.dob || ''}
            email={formValues.email || ''}
            gender={formValues.gender || ''}
            maritalStatus={formValues.maritalStatus || ''}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onMobileChange={(val) => handleFieldChange('mobile', val)}
            onDobChange={(val) => handleFieldChange('dob', val)}
            onEmailChange={(val) => handleFieldChange('email', val)}
            onGenderChange={(val) => handleFieldChange('gender', val)}
            onMaritalStatusChange={(val) => handleFieldChange('maritalStatus', val)}
            errors={formErrors}
            disabled={isSubmitting}
          />
        );
      
      case 2:
        return (
          <AddressInfoStep
            addressType={formValues.addressType || ''}
            address={formValues.permanentAddress || ''}
            pincode={formValues.pincode || ''}
            onAddressTypeChange={(val) => handleFieldChange('addressType', val)}
            onAddressChange={(val) => handleFieldChange('permanentAddress', val)}
            onPincodeChange={(val) => handleFieldChange('pincode', val)}
            errors={formErrors}
            disabled={isSubmitting}
          />
        );
      
      case 3:
        return (
          <EmploymentInfoStep
            employmentType={formValues.employmentType || ''}
            salary={formValues.salary || ''}
            companyAddress={formValues.companyAddress || ''}
            companyPincode={formValues.companyPincode || ''}
            onEmploymentTypeChange={(val) => handleFieldChange('employmentType', val)}
            onSalaryChange={(val) => handleFieldChange('salary', val)}
            onCompanyAddressChange={(val) => handleFieldChange('companyAddress', val)}
            onCompanyPincodeChange={(val) => handleFieldChange('companyPincode', val)}
            errors={formErrors}
            disabled={isSubmitting}
          />
        );
      
      case 4:
        return (
          <IdentityVerificationStep
            pan={formValues.pan || ''}
            onPanChange={(val) => handleFieldChange('pan', val)}
            errors={formErrors}
            disabled={isSubmitting}
          />
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-white"
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
        <div className="bg-white border-b px-4 py-4 flex items-center gap-3">
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
        <div className="flex flex-col h-[calc(100vh-64px)]">
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
                  onClick={() => fetchFields(lenderName, true)}
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

                  {renderConsentSection()}
                  {renderSubmitError()}
                </form>
              </div>

              {/* Footer Button */}
              <div className="border-t bg-white p-4">
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
