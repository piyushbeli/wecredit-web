'use client';

import InputField from '@/components/forms/input-field';
import ButtonGroup from '@/components/forms/button-group';
import {
  HOME_LOAN_EMPLOYMENT_OPTIONS,
  sanitizeNumericInput,
  type HomeLoanFormState,
} from './home-loan-form.config';

const PAN_HINT = 'As per PAN card';

interface HomeLoanFieldsProps {
  formValues: HomeLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof HomeLoanFormState, value: string | boolean) => void;
}

const employmentOptions = HOME_LOAN_EMPLOYMENT_OPTIONS.map((option) => ({
  value: option,
  label: option === 'Self-employed' ? 'Self - employed' : option,
}));

const HomeLoanFields = ({
  formValues,
  formErrors,
  handleFieldChange,
}: HomeLoanFieldsProps): React.ReactNode => {
  const consentError = formErrors.consent;

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
          autoComplete="tel"
        />
      </div>

      <div>
        <label className="lead-form-label">
          Permanent Address Pincode <span className="text-red-500">*</span>
        </label>
        <InputField
          label="Permanent Address Pincode"
          value={formValues.permanentPincode}
          onChange={(value) =>
            handleFieldChange('permanentPincode', sanitizeNumericInput(value, 6))
          }
          placeholder="Enter Your Pincode"
          error={formErrors.permanentPincode}
          type="text"
          inputMode="numeric"
          maxLength={6}
          required
        />
      </div>

      <div>
        <label className="lead-form-label">
          Property Pincode <span className="text-red-500">*</span>
        </label>
        <InputField
          label="Property Pincode"
          value={formValues.propertyPincode}
          onChange={(value) =>
            handleFieldChange('propertyPincode', sanitizeNumericInput(value, 6))
          }
          placeholder="Enter Your Pincode"
          error={formErrors.propertyPincode}
          type="text"
          inputMode="numeric"
          maxLength={6}
          required
        />
      </div>

      <div>
        <label className="lead-form-label">
          Employment Type <span className="text-red-500">*</span>
        </label>
        <ButtonGroup
          options={employmentOptions}
          value={formValues.employmentType}
          onChange={(value) => handleFieldChange('employmentType', value as HomeLoanFormState['employmentType'])}
          error={formErrors.employmentType}
        />
      </div>

      <div>
        <label className="lead-form-label">
          Loan Amount <span className="text-red-500">*</span>
        </label>
        <InputField
          label="Loan Amount"
          value={formValues.loanAmount}
          onChange={(value) => handleFieldChange('loanAmount', sanitizeNumericInput(value))}
          placeholder="Enter Required Loan Amount"
          error={formErrors.loanAmount}
          type="text"
          inputMode="numeric"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="home-loan-consent"
            checked={formValues.consent}
            onChange={(event) => handleFieldChange('consent', event.target.checked)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="home-loan-consent" className="text-sm text-gray-700">
            I agree to{' '}
            <a href="/terms-of-service" className="text-blue-600 underline">
              Term
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" className="text-blue-600 underline">
              Policy
            </a>{' '}
            of WeCredit.
          </label>
        </div>
        {consentError && (
          <p className="text-xs text-red-600 ml-8">{consentError}</p>
        )}
      </div>
    </>
  );
};

export default HomeLoanFields;
