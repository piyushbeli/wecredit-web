/**
 * Dynamic Field Component
 * Renders appropriate UI component based on field configuration from API
 * Supports text inputs, number inputs, date inputs, button groups, select dropdowns, and checkboxes
 */

import { cn } from '@/lib/utils';
import type { FormField, FormFieldKey } from '@/types/lead';
import ButtonGroup from './button-group';
import ConsentCheckbox from './consent-checkbox';

interface DynamicFieldProps {
  /** Field configuration from API */
  field: FormField;
  /** Current field value */
  value: string;
  /** Change handler for field value */
  onChange: (value: string) => void;
  /** Blur handler for validation */
  onBlur?: () => void;
  /** Validation error message */
  error?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
}

/** Fields that should be hidden (auto-filled, never shown) */
const HIDDEN_FIELDS: FormFieldKey[] = ['ConsentIp', 'ConsentDateTime'];

/** Fields that should use email input type */
const EMAIL_FIELDS: FormFieldKey[] = ['email'];

/** Fields that should use date input type */
const DATE_FIELDS: FormFieldKey[] = ['dob'];

/** Fields that should use tel input type */
const PHONE_FIELDS: FormFieldKey[] = ['mobile', 'phone'];

/** Fields that should use numeric input mode */
const NUMERIC_FIELDS: FormFieldKey[] = ['pincode', 'companyPincode', 'salary', 'monthlyIncome', 'declaredIncome', 'loanAmount'];

/**
 * Capitalizes first letter of each word for display
 * Handles camelCase by splitting on capital letters
 */
function capitalizeOption(option: string): string {
  return option
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Gets the HTML input type based on field key and type
 */
function getInputType(key: FormFieldKey, fieldType: string): string {
  if (EMAIL_FIELDS.includes(key)) return 'email';
  if (DATE_FIELDS.includes(key)) return 'date';
  if (PHONE_FIELDS.includes(key)) return 'tel';
  if (fieldType === 'boolean') return 'checkbox';
  return 'text';
}

/**
 * Gets the input mode for mobile keyboards
 */
function getInputMode(key: FormFieldKey, fieldType: string): 'text' | 'numeric' | 'email' | 'tel' {
  if (EMAIL_FIELDS.includes(key)) return 'email';
  if (PHONE_FIELDS.includes(key)) return 'tel';
  if (NUMERIC_FIELDS.includes(key) || fieldType === 'number' || fieldType === 'float') return 'numeric';
  return 'text';
}

/**
 * Gets placeholder text for a field
 */
function getPlaceholder(key: FormFieldKey, title: string): string {
  if (DATE_FIELDS.includes(key)) return '';
  if (PHONE_FIELDS.includes(key)) return 'Enter 10-digit mobile number';
  if (key === 'pan') return 'Enter PAN (e.g., ABCDE1234F)';
  if (key === 'pincode' || key === 'companyPincode') return 'Enter 6-digit PIN code';
  return `Enter ${title.toLowerCase()}`;
}

/**
 * Gets max length for input fields
 */
function getMaxLength(key: FormFieldKey): number | undefined {
  if (PHONE_FIELDS.includes(key)) return 10;
  if (key === 'pan') return 10;
  if (key === 'pincode' || key === 'companyPincode') return 6;
  return undefined;
}

/**
 * Converts date from DD-MM-YYYY (API format) to YYYY-MM-DD (native date input format)
 */
function convertDateToNativeFormat(dateStr: string): string {
  if (!dateStr) return '';
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}

/**
 * Converts date from YYYY-MM-DD (native date input) to DD-MM-YYYY (API format)
 */
function convertDateToApiFormat(dateStr: string): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }
  return dateStr;
}

const DynamicField = ({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
}: DynamicFieldProps) => {
  const { title, key, type, options, isMandatory } = field;

  // Skip hidden fields (ConsentIp, ConsentDateTime - auto-filled)
  if (HIDDEN_FIELDS.includes(key)) {
    return null;
  }

  // Handle boolean field (consent) as checkbox
  if (type === 'boolean') {
    const isChecked = value === 'true';
    return (
      <div className="space-y-2">
        <ConsentCheckbox
          id={key}
          checked={isChecked}
          onChange={(value) => onChange(value ? 'true' : 'false')}
          error={error}
        />
        {error && (
          <p className="text-xs text-red-600 ml-8">{error}</p>
        )}
      </div>
    );
  }

  // Handle selection fields with options
  if (options.length > 0) {
    // Use ButtonGroup for 2-4 options (better UX for small sets)
    if (options.length >= 2 && options.length <= 4) {
      const buttonOptions = options.map((opt) => ({
        value: opt,
        label: capitalizeOption(opt),
      }));

      return (
        <div className="space-y-2">
          <label className="lead-form-label">
            {title} {isMandatory && <span className="text-red-500">*</span>}
          </label>
          <ButtonGroup
            options={buttonOptions}
            value={value}
            onChange={onChange}
            disabled={disabled}
            error={error}
          />
        </div>
      );
    }

    // Use Select dropdown for 5+ options
    return (
      <div className="space-y-2">
        <label htmlFor={key} className="lead-form-label">
          {title} {isMandatory && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select
            id={key}
            name={key}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            required={isMandatory}
            disabled={disabled}
            className={cn(
              'w-full px-4 py-3 rounded-lg border text-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'appearance-none bg-white pr-10 cursor-pointer',
              error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <option value="" disabled>
              Select {title}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {capitalizeOption(option)}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5H7z" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }

  // Handle date field - use native date input
  if (DATE_FIELDS.includes(key)) {
    // Value is already in YYYY-MM-DD format from initialization
    // If it's in DD-MM-YYYY format (from API), convert it
    const nativeDateValue = /^\d{4}-\d{2}-\d{2}$/.test(value) 
      ? value 
      : convertDateToNativeFormat(value);
    
    return (
      <div className="space-y-2">
        <label htmlFor={key} className="lead-form-label">
          {title} {isMandatory && <span className="text-red-500">*</span>}
        </label>
        <input
          id={key}
          name={key}
          type="date"
          value={nativeDateValue}
          onChange={(e) => {
            // Store in YYYY-MM-DD format (will be converted to DD-MM-YYYY on submit)
            onChange(e.target.value);
          }}
          onBlur={onBlur}
          required={isMandatory}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-3 rounded-lg border text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }

  // Handle phone fields - restrict to 10 digits
  if (PHONE_FIELDS.includes(key)) {
    const handlePhoneChange = (val: string): void => {
      const numericValue = val.replace(/\D/g, '').slice(0, 10);
      onChange(numericValue);
    };

    return (
      <div className="space-y-2">
        <label htmlFor={key} className="lead-form-label">
          {title} {isMandatory && <span className="text-red-500">*</span>}
        </label>
        <input
          id={key}
          name={key}
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onBlur={onBlur}
          required={isMandatory}
          disabled={disabled}
          placeholder={getPlaceholder(key, title)}
          maxLength={10}
          className={cn(
            'w-full px-4 py-3 rounded-lg border text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }

  // Render standard text/number input field
  return (
    <div className="space-y-2">
      <label htmlFor={key} className="lead-form-label">
        {title} {isMandatory && <span className="text-red-500">*</span>}
      </label>
      <input
        id={key}
        name={key}
        type={getInputType(key, type)}
        inputMode={getInputMode(key, type)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={isMandatory}
        disabled={disabled}
        placeholder={getPlaceholder(key, title)}
        maxLength={getMaxLength(key)}
        className={cn(
          'w-full px-4 py-3 rounded-lg border text-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default DynamicField;
