/**
 * Button Group Component
 * Renders a group of toggle buttons for selection fields
 */

import { cn } from '@/lib/utils';

interface ButtonOption {
  value: string;
  label: string;
}

interface ButtonGroupProps {
  options: ButtonOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  buttonClassName?: string;
  /** id of a heading/label element; exposes this group to assistive tech like a labeled fieldset. */
  ariaLabelledBy?: string;
}

const ButtonGroup = ({ 
  options, 
  value, 
  onChange, 
  disabled,
  error,
  className,
  buttonClassName,
  ariaLabelledBy,
}: ButtonGroupProps) => {
  return (
    <div role="group" aria-labelledby={ariaLabelledBy}>
      <div className={cn('flex gap-2', className)}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={cn(
              'flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-colors',
              value === option.value
                ? 'bg-blue-50 border-blue-600 text-blue-600'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400',
              disabled && 'opacity-50 cursor-not-allowed',
              buttonClassName
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ButtonGroup;
