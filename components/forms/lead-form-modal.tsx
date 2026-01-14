'use client';

/**
 * Lead Form Modal Component
 * Responsive, modern modal with grid-based dynamic form for lead capture
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useFetchFormFields } from '@/hooks/use-fetch-form-fields';
import { useCreateLead } from '@/hooks/use-create-lead';
import DynamicFormField from '@/components/forms/dynamic-form-field';
import { Button } from '@/components/ui/button';
import { PARTNER_CODE } from '@/lib/constants/api-keys';
import { fetchUserIp, getCurrentDateTime } from '@/lib/api/lead-service';
import type { LeadFormData, FormField } from '@/types/lead';
import { cn } from '@/lib/utils';

/** Props for LeadFormModal */
interface LeadFormModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Lender name for the campaign */
  lenderName: string;
  /** Optional partner code override */
  partnerCode?: string;
  /** Optional callback on successful lead creation */
  onSuccess?: (leadId: string) => void;
  /** Whether to fetch fields for all lenders */
  isAllLenders?: boolean;
}

/**
 * Groups form fields into sections for better UX
 */
interface FieldSection {
  title: string;
  fields: FormField[];
}

/**
 * Categorizes fields into sections
 */
function categorizeFields(fields: FormField[]): FieldSection[] {
  const personalFields = ['name', 'mobile', 'email', 'dob', 'gender', 'pan', 'maritalStatus'];
  const addressFields = ['pincode', 'permanentAddress', 'addressType'];
  const employmentFields = ['employmentType', 'salary', 'companyName', 'companyAddress', 'companyPincode', 'modeOfSalary'];

  const sections: FieldSection[] = [];

  const personal = fields.filter(f => personalFields.includes(f.key));
  if (personal.length > 0) {
    sections.push({ title: 'Personal Information', fields: personal });
  }

  const address = fields.filter(f => addressFields.includes(f.key));
  if (address.length > 0) {
    sections.push({ title: 'Address Details', fields: address });
  }

  const employment = fields.filter(f => employmentFields.includes(f.key));
  if (employment.length > 0) {
    sections.push({ title: 'Employment Details', fields: employment });
  }

  return sections;
}

/**
 * Determines the grid column span for a field based on its type
 * Uses 6-column grid system for flexible layouts
 */
function getFieldColSpan(fieldKey: string): string {
  // Full width fields (6 columns)
  const fullWidthFields = ['email', 'permanentAddress', 'companyAddress'];
  if (fullWidthFields.includes(fieldKey)) {
    return 'col-span-6';
  }

  // Small fields (2 columns = 1/3 width on tablet+)
  const smallFields = ['pincode', 'companyPincode', 'gender', 'maritalStatus', 'addressType'];
  if (smallFields.includes(fieldKey)) {
    return 'col-span-6 sm:col-span-3 lg:col-span-2';
  }

  // Medium fields (3 columns = 1/2 width on tablet+) - default
  return 'col-span-6 sm:col-span-3';
}

/**
 * Lead Form Modal
 * Responsive modal with grid layout and sectioned form fields
 */
const LeadFormModal = ({
  isOpen,
  onClose,
  lenderName,
  partnerCode = PARTNER_CODE,
  isAllLenders = false,
  onSuccess,
}: LeadFormModalProps) => {
  const router = useRouter();
  const { fields, isLoading: isFieldsLoading, error: fieldsError, fetchFields } = useFetchFormFields();
  const { createLead, isLoading: isSubmitting, error: submitError } = useCreateLead();
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [userIp, setUserIp] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const ipFetched = useRef(false);

  const handleFetchFields = useCallback(() => {

    // Fetch fields for all lenders
    if (isAllLenders) {
      fetchFields('', true);
      return;
    }

    // Fetch fields for a specific lender
    if (lenderName) {
      fetchFields(lenderName, true);
    }
  }, [isAllLenders, lenderName, fetchFields]); 

  // Fetch user IP on mount
  useEffect(() => {
    if (isOpen && !ipFetched.current) {
      ipFetched.current = true;
      fetchUserIp().then(setUserIp);
    }
  }, [isOpen]);

  // Fetch form fields when modal opens
  useEffect(() => {
    handleFetchFields();
  }, [isOpen, handleFetchFields]);

  // Pre-fill form values from API response
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.key === 'ConsentIp') {
        initialValues[field.key] = userIp;
      } else if (field.key === 'ConsentDateTime') {
        initialValues[field.key] = getCurrentDateTime();
      } else {
        initialValues[field.key] = field.value?.trim() || '';
      }
    });
    setFormValues(initialValues);
  }, [fields, userIp]);

  const handleFieldChange = useCallback((key: string, value: string): void => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  }, [formErrors]);

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.isMandatory && !formValues[field.key]?.trim()) {
        errors[field.key] = `${field.title} is required`;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [fields, formValues]);

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (!consent) {
      return;
    }
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const formData: LeadFormData = {
      name: formValues.name || '',
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
          router.push('/offers');
        }
        onClose();
      }, 2000);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
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
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5 flex items-center justify-between z-10 shadow-md">
              <div>
                <h2 className="text-xl font-bold">Apply for Loan</h2>
                <p className="text-sm text-blue-100">Complete your application in minutes</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] bg-gray-50">
              {isFieldsLoading ? (
                <div className="p-6 space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="h-5 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
                      <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-6 sm:col-span-3 space-y-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-12 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="col-span-6 sm:col-span-3 space-y-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-12 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="col-span-6 sm:col-span-3 lg:col-span-2 space-y-2">
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                          <div className="h-12 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="col-span-6 space-y-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-12 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : fieldsError ? (
                <div className="p-6">
                  <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load form</h3>
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
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {categorizeFields(fields).map((section, idx) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold mr-3">
                          {idx + 1}
                        </span>
                        {section.title}
                      </h3>
                      <div className="grid grid-cols-6 gap-4 sm:gap-5">
                        {section.fields.map((field) => (
                          <div
                            key={field.key}
                            className={getFieldColSpan(field.key)}
                          >
                            <DynamicFormField
                              field={field}
                              value={formValues[field.key] || ''}
                              onChange={handleFieldChange}
                              error={formErrors[field.key]}
                              disabled={isSubmitting}
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {/* Consent Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
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

                  {/* Submit Error */}
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900">Submission Failed</p>
                        <p className="text-sm text-red-700 mt-1">{submitError}</p>
                      </div>
                    </motion.div>
                  )}
                </form>
              )}
            </div>

            {/* Footer */}
            {!isFieldsLoading && !fieldsError && (
              <div className="sticky bottom-0 bg-white border-t p-6 shadow-lg">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !consent}
                  className={cn(
                    'w-full h-14 text-base font-semibold rounded-xl shadow-lg',
                    'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
                    'transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadFormModal;
