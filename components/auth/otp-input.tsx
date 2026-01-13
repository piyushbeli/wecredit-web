'use client';

import { useState, useEffect, useCallback } from 'react';
import OtpInput from 'react-otp-input';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Number of OTP digits */
const OTP_LENGTH = 6;

/** Resend timer duration in seconds */
const RESEND_TIMER_SECONDS = 30;

/** Props for OTPInput component */
interface OTPInputProps {
  /** Controlled value */
  value?: string;
  /** Callback when OTP changes */
  onChange?: (otp: string) => void;
  /** Callback when OTP is complete (6 digits) */
  onComplete?: (otp: string) => void;
  /** Callback when resend is clicked */
  onResend?: () => void;
  /** Error message to display */
  error?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show resend section */
  showResend?: boolean;
  /** Variant for styling - default white boxes, blue for blue background */
  variant?: 'default' | 'blue';
}

/**
 * OTP Input component using react-otp-input
 * Features auto-focus, paste support, and resend timer
 */
const OTPInput = ({
  value: controlledValue,
  onChange,
  onComplete,
  onResend,
  error,
  disabled = false,
  className,
  showResend = true,
  variant = 'default',
}: OTPInputProps): React.ReactNode => {
  const [otp, setOtp] = useState(controlledValue || '');
  const [resendTimer, setResendTimer] = useState(RESEND_TIMER_SECONDS);
  const [canResend, setCanResend] = useState(false);

  /** Sync with controlled value */
  useEffect(() => {
    if (controlledValue !== undefined) {
      setOtp(controlledValue);
    }
  }, [controlledValue]);

  /** Start resend timer on mount */
  useEffect(() => {
    if (!showResend) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResend]);

  /** Handle OTP change */
  const handleOtpChange = useCallback(
    (value: string): void => {
      setOtp(value);
      onChange?.(value);
      if (value.length === OTP_LENGTH) {
        onComplete?.(value);
      }
    },
    [onChange, onComplete]
  );

  /** Handle resend click */
  const handleResend = (): void => {
    if (!canResend || disabled) return;
    setOtp('');
    setResendTimer(RESEND_TIMER_SECONDS);
    setCanResend(false);
    onResend?.();
  };

  /** Get input class based on variant and state */
  const getInputClass = (hasValue: boolean): string => {
    if (variant === 'blue') {
      return cn(
        'w-12 h-14 border rounded-sm text-center text-2xl font-semibold transition-all duration-200',
        'focus:outline-none focus:ring-2',
        hasValue
          ? 'border-wc-blue-300 bg-[#045CCF26] text-white focus:ring-[#045CCF26]'
          : 'border-gray-300 bg-white text-gray-900 focus:border-wc-blue-500',
        disabled && 'opacity-50 cursor-not-allowed'
      );
    }

    // Default variant
    return cn(
      'w-12 h-14 border rounded-sm text-center text-2xl font-semibold transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-wc-blue-100',
      error
        ? 'border-red-500 bg-red-50 text-gray-900'
        : hasValue
          ? 'border-[#045CCF26] bg-[#045CCF26] text-gray-900'
          : 'border-gray-300 bg-white text-gray-900 focus:border-wc-blue-500',
      disabled && 'opacity-50 cursor-not-allowed'
    );
  };

  return (
    <motion.div
      className={cn('w-full', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* OTP Input */}
      <OtpInput
        value={otp}
        onChange={handleOtpChange}
        numInputs={OTP_LENGTH}
        renderInput={(props, index) => {
          const hasValue = otp[index] !== undefined && otp[index] !== '';
          // Exclude the default style from props to allow Tailwind classes to work
          const { style: _style, ...restProps } = props;
          return (
            <input
              {...restProps}
              inputMode="numeric"
              className={getInputClass(hasValue)}
              disabled={disabled}
            />
          );
        }}
        shouldAutoFocus
        containerStyle={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      />

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'text-sm text-center mt-4',
            variant === 'blue' ? 'text-red-300' : 'text-red-500'
          )}
        >
          {error}
        </motion.p>
      )}

      {/* Resend Section */}
      {showResend && (
        <div className={cn(
          'flex justify-center items-center my-6 text-sm',
          variant === 'blue' ? 'text-white/80' : 'text-gray-500'
        )}>
          <span>Didn&apos;t receive the OTP?</span>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={disabled}
              className={cn(
                'ml-1 font-semibold underline transition-colors',
                variant === 'blue'
                  ? 'text-white hover:text-white/90'
                  : 'text-wc-blue-300',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              Resend OTP
            </button>
          ) : (
            <span className={cn(
              'ml-1 font-semibold',
              variant === 'blue' ? 'text-white' : 'text-gray-700'
            )}>
              {resendTimer}s
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default OTPInput;
