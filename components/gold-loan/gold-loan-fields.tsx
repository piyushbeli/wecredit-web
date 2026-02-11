'use client';

import InputField from '@/components/forms/input-field';
import ConsentCheckbox from '@/components/forms/consent-checkbox';
import DateOfBirthField from '@/components/forms/date-of-birth-field';
import {
  sanitizeNumericInput,
  type GoldLoanFormState,
} from './gold-loan-form.config';
import { useAuth } from '@/hooks/use-auth';

const PAN_HINT = 'As per PAN card';
const DOB_HINT = 'Enter your Date of Birth As Per PAN Card';

interface GoldLoanFieldsProps {
  formValues: GoldLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof GoldLoanFormState, value: string | boolean) => void;
  handleFieldBlur: (key: keyof GoldLoanFormState) => void;
}

const GoldLoanFields = ({
  formValues,
  formErrors,
  handleFieldChange,
  handleFieldBlur,
}: GoldLoanFieldsProps): React.ReactNode => {
  const consentError = formErrors.consent;
  const { isAuthenticated } = useAuth();
  // Keep the phone field locked for authenticated users to match the verified mobile.

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
            onBlur={() => handleFieldBlur('firstName')}
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
            onBlur={() => handleFieldBlur('lastName')}
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
          onBlur={() => handleFieldBlur('mobile')}
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
        <DateOfBirthField
          id="gold-loan-dob"
          value={formValues.dob}
          onChange={(value) => handleFieldChange('dob', value)}
          onBlur={() => handleFieldBlur('dob')}
          error={formErrors.dob}
          hint={DOB_HINT}
        />
      </div>

      <div>
        <label className="lead-form-label">
          PAN Card <span className="text-red-500">*</span>
        </label>
        <InputField
          label="PAN Card"
          value={formValues.pan}
          onChange={(value) =>
            handleFieldChange('pan', value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 10))
          }
          onBlur={() => handleFieldBlur('pan')}
          placeholder="Enter 10 Digit PAN Number"
          error={formErrors.pan}
          type="text"
          maxLength={10}
          required
          autoComplete="off"
        />
      </div>

      <div>
        <label className="lead-form-label">
          State <span className="text-red-500">*</span>
        </label>
        <InputField
          label="State"
          value={formValues.state}
          onChange={(value) => handleFieldChange('state', value)}
          onBlur={() => handleFieldBlur('state')}
          placeholder="Enter State"
          error={formErrors.state}
          required
        />
      </div>

      <div>
        <label className="lead-form-label">
          City <span className="text-red-500">*</span>
        </label>
        <InputField
          label="City"
          value={formValues.city}
          onChange={(value) => handleFieldChange('city', value)}
          onBlur={() => handleFieldBlur('city')}
          placeholder="Enter City"
          error={formErrors.city}
          required
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
          onBlur={() => handleFieldBlur('loanAmount')}
          placeholder="Enter Required Loan Amount"
          error={formErrors.loanAmount}
          type="text"
          inputMode="numeric"
          required
        />
      </div>
      <ConsentCheckbox
        id="gold-loan-consent"
        checked={formValues.consent}
        onChange={(value) => handleFieldChange('consent', value)}
        error={consentError}
      />
    </>
  );
};

export default GoldLoanFields;
