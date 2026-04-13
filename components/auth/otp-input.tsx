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
  /** Callback when change number is clicked */
  onChangeNumber?: () => void;
  /** Error message to display */
  error?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show resend section */
  showResend?: boolean;
  /** Phone number to display */
  phoneNumber?: string;
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
  onChangeNumber,
  error,
  disabled = false,
  className,
  showResend = true,
  phoneNumber = '',
  variant = 'default',
}: OTPInputProps): React.ReactNode => {
  const [otp, setOtp] = useState(controlledValue || '');
  const [resendTimer, setResendTimer] = useState(RESEND_TIMER_SECONDS);
  const [canResend, setCanResend] = useState(false);
  /**
   * Bumps when the user resends so the countdown effect re-runs.
   * The interval clears itself when the timer hits 0; without a new effect run,
   * resetting `resendTimer` to 30 would leave no active interval (UI stuck on "30s").
   */
  const [resendTimerEpoch, setResendTimerEpoch] = useState(0);

  /** Sync with controlled value */
  useEffect(() => {
    if (controlledValue !== undefined) {
      setOtp(controlledValue);
    }
  }, [controlledValue]);

  /** Start / restart resend countdown (mount + each resend) */
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
  }, [showResend, resendTimerEpoch]);

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
    setResendTimerEpoch((n) => n + 1);
    onResend?.();
  };

  /** Get input class based on variant and state */
  const getInputClass = (hasValue: boolean): string => {
    // Consistent styling for all states - matching Figma design
    if (variant === 'blue') {
      return cn(
        'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 rounded text-center text-xl sm:text-2xl font-bold transition-all duration-200',
        'border-white/30 bg-white/20 text-white placeholder:text-white/40',
        'backdrop-blur-sm ',
        disabled && 'opacity-50 cursor-not-allowed', 'focus:outline-none'
      );
    }

    // Default variant - matching Figma: #045CCF at 15% opacity, corner radius 4
    return cn(
      'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-b-2 border-brand-primary rounded text-center text-xl sm:text-2xl font-bold transition-all duration-200',
      error
        ? 'border-b-red-400 bg-red-50 text-gray-900'
        : 'bg-[#045CCF]/15 text-gray-900 placeholder:text-gray-400',
      disabled && 'opacity-50 cursor-not-allowed', 'focus:outline-none'
    );
  };

  return (
    <motion.div
      className={cn('w-full flex flex-col items-center', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* OTP Input */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 px-4 sm:px-0"
      >
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
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'text-sm text-center mb-4 font-medium',
            variant === 'blue' ? 'text-red-200' : 'text-red-500'
          )}
        >
          {error}
        </motion.p>
      )}

      {/* Resend Section */}
      {showResend && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-2"
        >
          <div className={cn(
            'flex flex-wrap justify-center items-center gap-1 text-sm',
            variant === 'blue' ? 'text-white/90' : 'text-gray-600'
          )}>
            <span>Didn&apos;t receive the OTP?</span>
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={disabled}
                className={cn(
                  'font-semibold transition-colors',
                  variant === 'blue'
                    ? 'text-white  hover:text-white/80'
                    : 'text-brand-primary hover:text-brand-primary/80',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                Resend OTP
              </button>
            ) : (
              <span className={cn(
                'font-semibold',
                variant === 'blue' ? 'text-white' : 'text-gray-900'
              )}>
                Resend in {resendTimer}s
              </span>
            )}
          </div>

          {/* Phone number and change link */}
          {phoneNumber && (
            <motion.p
              className="text-sm text-gray-600 mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              we have sent OTP on {phoneNumber}{' '}
              <button
                type="button"
                onClick={onChangeNumber}
                className="text-wc-blue-500 font-bold hover:text-wc-blue-600 transition-colors"
              >
                Change Number
              </button>
            </motion.p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default OTPInput;
