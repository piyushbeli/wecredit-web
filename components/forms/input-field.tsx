/**
 * Input Field Component
 * Reusable form input with label, helper text, and error handling
 */

import { cn } from '@/lib/utils';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  helperText?: string;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'email' | 'tel';
  maxLength?: number;
  required?: boolean;
  autoComplete?: string;
}

const InputField = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  readOnly,
  placeholder,
  helperText,
  type = 'text',
  inputMode = 'text',
  maxLength,
  required,
  autoComplete,
}: InputFieldProps) => {
  return (
    <div className="space-y-2">
      {/* <label className="block text-sm font-medium text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label> */}

      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={cn(
          'w-full px-4 py-3 rounded-lg border text-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          // Hide number input spinners
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white',
          (disabled || readOnly) && 'opacity-50'
        )}
      />

      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default InputField;
