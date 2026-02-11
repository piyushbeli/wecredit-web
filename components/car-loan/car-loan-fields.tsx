'use client';

import InputField from '@/components/forms/input-field';
import ButtonGroup from '@/components/forms/button-group';
import ConsentCheckbox from '@/components/forms/consent-checkbox';
import {
  CAR_LOAN_GENDER_OPTIONS,
  CAR_LOAN_EMPLOYMENT_OPTIONS,
  sanitizeNumericInput,
  type CarLoanFormState,
} from './car-loan-form.config';
import { useAuth } from '@/hooks/use-auth';

const PAN_HINT = 'As per PAN card';

const genderOptions = CAR_LOAN_GENDER_OPTIONS.map((option) => ({
  value: option,
  label: option,
}));

const employmentOptions = CAR_LOAN_EMPLOYMENT_OPTIONS.map((option) => ({
  value: option,
  label: option === 'Self-employed' ? 'Self - employed' : option,
}));

interface CarLoanFieldsProps {
  formValues: CarLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof CarLoanFormState, value: string | boolean) => void;
  handleFieldBlur: (key: keyof CarLoanFormState) => void;
}

const CarLoanFields = ({
  formValues,
  formErrors,
  handleFieldChange,
  handleFieldBlur,
}: CarLoanFieldsProps): React.ReactNode => {
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
        <label className="lead-form-label">
          Personal Email ID <span className="text-red-500">*</span>
        </label>
        <InputField
          label="Personal Email ID"
          value={formValues.email}
          onChange={(value) => handleFieldChange('email', value)}
          onBlur={() => handleFieldBlur('email')}
          placeholder="Enter your Email ID"
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
          onChange={(value) => handleFieldChange('gender', value as CarLoanFormState['gender'])}
          error={formErrors.gender}
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
          Pincode <span className="text-red-500">*</span>
        </label>
        <InputField
          label="Pincode"
          value={formValues.pincode}
          onChange={(value) => handleFieldChange('pincode', sanitizeNumericInput(value, 6))}
          onBlur={() => handleFieldBlur('pincode')}
          placeholder="Enter Pincode"
          error={formErrors.pincode}
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
          onChange={(value) =>
            handleFieldChange('employmentType', value as CarLoanFormState['employmentType'])
          }
          error={formErrors.employmentType}
        />
      </div>

      <div>
        <label className="lead-form-label">
          Car Model <span className="text-red-500">*</span>
        </label>
        <InputField
          label="Car Model"
          value={formValues.carModel}
          onChange={(value) => handleFieldChange('carModel', value)}
          onBlur={() => handleFieldBlur('carModel')}
          placeholder="Enter Car Model"
          error={formErrors.carModel}
          required
        />
      </div>
      <ConsentCheckbox
        id="car-loan-consent"
        checked={formValues.consent}
        onChange={(value) => handleFieldChange('consent', value)}
        error={consentError}
      />
    </>
  );
};

export default CarLoanFields;
