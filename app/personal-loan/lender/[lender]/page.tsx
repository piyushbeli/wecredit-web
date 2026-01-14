'use client';

/**
 * Campaign Form Page
 * Dynamic form page that fetches fields based on lender and creates leads
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useFetchFormFields } from '@/hooks/use-fetch-form-fields';
import { useCreateLead } from '@/hooks/use-create-lead';
import DynamicFormField from '@/components/forms/dynamic-form-field';
import { Button } from '@/components/ui/button';
import { PARTNER_CODE } from '@/lib/constants/api-keys';
import { fetchUserIp, getCurrentDateTime } from '@/lib/api/lead-service';
import type { LeadFormData } from '@/types/lead';

/** Loading skeleton for form fields */
const FormSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-12 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

/** Error display component */
const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="text-center py-8">
    <div className="text-red-500 mb-4">{message}</div>
    <Button onClick={onRetry} variant="outline">
      Try Again
    </Button>
  </div>
);

/**
 * Campaign form page component
 * Renders a dynamic form based on lender configuration
 */
export default function CampaignFormPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lenderName = params.lender as string;
  const partnerCode = searchParams.get('partner') || PARTNER_CODE;
  const { fields, isLoading: isFieldsLoading, error: fieldsError, fetchFields } = useFetchFormFields();
  const { createLead, isLoading: isSubmitting, error: submitError } = useCreateLead();
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [userIp, setUserIp] = useState<string>('');
  const ipFetched = useRef(false);

  // Fetch user IP on mount
  useEffect(() => {
    if (!ipFetched.current) {
      ipFetched.current = true;
      fetchUserIp().then(setUserIp);
    }
  }, []);

  // Fetch form fields on mount
  useEffect(() => {
    if (lenderName) {
      fetchFields(lenderName, true);
    }
  }, [lenderName, fetchFields]);

  // Pre-fill form values from API response
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    fields.forEach((field) => {
      // Auto-fill consent fields
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
    // Clear error when field is modified
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  }, [formErrors]);

  const handleRetry = useCallback((): void => {
    fetchFields(lenderName, true);
  }, [lenderName, fetchFields]);

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
      alert('Please accept terms and conditions');
      return;
    }
    if (!validateForm()) {
      return;
    }
    // Convert form values to LeadFormData type
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
      router.push('/offers');
    }
  };

  // Loading state
  if (isFieldsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for Loan</h1>
            <p className="text-gray-600 mb-6">Loading form...</p>
            <FormSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (fieldsError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for Loan</h1>
            <ErrorMessage message={fieldsError} onRetry={handleRetry} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for Loan</h1>
            <p className="text-gray-600">
              Fill in your details to see offers from{' '}
              <span className="font-semibold capitalize">{lenderName}</span>
            </p>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <DynamicFormField
                key={field.key}
                field={field}
                value={formValues[field.key] || ''}
                onChange={handleFieldChange}
                error={formErrors[field.key]}
                disabled={isSubmitting}
              />
            ))}
            {/* Consent Checkbox */}
            <div className="flex items-start gap-3 py-2">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="consent" className="text-sm text-gray-600">
                I agree to the{' '}
                <a
                  href="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Terms and Policy
                </a>{' '}
                of WeCredit.
              </label>
            </div>
            {/* Submit Error */}
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !consent}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Get Offer'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
