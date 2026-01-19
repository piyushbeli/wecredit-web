'use client';

/**
 * EMI Calculator Component
 * Interactive calculator with sliders for loan amount, tenure, and interest rate
 * Calculates and displays EMI, total interest, and total amount in real-time
 */

import { JSX, useState, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { EMI_CALCULATOR_CONFIG } from './constants';
import {
  calculateEmi,
  formatCurrency,
  formatLoanDisplay,
  formatIndianNumber,
  formatTenureDisplay,
  formatRateDisplay,
  type TenureMode,
} from './emi-calculator-helpers';

/** Base slider component props */
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  formatMin: (value: number) => string;
  formatMax: (value: number) => string;
  rightElement?: JSX.Element;
}

/**
 * Custom slider component with new design
 */
const Slider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  formatMin,
  formatMax,
  rightElement,
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
    <div className="bg-white rounded-lg shadow-[1px_1px_4px_rgba(102,102,102,0.10),-1px_-1px_4px_rgba(102,102,102,0.10)] p-4 mb-3">
      {/* Header row with label and optional right element */}
      <div className="flex justify-between items-center">
        <span className="text-zinc-800 text-sm font-medium font-['Poppins'] leading-5">
          {label}
        </span>
        {rightElement}
      </div>

      {/* Large value display */}
      <div className="text-neutral-900 text-lg font-semibold font-['Poppins'] leading-9 mt-1">
        {formatValue(value)}
      </div>

      {/* Custom slider track */}
      <div
        ref={trackRef}
        className="relative h-3 mt-4 cursor-pointer"
        onClick={handleTrackClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Background track */}
        <div className="absolute w-full h-1.5 top-[3px] bg-zinc-300 rounded-3xl" />
        {/* Filled track */}
        <div
          className="absolute h-1.5 top-[3px] bg-blue-700 rounded-3xl"
          style={{ width: `${percentage}%` }}
        />
        {/* Thumb */}
        <div
          className="absolute size-3 bg-white rounded-full border border-blue-700 -translate-x-1/2"
          style={{ left: `${percentage}%` }}
        />
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between mt-2">
        <span className="text-zinc-400 text-xs font-normal font-['Inter'] leading-4">
          {formatMin(min)}
        </span>
        <span className="text-zinc-400 text-xs font-normal font-['Inter'] leading-4">
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
        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
          mode === 'years'
            ? 'bg-wc-blue-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Yr
      </button>
      <button
        type="button"
        onClick={() => onModeChange('months')}
        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
          mode === 'months'
            ? 'bg-wc-blue-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Mo
      </button>
    </div>
  );
};

/**
 * EMI Calculator Section
 * Main component with sliders and calculation results
 */
const EmiCalculator = (): JSX.Element => {
  const { loanAmount: loanConfig, tenure: tenureConfig, interestRate: rateConfig } = EMI_CALCULATOR_CONFIG;

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
    },
    []
  );

  const handleInterestRateChange = useCallback((value: number): void => {
    setInterestRate(value);
  }, []);

  const emiResult = useMemo(
    () => calculateEmi(loanAmount, interestRate, tenureMonths),
    [loanAmount, interestRate, tenureMonths]
  );

  // Tenure values based on mode
  const tenureValue = tenureMode === 'years' ? Math.round(tenureMonths / 12) : tenureMonths;
  const tenureMin = tenureMode === 'years' ? 1 : tenureConfig.minMonths;
  const tenureMax = tenureMode === 'years' ? 24 : tenureConfig.maxMonths;
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

  const formatRateValue = (value: number): string => formatRateDisplay(value);
  const formatRateMin = (value: number): string => `${value}%`;
  const formatRateMax = (value: number): string => `${value}%`;

  return (
    <section className="bg-white py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Section Title */}
        <h2 className="text-xl font-semibold text-center mb-2">
          Personal Loan <span className="text-wc-blue-600">EMI Calculator</span>
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Calculate your monthly EMI instantly
        </p>

        {/* Calculator Card */}
        <div className="">
          {/* Loan Amount Slider */}
          <Slider
            label="Loan Amount"
            value={loanAmount}
            min={loanConfig.min}
            max={loanConfig.max}
            step={loanConfig.step}
            onChange={handleLoanAmountChange}
            formatValue={formatLoanValue}
            formatMin={formatLoanMin}
            formatMax={formatLoanMax}
          />

          {/* Tenure Slider with Toggle */}
          <Slider
            label={tenureLabel}
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
          />

          {/* Interest Rate Slider */}
          <Slider
            label="Rate of Interest"
            value={interestRate}
            min={rateConfig.min}
            max={rateConfig.max}
            step={rateConfig.step}
            onChange={handleInterestRateChange}
            formatValue={formatRateValue}
            formatMin={formatRateMin}
            formatMax={formatRateMax}
          />

          {/* Results Card */}
          <div className="rounded-lg shadow-[0px_0px_8px_0px_rgba(102,102,102,0.15)] border border-gray-200 overflow-hidden">
            {/* Monthly EMI - Blue Header */}
            <div className="bg-wc-blue-500 p-4 flex items-center justify-between">
              <div className="text-white text-2xl font-bold">
                {formatCurrency(emiResult.monthlyEmi)}
              </div>
              <div className="text-white text-sm font-normal">
                Monthly Installment
              </div>
            </div>

            {/* Total Interest & Total Repayment */}
            <div className="bg-white flex divide-x divide-gray-200">
              <div className="flex-1 py-3 px-4 text-center">
                <p className="text-zinc-500 text-sm font-normal uppercase mb-1">
                  Total Interest
                </p>
                <p className="text-zinc-900 text-xl font-medium">
                  {formatCurrency(emiResult.totalInterest)}
                </p>
              </div>
              <div className="flex-1 py-3 px-4 text-center">
                <p className="text-zinc-500 text-sm font-normal uppercase mb-1">
                  Total Repayment
                </p>
                <p className="text-zinc-900 text-xl font-medium">
                  {formatCurrency(emiResult.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default EmiCalculator;
