'use client';

/**
 * Dynamic Form Field Component
 * Renders appropriate input type based on field configuration from API
 */

import type { FormField, FormFieldKey } from '@/types/lead';
import { cn } from '@/lib/utils';

/** Props for DynamicFormField component */
interface DynamicFormFieldProps {
  /** Field configuration from API */
  field: FormField;
  /** Current field value */
  value: string;
  /** Change handler for field value */
  onChange: (key: string, value: string) => void;
  /** Validation error message */
  error?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
}

/** Base input styles */
const inputBaseStyles = cn(
  'w-full px-4 py-3 rounded-lg border transition-all duration-200',
  'text-gray-900 placeholder-gray-400',
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500',
  'text-sm'
);

/** Error input styles */
const inputErrorStyles = 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500';

/** Normal input styles */
const inputNormalStyles = 'border-gray-300 hover:border-gray-400 focus:border-blue-500 bg-white';

/** Fields that should be hidden (auto-filled) */
const HIDDEN_FIELDS: FormFieldKey[] = ['ConsentIp', 'ConsentDateTime'];

/** Fields that should use email input type */
const EMAIL_FIELDS: FormFieldKey[] = ['email'];

/** Fields that should use date input pattern */
const DATE_FIELDS: FormFieldKey[] = ['dob'];

/** Fields that should use numeric input */
const NUMERIC_FIELDS: FormFieldKey[] = ['pincode', 'companyPincode', 'salary', 'mobile'];

/**
 * Capitalizes first letter of each word for display
 */
function capitalizeOption(option: string): string {
  return option
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Gets the HTML input type based on field key
 */
function getInputType(key: FormFieldKey): string {
  if (EMAIL_FIELDS.includes(key)) return 'email';
  return 'text';
}

/**
 * Gets the input mode for mobile keyboards
 */
function getInputMode(key: FormFieldKey, type: string): 'text' | 'numeric' | 'email' | 'tel' {
  if (EMAIL_FIELDS.includes(key)) return 'email';
  if (key === 'mobile') return 'tel';
  if (NUMERIC_FIELDS.includes(key) || type === 'number' || type === 'float') return 'numeric';
  return 'text';
}

/**
 * Gets placeholder text for a field
 */
function getPlaceholder(key: FormFieldKey, title: string): string {
  if (DATE_FIELDS.includes(key)) return 'DD-MM-YYYY';
  if (key === 'mobile') return 'Enter 10-digit mobile number';
  if (key === 'pan') return 'Enter PAN (e.g., ABCDE1234F)';
  if (key === 'pincode' || key === 'companyPincode') return 'Enter 6-digit PIN code';
  return `Enter ${title.toLowerCase()}`;
}

/**
 * Renders a dynamic form field based on the field configuration from API
 * Determines field type by checking: options array for select, key for email/date/numeric
 */
const DynamicFormField = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}: DynamicFormFieldProps) => {
  const { title, key, type, options, isMandatory } = field;

  // Skip hidden fields (ConsentIp, ConsentDateTime - auto-filled)
  if (HIDDEN_FIELDS.includes(key)) {
    return null;
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    onChange(key, event.target.value);
  };

  const label = `${title}${isMandatory ? ' *' : ''}`;
  const inputStyles = cn(
    inputBaseStyles,
    error ? inputErrorStyles : inputNormalStyles
  );

  // Render SELECT field when options array has items
  if (options.length > 0) {
    return (
      <div className="form-field space-y-2">
        <label
          htmlFor={key}
          className="block text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
        <div className="relative">
          <select
            id={key}
            name={key}
            value={value}
            onChange={handleChange}
            required={isMandatory}
            disabled={disabled}
            className={cn(inputStyles, 'appearance-none bg-white pr-10 cursor-pointer')}
          >
            <option value="" disabled>Select {title}</option>
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
          <span className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </span>
        )}
      </div>
    );
  }

  // Render DATE field
  if (DATE_FIELDS.includes(key)) {
    return (
      <div className="form-field space-y-2">
        <label
          htmlFor={key}
          className="block text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
        <input
          id={key}
          name={key}
          type="text"
          value={value}
          onChange={handleChange}
          required={isMandatory}
          disabled={disabled}
          placeholder="DD-MM-YYYY"
          maxLength={10}
          className={inputStyles}
        />
        {error && (
          <span className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </span>
        )}
      </div>
    );
  }

  // Render standard input field
  return (
    <div className="form-field space-y-2">
      <label
        htmlFor={key}
        className="block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <input
        id={key}
        name={key}
        type={getInputType(key)}
        inputMode={getInputMode(key, type)}
        value={value}
        onChange={handleChange}
        required={isMandatory}
        disabled={disabled}
        placeholder={getPlaceholder(key, title)}
        className={inputStyles}
      />
      {error && (
        <span className="text-xs text-red-600 flex items-center gap-1 mt-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
};

export default DynamicFormField;
