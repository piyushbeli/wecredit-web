/**
 * Reusable Date of Birth field component.
 * Handles common formatting, label, and error rendering for DOB inputs.
 */
'use client';

import { cn } from '@/lib/utils';
import { dobToNativeFormat } from '@/lib/utils/form-helpers';

interface DateOfBirthFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
}

const DateOfBirthField = ({
  id,
  value,
  onChange,
  onBlur,
  error,
  hint,
}: DateOfBirthFieldProps): React.ReactNode => {
  // Normalize the stored DOB into native input format.
  const displayValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : dobToNativeFormat(value);

  return (
    <div>
      <label htmlFor={id} className="lead-form-label">
        Date of Birth <span className="text-red-500">*</span>
      </label>
      <input
        id={id}
        name="dob"
        type="date"
        value={displayValue}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        required
        className={cn(
          'w-full px-4 py-3 rounded-lg border text-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
        )}
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default DateOfBirthField;

