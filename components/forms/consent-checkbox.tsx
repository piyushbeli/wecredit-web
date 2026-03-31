/**
 * Reusable consent checkbox component shared across loan forms.
 * Keeps the consent wording, styling, and error display consistent.
 */
'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ConsentCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  className?: string;
}

const ConsentCheckbox = ({
  id,
  checked,
  onChange,
  error,
  className,
}: ConsentCheckboxProps): React.ReactNode => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <label htmlFor={id} className="text-sm text-gray-700">
          I agree to the{' '}
          <Link target="_blank" href="/terms-of-service" className="text-blue-600 underline">
            Terms of Service {' '}
          </Link>
          of WeCredit. {' '}
        </label>
      </div>
      {error && <p className="text-xs text-red-600 ml-8">{error}</p>}
    </div>
  );
};

export default ConsentCheckbox;

