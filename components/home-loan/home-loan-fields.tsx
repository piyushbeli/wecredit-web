'use client';

import InputField from '@/components/forms/input-field';
import ButtonGroup from '@/components/forms/button-group';
import ConsentCheckbox from '@/components/forms/consent-checkbox';
import DateOfBirthField from '@/components/forms/date-of-birth-field';
import { normalizePan } from '@/lib/utils/form-helpers';
import {
  HOME_LOAN_INCOME_SOURCE_OPTIONS,
  sanitizeNumericInput,
  type HomeLoanFormState,
} from './home-loan-form.config';
import { useAuth } from '@/hooks/use-auth';

const PAN_HINT = 'As per PAN card';
const DOB_HINT = 'As per PAN card';

interface HomeLoanFieldsProps {
  formValues: HomeLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof HomeLoanFormState, value: string | boolean) => void;
  handleFieldBlur: (key: keyof HomeLoanFormState) => void;
}

const incomeSourceOptions = HOME_LOAN_INCOME_SOURCE_OPTIONS.map((option) => ({
  value: option,
  label: option === 'Self-employed' ? 'Self - employed' : option,
}));

const HomeLoanFields = ({
  formValues,
  formErrors,
  handleFieldChange,
  handleFieldBlur,
}: HomeLoanFieldsProps): React.ReactNode => {
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
          PAN Number <span className="text-red-500">*</span>
        </label>
        <InputField
          label="PAN Number"
          value={formValues.panNumber}
          onChange={(value) => handleFieldChange('panNumber', normalizePan(value))}
          onBlur={() => handleFieldBlur('panNumber')}
          placeholder="e.g. ABCDE1234F"
          error={formErrors.panNumber}
          type="text"
          maxLength={10}
          required
          autoComplete="off"
        />
        <p className="text-xs text-gray-500 mt-1">{PAN_HINT}</p>
      </div>

      <div>
        <DateOfBirthField
          id="home-loan-dob"
          value={formValues.dob}
          onChange={(value) => handleFieldChange('dob', value)}
          onBlur={() => handleFieldBlur('dob')}
          error={formErrors.dob}
          hint={DOB_HINT}
        />
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
        <label className="lead-form-label">
          Permanent Address Pincode <span className="text-red-500">*</span>
        </label>
        <InputField
          label="Permanent Address Pincode"
          value={formValues.permanentPincode}
          onChange={(value) =>
            handleFieldChange('permanentPincode', sanitizeNumericInput(value, 6))
          }
          onBlur={() => handleFieldBlur('permanentPincode')}
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
          onBlur={() => handleFieldBlur('propertyPincode')}
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
          Source of Income <span className="text-red-500">*</span>
        </label>
        <ButtonGroup
          options={incomeSourceOptions}
          value={formValues.incomeSource}
          onChange={(value) =>
            handleFieldChange('incomeSource', value as HomeLoanFormState['incomeSource'])
          }
          error={formErrors.incomeSource}
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
        id="home-loan-consent"
        checked={formValues.consent}
        onChange={(value) => handleFieldChange('consent', value)}
        error={consentError}
      />
    </>
  );
};

export default HomeLoanFields;
