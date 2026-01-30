'use client';

import InputField from '@/components/forms/input-field';
import ButtonGroup from '@/components/forms/button-group';
import {
  CAR_LOAN_GENDER_OPTIONS,
  CAR_LOAN_EMPLOYMENT_OPTIONS,
  sanitizeNumericInput,
  type CarLoanFormState,
} from './car-loan-form.config';

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

      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="car-loan-consent"
            checked={formValues.consent}
            onChange={(event) => handleFieldChange('consent', event.target.checked)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="car-loan-consent" className="text-sm text-gray-700">
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

export default CarLoanFields;
