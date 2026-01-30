'use client';

import { cn } from '@/lib/utils';
import InputField from '@/components/forms/input-field';
import ButtonGroup from '@/components/forms/button-group';
import { sanitizeNumericInput } from '@/lib/utils/form-helpers';
import {
  GENDER_OPTIONS,
  dobToNativeFormat,
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
  const dobDisplay =
    /^\d{4}-\d{2}-\d{2}$/.test(formValues.dob)
      ? formValues.dob
      : dobToNativeFormat(formValues.dob);

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
        <label htmlFor="eligibility-check-dob" className="lead-form-label">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          id="eligibility-check-dob"
          name="dob"
          type="date"
          value={dobDisplay}
          onChange={(e) => handleFieldChange('dob', e.target.value)}
          required
          className={cn(
            'w-full px-4 py-3 rounded-lg border text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            formErrors.dob ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          )}
        />
        {formErrors.dob && (
          <p className="text-xs text-red-600 mt-1">{formErrors.dob}</p>
        )}
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
