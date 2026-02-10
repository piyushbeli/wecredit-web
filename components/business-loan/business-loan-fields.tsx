'use client';

import InputField from '@/components/forms/input-field';
import ButtonGroup from '@/components/forms/button-group';
import SelectField from '@/components/forms/select-field';
import ConsentCheckbox from '@/components/forms/consent-checkbox';
import { BUSINESS_NATURE_CATEGORIES } from '@/lib/constants/business-loan';
import {
  COMPANY_TYPE_OPTIONS,
  GENDER_OPTIONS,
  sanitizeNumericInput,
  type BusinessLoanFormState,
  type HasGstValue,
} from './business-loan-form.config';
import { useAuth } from '@/hooks/use-auth';

const PAN_HINT = 'As per PAN card';

interface BusinessLoanFieldsProps {
  stepNumber: number;
  formValues: BusinessLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof BusinessLoanFormState, value: string | boolean) => void;
}

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

const businessNatureOptions = BUSINESS_NATURE_CATEGORIES.map((category) => ({
  value: category,
  label: category,
}));

const BusinessLoanFields = ({
  stepNumber,
  formValues,
  formErrors,
  handleFieldChange,
}: BusinessLoanFieldsProps): React.ReactNode => {
  const consentError = formErrors.consent;
  const { isAuthenticated } = useAuth();
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
              value={formValues.firstName}
              onChange={(value) => handleFieldChange('firstName', value)}
              placeholder="First Name"
              error={formErrors.firstName}
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
              value={formValues.lastName}
              onChange={(value) => handleFieldChange('lastName', value)}
              placeholder="Last Name"
              error={formErrors.lastName}
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
            value={formValues.mobile}
            onChange={(value) => handleFieldChange('mobile', sanitizeNumericInput(value, 10))}
            placeholder="Phone Number"
            error={formErrors.mobile}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            required
            disabled={isAuthenticated}
            autoComplete="tel"
          />
        </div>

        <div>
          <label className="lead-form-label">
            Personal Email ID <span className="text-red-500">*</span>
          </label>
          <InputField
            label="Personal Email ID"
            value={formValues.email}
            onChange={(value) => handleFieldChange('email', value)}
            placeholder="Personal Email ID"
            error={formErrors.email}
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
            value={formValues.gender}
            onChange={(value) => handleFieldChange('gender', value)}
            error={formErrors.gender}
          />
        </div>

        <div>
          <label className="lead-form-label">
            Enter Your Pincode <span className="text-red-500">*</span>
          </label>
          <InputField
            label="Enter Your Pincode"
            value={formValues.pincode}
            onChange={(value) => handleFieldChange('pincode', sanitizeNumericInput(value, 6))}
            placeholder="Enter Your Pincode"
            error={formErrors.pincode}
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
            value={formValues.companyType}
            onChange={(value) => handleFieldChange('companyType', value)}
            error={formErrors.companyType}
            className="flex-wrap"
            buttonClassName="min-w-[92px] flex-none"
          />
        </div>

        <SelectField
          label="Nature of Business"
          value={formValues.businessNature}
          onChange={(value) => handleFieldChange('businessNature', value)}
          error={formErrors.businessNature}
          placeholder="Select nature of business"
          required
          options={businessNatureOptions}
        />

        <SelectField
          label="Is your business registered under GST?"
          value={formValues.hasGst}
          onChange={(value) => handleFieldChange('hasGst', value as HasGstValue)}
          error={formErrors.hasGst}
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
          value={formValues.annualTurnover}
          onChange={(value) => handleFieldChange('annualTurnover', sanitizeNumericInput(value))}
          placeholder="Enter Your Annual Turnover"
          error={formErrors.annualTurnover}
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
          value={formValues.requiredLoanAmount}
          onChange={(value) =>
            handleFieldChange('requiredLoanAmount', sanitizeNumericInput(value))
          }
          placeholder="Enter Required Loan Amount"
          error={formErrors.requiredLoanAmount}
          type="text"
          inputMode="numeric"
          required
        />
      </div>
      <ConsentCheckbox
        id="business-loan-consent"
        checked={formValues.consent}
        onChange={(value) => handleFieldChange('consent', value)}
        error={consentError}
      />
    </>
  );
};

export default BusinessLoanFields;
