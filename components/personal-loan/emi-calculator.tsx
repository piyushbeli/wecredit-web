'use client';

/**
 * EMI Calculator Component
 * Interactive calculator with sliders for loan amount, tenure, and interest rate
 * Calculates and displays EMI, total interest, and total amount in real-time
 * Users can edit values directly by clicking on them or using the sliders
 */

import { JSX, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgePercent, CalendarDays, IndianRupee } from 'lucide-react';
import { EMI_CALCULATOR_CONFIG } from './constants';
import { useLoanApplicationStore } from '@/stores/loan-application-store';
import { cn } from '@/lib/utils';
import {
  calculateEmi,
  formatCurrency,
  formatLoanDisplay,
  formatIndianNumber,
  formatTenureDisplay,
  parseIndianCurrency,
  parsePercentage,
  parseTenure,
  clampAndStep,
  type TenureMode,
} from './emi-calculator-helpers';

/** Input type for editable value component */
type InputType = 'currency' | 'number' | 'percentage';

/** Editable value component props */
interface EditableValueProps {
  value: number;
  displayValue: string;
  onChange: (value: number) => void;
  inputType: InputType;
  min: number;
  max: number;
  step: number;
  className?: string;
  inputClassName?: string;
}

/**
 * Editable Value Component
 * Displays a value that can be clicked to edit directly
 * Handles validation, clamping, and keyboard navigation
 */
const EditableValue = ({
  value,
  displayValue,
  onChange,
  inputType,
  min,
  max,
  step,
  className,
  inputClassName,
}: EditableValueProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  /**
   * Parses input based on type and returns validated number
   */
  const parseInput = useCallback(
    (input: string): number => {
      switch (inputType) {
        case 'currency':
          return parseIndianCurrency(input);
        case 'percentage':
          return parsePercentage(input);
        case 'number':
        default:
          return parseTenure(input);
      }
    },
    [inputType]
  );

  /**
   * Handles click on value to start editing
   */
  const handleClick = useCallback((): void => {
    setIsEditing(true);
    // Set initial input value based on type (raw number for easier editing)
    if (inputType === 'currency') {
      setInputValue(value.toString());
    } else if (inputType === 'percentage') {
      setInputValue(value.toString());
    } else {
      setInputValue(value.toString());
    }
  }, [value, inputType]);

  /**
   * Commits the input value and closes edit mode
   */
  const commitValue = useCallback((): void => {
    const parsed = parseInput(inputValue);
    const validated = clampAndStep(parsed, min, max, step);
    onChange(validated);
    setIsEditing(false);
  }, [inputValue, parseInput, min, max, step, onChange]);

  /**
   * Cancels editing and restores previous value
   */
  const cancelEdit = useCallback((): void => {
    setIsEditing(false);
    setInputValue('');
  }, []);

  /**
   * Handles keyboard events for submit/cancel
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitValue();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
    },
    [commitValue, cancelEdit]
  );

  /**
   * Handles blur event to commit value
   */
  const handleBlur = useCallback((): void => {
    commitValue();
  }, [commitValue]);

  /**
   * Handles input change with basic filtering
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const newValue = e.target.value;

      // Allow only valid characters based on input type
      if (inputType === 'percentage') {
        // Allow digits and one decimal point
        if (/^[0-9]*\.?[0-9]*$/.test(newValue) || newValue === '') {
          setInputValue(newValue);
        }
      } else if (inputType === 'currency') {
        // Allow digits and commas for currency
        if (/^[0-9,]*$/.test(newValue) || newValue === '') {
          setInputValue(newValue);
        }
      } else {
        // Allow only digits for number
        if (/^[0-9]*$/.test(newValue) || newValue === '') {
          setInputValue(newValue);
        }
      }
    },
    [inputType]
  );

  /**
   * Gets the appropriate input mode for mobile keyboards
   */
  const getInputMode = (): 'numeric' | 'decimal' => {
    return inputType === 'percentage' ? 'decimal' : 'numeric';
  };

  // Render editing input or display value
  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        inputMode={getInputMode()}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={cn(
          'w-full max-w-[200px] bg-transparent text-lg font-semibold leading-9 text-neutral-900 outline-none',
          inputClassName
        )}
        aria-label="Edit value"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'cursor-pointer text-lg font-semibold leading-9 text-neutral-900 transition-colors hover:text-wc-blue-600',
        className
      )}
      aria-label={`Edit ${displayValue}`}
    >
      {displayValue}
    </button>
  );
};

/** Base slider component props */
interface SliderProps {
  label: string;
  icon?: JSX.Element;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  formatMin: (value: number) => string;
  formatMax: (value: number) => string;
  rightElement?: JSX.Element;
  /** Input type for direct editing - determines parsing and keyboard behavior */
  inputType: InputType;
}

/**
 * Custom slider component with new design
 * Supports both slider interaction and direct value editing
 */
const Slider = ({
  label,
  icon,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  formatMin,
  formatMax,
  rightElement,
  inputType,
}: SliderProps): JSX.Element => {
  const trackRef = useRef<HTMLDivElement>(null);
  const percentage = ((value - min) / (max - min)) * 100;

  const calculateValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const position = (clientX - rect.left) / rect.width;
      const clampedPosition = Math.max(0, Math.min(1, position));
      const rawValue = min + clampedPosition * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.max(min, Math.min(max, steppedValue));
    },
    [min, max, step, value]
  );

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): void => {
      const newValue = calculateValueFromPosition(e.clientX);
      onChange(newValue);
    },
    [calculateValueFromPosition, onChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): void => {
      e.preventDefault();
      const handleMouseMove = (moveEvent: MouseEvent): void => {
        const newValue = calculateValueFromPosition(moveEvent.clientX);
        onChange(newValue);
      };
      const handleMouseUp = (): void => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [calculateValueFromPosition, onChange]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>): void => {
      const touch = e.touches[0];
      const newValue = calculateValueFromPosition(touch.clientX);
      onChange(newValue);
      const handleTouchMove = (moveEvent: TouchEvent): void => {
        const moveTouch = moveEvent.touches[0];
        const movedValue = calculateValueFromPosition(moveTouch.clientX);
        onChange(movedValue);
      };
      const handleTouchEnd = (): void => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    },
    [calculateValueFromPosition, onChange]
  );

  return (
    <div className="mb-2 rounded-lg bg-white p-4 shadow-[1px_1px_4px_rgba(102,102,102,0.10),-1px_-1px_4px_rgba(102,102,102,0.10)] md:mb-7 md:rounded-none md:p-0 md:shadow-none last:md:mb-0">
      {/* Header row with label and optional right element */}
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-1.5 text-sm font-medium leading-5 text-zinc-800 md:text-base md:font-semibold">
          {icon && <span className="hidden text-brand-primary md:inline-flex">{icon}</span>}
          {label}
        </span>
        <div className="flex items-center gap-2">
          {rightElement && <span>{rightElement}</span>}
          <EditableValue
            value={value}
            displayValue={formatValue(value)}
            onChange={onChange}
            inputType={inputType}
            min={min}
            max={max}
            step={step}
            className="hidden min-w-[86px] rounded-md border border-[#b7d4fb] bg-[#eff6ff] px-4 py-1.5 text-center text-sm font-semibold leading-5 text-[#1f2937] hover:text-brand-primary md:inline-flex md:justify-center"
            inputClassName="hidden md:block min-w-[86px] max-w-[120px] rounded-md border border-[#b7d4fb] bg-[#eff6ff] px-2 py-1.5 text-center text-sm leading-5"
          />
        </div>
      </div>

      {/* Editable value display - click to edit directly */}
      <div className="mt-1 md:hidden">
        <EditableValue
          value={value}
          displayValue={formatValue(value)}
          onChange={onChange}
          inputType={inputType}
          min={min}
          max={max}
          step={step}
        />
      </div>

      {/* Custom slider track */}
      <div
        ref={trackRef}
        className="relative mt-4 h-5 cursor-pointer md:mt-4 md:h-3"
        onClick={handleTrackClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Background track */}
        <div className="absolute top-[7px] h-1.5 w-full rounded-3xl bg-zinc-300 md:top-[3px] md:h-1" />
        {/* Filled track */}
        <div
          className="absolute top-[7px] h-1.5 rounded-3xl bg-brand-primary md:top-[3px] md:h-1"
          style={{ width: `${percentage}%` }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1 size-7 -translate-x-1/2 rounded-full border-2 border-brand-primary bg-white md:top-[-2px] md:size-4"
          style={{ left: `${percentage}%` }}
        />
      </div>

      {/* Min/Max labels */}
      <div className="mt-1 flex justify-between md:mt-2">
        <span className="text-xs font-normal leading-4 text-zinc-400 md:text-sm">
          {formatMin(min)}
        </span>
        <span className="text-xs font-normal leading-4 text-zinc-400 md:text-sm">
          {formatMax(max)}
        </span>
      </div>
    </div>
  );
};

/** Toggle button props */
interface TenureToggleProps {
  mode: TenureMode;
  onModeChange: (mode: TenureMode) => void;
}

/**
 * Year/Month toggle component for tenure
 */
const TenureToggle = ({ mode, onModeChange }: TenureToggleProps): JSX.Element => {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => onModeChange('years')}
        className={`rounded cursor-pointer px-3 py-1 text-sm font-medium transition-colors md:px-3 md:py-1.5 md:text-xs ${mode === 'years'
          ? 'bg-wc-blue-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
      >
        <span className="md:hidden">Yr</span>
        <span className="hidden md:inline">YEARS</span>
      </button>
      <button
        type="button"
        onClick={() => onModeChange('months')}
        className={`rounded cursor-pointer px-3 py-1 text-sm font-medium transition-colors md:px-3 md:py-1.5 md:text-xs ${mode === 'months'
          ? 'bg-wc-blue-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
      >
        <span className="md:hidden">Mo</span>
        <span className="hidden md:inline">MONTHS</span>
      </button>
    </div>
  );
};

/**
 * EMI Calculator Section
 * Main component with sliders and calculation results
 */
interface EmiCalculatorProps {
  title: string;
}

const EmiCalculator = ({ title }: EmiCalculatorProps): JSX.Element => {

  const { loanAmount: loanConfig, tenure: tenureConfig, interestRate: rateConfig } = EMI_CALCULATOR_CONFIG;
  const { triggerApplyFlow, isApplyLoading } = useLoanApplicationStore();

  const [loanAmount, setLoanAmount] = useState<number>(loanConfig.default);
  const [tenureMonths, setTenureMonths] = useState<number>(tenureConfig.default);
  const [interestRate, setInterestRate] = useState<number>(rateConfig.default);
  const [tenureMode, setTenureMode] = useState<TenureMode>('months');

  const handleLoanAmountChange = useCallback((value: number): void => {
    setLoanAmount(value);
  }, []);

  const handleTenureChange = useCallback(
    (value: number): void => {
      if (tenureMode === 'years') {
        setTenureMonths(value * 12);
      } else {
        setTenureMonths(value);
      }
    },
    [tenureMode]
  );

  const handleTenureModeChange = useCallback(
    (mode: TenureMode): void => {
      setTenureMode(mode);
      // When switching to years mode, ensure minimum is 1 year (12 months)
      if (mode === 'years' && tenureMonths < 12) {
        setTenureMonths(12);
      }
    },
    [tenureMonths]
  );

  const handleInterestRateChange = useCallback((value: number): void => {
    setInterestRate(value);
  }, []);

  const emiResult = useMemo(
    () => calculateEmi(loanAmount, interestRate, tenureMonths),
    [loanAmount, interestRate, tenureMonths]
  );

  // Tenure values based on mode
  const tenureMin = tenureMode === 'years' ? 1 : tenureConfig.minMonths;
  const tenureMax = tenureMode === 'years' ? 24 : tenureConfig.maxMonths;
  const rawTenureValue = tenureMode === 'years' ? Math.round(tenureMonths / 12) : tenureMonths;
  const tenureValue = Math.max(tenureMin, rawTenureValue);
  const tenureStep = 1;

  const tenureLabel = tenureMode === 'years' ? 'Tenure (Yearly)' : 'Tenure (Monthly)';

  // Format functions using helpers
  const formatLoanValue = (value: number): string => formatLoanDisplay(value);
  const formatLoanMin = (value: number): string => `₹${formatIndianNumber(value)}`;
  const formatLoanMax = (value: number): string => `₹${formatIndianNumber(value)}`;

  const formatTenureValue = (value: number): string => formatTenureDisplay(value, tenureMode);
  const formatTenureMin = (value: number): string => formatTenureDisplay(value, tenureMode);
  const formatTenureMax = (): string => {
    const maxYears = Math.round(tenureConfig.maxMonths / 12);
    return formatTenureDisplay(maxYears, 'years');
  };

  // Show just the number for rate value since % is in the label
  const formatRateValueSimple = (value: number): string => `${value} %`;
  const formatRateMin = (value: number): string => `${value}%`;
  const formatRateMax = (value: number): string => `${value}%`;

  return (
    <section className="bg-white px-0 py-3 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Section Title */}
        <h2 className="mb-6 text-center text-xl font-semibold text-[#202124] md:mb-14 md:text-[32px] md:leading-tight">
          {title}
        </h2>


        {/* Calculator Card */}
        <div className="grid w-full gap-2 md:grid-cols-[minmax(420px,520px)_minmax(0,1fr)] md:gap-7">
          <div className="md:rounded-md md:bg-white md:p-7 md:shadow-[0_14px_30px_rgba(4,92,208,0.08),0_1px_6px_rgba(0,0,0,0.08)]">
            {/* Loan Amount Slider - currency input for direct editing */}
            <Slider
              label="Loan Amount"
              icon={<IndianRupee className="h-3.5 w-3.5" />}
              value={loanAmount}
              min={loanConfig.min}
              max={loanConfig.max}
              step={loanConfig.step}
              onChange={handleLoanAmountChange}
              formatValue={formatLoanValue}
              formatMin={formatLoanMin}
              formatMax={formatLoanMax}
              inputType="currency"
            />

            {/* Tenure Slider with Toggle - number input for direct editing */}
            <Slider
              label={tenureLabel}
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              value={tenureValue}
              min={tenureMin}
              max={tenureMax}
              step={tenureStep}
              onChange={handleTenureChange}
              formatValue={formatTenureValue}
              formatMin={formatTenureMin}
              formatMax={formatTenureMax}
              rightElement={
                <TenureToggle mode={tenureMode} onModeChange={handleTenureModeChange} />
              }
              inputType="number"
            />

            {/* Interest Rate Slider - percentage input for direct editing */}
            <Slider
              label="Rate of Interest"
              icon={<BadgePercent className="h-3.5 w-3.5" />}
              value={interestRate}
              min={rateConfig.min}
              max={rateConfig.max}
              step={rateConfig.step}
              onChange={handleInterestRateChange}
              formatValue={formatRateValueSimple}
              formatMin={formatRateMin}
              formatMax={formatRateMax}
              inputType="percentage"
            />
          </div>

          {/* Results Card */}
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-[0px_0px_8px_0px_rgba(102,102,102,0.15)] md:border-0 md:shadow-none">
            <div className="bg-wc-blue-500 p-4 md:relative md:min-h-[160px] md:overflow-hidden md:rounded-md md:p-7">
              <div className="flex items-center justify-between md:block">
                <div>
                  <p className="hidden text-sm font-semibold uppercase tracking-[0.14em] text-white/90 md:block">
                    Monthly EMI Amount
                  </p>
                  <div className="text-2xl font-bold text-white md:text-5xl md:leading-tight">
                    {formatCurrency(emiResult.monthlyEmi)}
                  </div>
                </div>
                <div className="text-sm font-normal text-white md:hidden">
                  Monthly Installment
                </div>
              </div>
              <div className="pointer-events-none absolute -right-2 bottom-[-28px] hidden text-white/10 md:block">
                <svg width="124" height="90" viewBox="0 0 124 90" fill="none" aria-hidden="true">
                  <rect x="16" y="10" width="84" height="62" rx="8" stroke="currentColor" strokeWidth="10" />
                  <path d="M34 40H62" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                  <path d="M76 30L94 48M94 30L76 48" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Total Interest & Total Repayment */}
            <div className="flex divide-x divide-gray-200 bg-white md:mt-3 md:grid md:grid-cols-2 md:gap-3 md:divide-x-0">
              <div className="flex-1 px-4 py-3 text-center md:rounded-md md:border md:border-gray-100 md:px-4 md:py-4 md:text-left">
                <p className="mb-1 text-sm font-normal uppercase text-zinc-500 md:text-sm md:font-medium md:text-[#202124]">
                  Total Interest
                </p>
                <p className="text-xl font-medium text-zinc-900 md:text-2xl md:font-semibold">
                  {formatCurrency(emiResult.totalInterest)}
                </p>
              </div>
              <div className="flex-1 px-4 py-3 text-center md:rounded-md md:border md:border-gray-100 md:px-4 md:py-4 md:text-left">
                <p className="mb-1 text-sm font-normal uppercase text-zinc-500 md:text-sm md:font-medium md:text-[#202124]">
                  <span className="md:hidden">Total Repayment</span>
                  <span className="hidden md:inline">Total Payable</span>
                </p>
                <p className="text-xl font-medium text-zinc-900 md:text-2xl md:font-semibold">
                  {formatCurrency(emiResult.totalAmount)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={triggerApplyFlow}
              disabled={isApplyLoading}
              className="mt-6 hidden cursor-pointer h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-primary text-base font-semibold text-white transition-colors hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-70 md:flex"
            >
              {isApplyLoading ? 'Checking...' : 'Get Loan Now'}
              {!isApplyLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default EmiCalculator;
