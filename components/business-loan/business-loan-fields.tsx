'use client';

import { cn } from '@/lib/utils';
import InputField from '@/components/forms/input-field';
import ButtonGroup from '@/components/forms/button-group';
import SelectField from '@/components/forms/select-field';
import { BUSINESS_NATURE_CATEGORIES } from '@/lib/constants/business-loan';
import {
  COMPANY_TYPE_OPTIONS,
  GENDER_OPTIONS,
  sanitizeNumericInput,
  type BusinessLoanFormState,
  type HasGstValue,
} from './business-loan-form.config';
import type { FormikProps } from 'formik';

const PAN_HINT = 'As per PAN card';

interface BusinessLoanFieldsProps {
  stepNumber: number;
  formik: FormikProps<BusinessLoanFormState>;
  getFieldError: (field: keyof BusinessLoanFormState) => string | undefined;
}

const inputBaseClass = cn(
  'w-full px-4 py-3 rounded-lg border text-sm transition-colors',
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
);

const companyTypeOptions = COMPANY_TYPE_OPTIONS.map((option) => ({
  value: option,
  label: option,
}));

const genderOptions = GENDER_OPTIONS.map((option) => ({
  value: option,
  label: option,
}));

const gstOptions = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

const businessNatureOptionElements = BUSINESS_NATURE_CATEGORIES.map((category) => (
  <option key={category} value={category} />
));

const BusinessLoanFields = ({
  stepNumber,
  formik,
  getFieldError,
}: BusinessLoanFieldsProps): React.ReactNode => {
  const touchField = (field: keyof BusinessLoanFormState) => (): void => {
    formik.setFieldTouched(field, true, false);
  };

  const businessNatureError = getFieldError('businessNature');
  const businessNatureClassName = cn(
    inputBaseClass,
    businessNatureError ? 'border-red-300 bg-red-50' : 'border-gray-300'
  );
  const consentError = getFieldError('consent');

  // Step 1: Personal Information
  if (stepNumber === 1) {
    return (
      <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="lead-form-label">
              First Name <span className="text-red-500">*</span>
            </label>
            <InputField
              label="First Name"
              value={formik.values.firstName}
              onChange={(value) => formik.setFieldValue('firstName', value)}
              onBlur={touchField('firstName')}
              placeholder="First Name"
              error={getFieldError('firstName')}
              required
              autoComplete="given-name"
            />
            <p className="text-xs text-gray-500 mt-1">{PAN_HINT}</p>
          </div>
          <div>
            <label className="lead-form-label">
              Last Name <span className="text-red-500">*</span>
            </label>
            <InputField
              label="Last Name"
              value={formik.values.lastName}
              onChange={(value) => formik.setFieldValue('lastName', value)}
              onBlur={touchField('lastName')}
              placeholder="Last Name"
              error={getFieldError('lastName')}
              required
              autoComplete="family-name"
            />
            <p className="text-xs text-gray-500 mt-1">{PAN_HINT}</p>
          </div>
        </div>

        <div>
          <label className="lead-form-label">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <InputField
            label="Phone Number"
            value={formik.values.mobile}
            onChange={(value) => formik.setFieldValue('mobile', sanitizeNumericInput(value, 10))}
            onBlur={touchField('mobile')}
            placeholder="Phone Number"
            error={getFieldError('mobile')}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            required
            disabled
            autoComplete="tel"
          />
        </div>

        <div>
          <label className="lead-form-label">
            Personal Email ID <span className="text-red-500">*</span>
          </label>
          <InputField
            label="Personal Email ID"
            value={formik.values.email}
            onChange={(value) => formik.setFieldValue('email', value)}
            onBlur={touchField('email')}
            placeholder="Personal Email ID"
            error={getFieldError('email')}
            type="email"
            inputMode="email"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="lead-form-label">
            Gender <span className="text-red-500">*</span>
          </label>
          <ButtonGroup
            options={genderOptions}
            value={formik.values.gender}
            onChange={(value) => formik.setFieldValue('gender', value)}
            error={getFieldError('gender')}
          />
        </div>

        <div>
          <label className="lead-form-label">
            Enter Your Pincode <span className="text-red-500">*</span>
          </label>
          <InputField
            label="Enter Your Pincode"
            value={formik.values.pincode}
            onChange={(value) => formik.setFieldValue('pincode', sanitizeNumericInput(value, 6))}
            onBlur={touchField('pincode')}
            placeholder="Enter Your Pincode"
            error={getFieldError('pincode')}
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
          />
          <p className="text-xs text-gray-500 mt-1">{PAN_HINT}</p>
        </div>
      </>
    );
  }

  // Step 2: Business Details
  if (stepNumber === 2) {
    return (
      <>
        <div>
          <label className="lead-form-label">
            Type of Company <span className="text-red-500">*</span>
          </label>
          <ButtonGroup
            options={companyTypeOptions}
            value={formik.values.companyType}
            onChange={(value) => formik.setFieldValue('companyType', value)}
            error={getFieldError('companyType')}
          />
        </div>

        <div>
          <label className="lead-form-label">
            Nature of Business <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="business-nature-categories"
            value={formik.values.businessNature}
            onChange={(event) => formik.setFieldValue('businessNature', event.target.value)}
            onBlur={touchField('businessNature')}
            placeholder="Nature of Business"
            className={businessNatureClassName}
          />
          <datalist id="business-nature-categories">{businessNatureOptionElements}</datalist>
          {businessNatureError && (
            <p className="text-xs text-red-600 mt-1">{businessNatureError}</p>
          )}
        </div>

        <SelectField
          label="Is your business registered under GST?"
          value={formik.values.hasGst}
          onChange={(value) => formik.setFieldValue('hasGst', value as HasGstValue)}
          onBlur={touchField('hasGst')}
          error={getFieldError('hasGst')}
          placeholder="Yes / No"
          required
          options={gstOptions}
        />
      </>
    );
  }

  // Step 3: Business Financials
  return (
    <>
      <div>
        <label className="lead-form-label">
          Annual Turnover <span className="text-red-500">*</span>
        </label>
        <InputField
          label="Annual Turnover"
          value={formik.values.annualTurnover}
          onChange={(value) => formik.setFieldValue('annualTurnover', sanitizeNumericInput(value))}
          onBlur={touchField('annualTurnover')}
          placeholder="Enter Your Annual Turnover"
          error={getFieldError('annualTurnover')}
          type="text"
          inputMode="numeric"
          required
        />
      </div>

      <div>
        <label className="lead-form-label">
          Loan Amount <span className="text-red-500">*</span>
        </label>
        <InputField
          label="Loan Amount"
          value={formik.values.requiredLoanAmount}
          onChange={(value) =>
            formik.setFieldValue('requiredLoanAmount', sanitizeNumericInput(value))
          }
          onBlur={touchField('requiredLoanAmount')}
          placeholder="Enter Required Loan Amount"
          error={getFieldError('requiredLoanAmount')}
          type="text"
          inputMode="numeric"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="business-loan-consent"
            checked={formik.values.consent}
            onChange={(event) => {
              formik.setFieldValue('consent', event.target.checked);
              formik.setFieldTouched('consent', true, false);
            }}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="business-loan-consent" className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="/terms-of-service" className="text-blue-600 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" className="text-blue-600 underline">
              Privacy Policy
            </a>
            .
          </label>
        </div>
        {consentError && (
          <p className="text-xs text-red-600 ml-8">{consentError}</p>
        )}
      </div>
    </>
  );
};

export default BusinessLoanFields;
