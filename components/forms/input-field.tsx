/**
 * Input Field Component
 * Reusable form input with label, helper text, and error handling
 */

import { cn } from '@/lib/utils';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'email' | 'tel';
  required?: boolean;
}

const InputField = ({
  label,
  value,
  onChange,
  error,
  disabled,
  placeholder,
  helperText,
  type = 'text',
  inputMode = 'text',
  required,
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
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          'w-full px-4 py-3 rounded-lg border text-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white',
          disabled && 'opacity-50 cursor-not-allowed'
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
