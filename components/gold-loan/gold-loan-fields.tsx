'use client';

import { cn } from '@/lib/utils';
import InputField from '@/components/forms/input-field';
import {
  sanitizeNumericInput,
  dobToNativeFormat,
  type GoldLoanFormState,
} from './gold-loan-form.config';

const PAN_HINT = 'As per PAN card';
const DOB_HINT = 'Enter your Date of Birth As Per PAN Card';

interface GoldLoanFieldsProps {
  formValues: GoldLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof GoldLoanFormState, value: string | boolean) => void;
}

const GoldLoanFields = ({
  formValues,
  formErrors,
  handleFieldChange,
}: GoldLoanFieldsProps): React.ReactNode => {
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
        <label htmlFor="gold-loan-dob" className="lead-form-label">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          id="gold-loan-dob"
          name="dob"
          type="date"
          value={/^\d{4}-\d{2}-\d{2}$/.test(formValues.dob) ? formValues.dob : dobToNativeFormat(formValues.dob)}
          onChange={(e) => handleFieldChange('dob', e.target.value)}
          required
          className={cn(
            'w-full px-4 py-3 rounded-lg border text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            formErrors.dob ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          )}
        />
        <p className="text-xs text-gray-500 mt-1">{DOB_HINT}</p>
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
            handleFieldChange('pan', value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 10))
          }
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
            id="gold-loan-consent"
            checked={formValues.consent}
            onChange={(event) => handleFieldChange('consent', event.target.checked)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="gold-loan-consent" className="text-sm text-gray-700">
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

export default GoldLoanFields;
