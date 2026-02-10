'use client';

import InputField from '@/components/forms/input-field';
import ButtonGroup from '@/components/forms/button-group';
import DateOfBirthField from '@/components/forms/date-of-birth-field';
import { sanitizeNumericInput } from '@/lib/utils/form-helpers';
import {
  GENDER_OPTIONS,
  type EligibilityCheckFormValues,
} from './eligibility-check-form.config';

interface EligibilityCheckFieldsProps {
  formValues: EligibilityCheckFormValues;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof EligibilityCheckFormValues, value: string) => void;
}

const EligibilityCheckFields = ({
  formValues,
  formErrors,
  handleFieldChange,
}: EligibilityCheckFieldsProps): React.ReactNode => {
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
        </div>
        <div>
          <label className="lead-form-label">
            Last Name <span className="text-red-500">*</span>
          </label>
          <InputField
            label="Last Name"
            value={formValues.lastName}
            onChange={(value) => handleFieldChange('lastName', value)}
            placeholder="Enter Last Name"
            error={formErrors.lastName}
            required
            autoComplete="family-name"
          />
        </div>
      </div>

      <div>
        <label className="lead-form-label">
          Gender <span className="text-red-500">*</span>
        </label>
        <ButtonGroup
          options={GENDER_OPTIONS}
          value={formValues.gender}
          onChange={(value) => handleFieldChange('gender', value)}
          error={formErrors.gender}
        />
      </div>

      <div>
        <label className="lead-form-label">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <InputField
          label="Phone Number"
          value={formValues.phoneNumber}
          onChange={(value) =>
            handleFieldChange('phoneNumber', sanitizeNumericInput(value, 10))
          }
          placeholder="Enter Phone Number"
          error={formErrors.phoneNumber}
          type="tel"
          inputMode="numeric"
          maxLength={10}
          required
          autoComplete="tel"
        />
      </div>

      <div>
        <DateOfBirthField
          id="eligibility-check-dob"
          value={formValues.dob}
          onChange={(value) => handleFieldChange('dob', value)}
          error={formErrors.dob}
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
            handleFieldChange(
              'pan',
              value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 10)
            )
          }
          placeholder="Enter 10- digit PAN"
          error={formErrors.pan}
          type="text"
          maxLength={10}
          required
          autoComplete="off"
        />
      </div>

      <div>
        <label className="lead-form-label">
          Pin Code <span className="text-red-500">*</span>
        </label>
        <InputField
          label="Pin Code"
          value={formValues.pincode}
          onChange={(value) =>
            handleFieldChange('pincode', sanitizeNumericInput(value, 6))
          }
          placeholder="Enter Pin Code"
          error={formErrors.pincode}
          type="text"
          inputMode="numeric"
          maxLength={6}
          required
          autoComplete="postal-code"
        />
      </div>

      <div>
        <label className="lead-form-label">Personal Email Id (optional)</label>
        <InputField
          label="Personal Email Id"
          value={formValues.email}
          onChange={(value) => handleFieldChange('email', value)}
          placeholder="Enter Personal Email Id"
          error={formErrors.email}
          type="email"
          autoComplete="email"
        />
      </div>

      <p className="text-xs text-gray-500">
        By proceeding, you consent and allow us to pull your credit report.
      </p>
    </>
  );
};

export default EligibilityCheckFields;
