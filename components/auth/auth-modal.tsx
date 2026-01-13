'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { GradientHeader } from '@/components/shared';
import { BottomSheet, PhoneInput, OTPInput } from '@/components/auth';
import { useAuthStore } from '@/stores/auth-store';
import { authService, setAuthToken, setMobile } from '@/lib/api';
import { cn } from '@/lib/utils';

/**
 * Auth Modal component
 * Renders a full-screen modal with phone input and OTP verification steps
 */
const AuthModal = (): React.ReactNode => {
  const {
    isModalOpen,
    currentStep,
    phoneNumber,
    isLoading,
    error,
    closeModal,
    setStep,
    setPhoneNumber,
    setUser,
    setLoading,
    setError,
  } = useAuthStore();

  const [otpValue, setOtpValue] = useState('');

  /** Handle phone number change */
  const handlePhoneChange = useCallback(
    (value: string, _isValid: boolean): void => {
      setPhoneNumber(value);
      setError(null);
    },
    [setPhoneNumber, setError]
  );

  /** Check if phone number is valid */
  const isPhoneValid = phoneNumber.length === 10 && /^[6-9]/.test(phoneNumber);

  /** Handle continue button click - send OTP */
  const handleSendOtp = async (): Promise<void> => {
    if (!isPhoneValid || isLoading) return;
    setLoading(true);
    setError(null);
    const result = await authService.sendOtp(phoneNumber);
    if (result.success) {
      setStep('otp');
      setLoading(false);
    } else {
      setError(result.error || 'Failed to send OTP. Please try again.');
    }
  };

  /** Handle OTP change */
  const handleOtpChange = (otp: string): void => {
    setOtpValue(otp);
    setError(null);
  };

  /** Handle OTP verification */
  const handleVerifyOtp = async (): Promise<void> => {
    if (otpValue.length !== 6 || isLoading) return;
    setLoading(true);
    setError(null);
    const result = await authService.verifyOtp(phoneNumber, otpValue);
    if (result.success && result.data) {
      setAuthToken(result.data.token);
      setMobile(phoneNumber);
      setUser(result.data.user, result.data.token);
      setOtpValue('');
    } else {
      setError(result.error || 'Invalid OTP. Please try again.');
    }
  };

  /** Handle OTP resend */
  const handleResendOtp = async (): Promise<void> => {
    setError(null);
    setOtpValue('');
    const result = await authService.resendOtp(phoneNumber);
    if (!result.success) {
      setError(result.error || 'Failed to resend OTP. Please try again.');
    }
  };

  /** Handle back button click */
  const handleBack = (): void => {
    if (currentStep === 'otp') {
      setStep('phone');
      setError(null);
      setOtpValue('');
    }
  };

  /** Handle close */
  const handleClose = (): void => {
    closeModal();
    setOtpValue('');
  };

  /** Handle backdrop click */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-100 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Container - handles slide-up entrance */}
          <motion.div
            className="relative flex flex-col h-full overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Screen transitions */}
            <AnimatePresence mode="wait" initial={false}>
              {currentStep === 'phone' ? (
                <PhoneStepScreen
                  key="phone-screen"
                  phoneNumber={phoneNumber}
                  isPhoneValid={isPhoneValid}
                  isLoading={isLoading}
                  error={error}
                  onPhoneChange={handlePhoneChange}
                  onContinue={handleSendOtp}
                  onClose={handleClose}
                />
              ) : (
                <OTPStepScreen
                  key="otp-screen"
                  phoneNumber={phoneNumber}
                  otpValue={otpValue}
                  isLoading={isLoading}
                  error={error}
                  onOtpChange={handleOtpChange}
                  onVerify={handleVerifyOtp}
                  onResend={handleResendOtp}
                  onBack={handleBack}
                  onClose={handleClose}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/** Props for PhoneStepScreen component */
interface PhoneStepScreenProps {
  phoneNumber: string;
  isPhoneValid: boolean;
  isLoading: boolean;
  error: string | null;
  onPhoneChange: (value: string, isValid: boolean) => void;
  onContinue: () => void;
  onClose: () => void;
}

/** Phone step - full screen with gradient header and bottom sheet (50-50 layout) */
const PhoneStepScreen = ({
  phoneNumber,
  isPhoneValid,
  isLoading,
  error,
  onPhoneChange,
  onContinue,
  onClose,
}: PhoneStepScreenProps): React.ReactNode => {
  return (
    <motion.div
      className="relative flex flex-col h-full bg-white"
      initial={{ x: '-30%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-30%', opacity: 0 }}
      transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Gradient Header with Illustration - 75% height */}
      <GradientHeader
        variant="with-illustration"
        height="threeQuarter"
        illustration="/images/logo.png"
        illustrationAlt="Phone authentication illustration"
      />

      {/* Bottom Sheet - fills remaining 50% */}
      <BottomSheet className="flex-1 flex flex-col">
        <motion.div
          className="flex-1 flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Title Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Account
            </h1>
            <p className="text-gray-500 text-sm">
              Login/Create your account
            </p>
          </div>

          {/* Phone Input Section */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 tracking-wider mb-2">
              PHONE NUMBER
            </label>
            <PhoneInput
              value={phoneNumber}
              onChange={onPhoneChange}
              placeholder=""
              error={error || undefined}
            />
          </div>

          {/* Terms & Conditions */}
          <p className="text-xs text-gray-500 my-6 text-center">
            By clicking, I accept the{' '}
            <Link
              href="/terms-of-service"
              className="text-gray-900 font-semibold hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Terms & Conditions
            </Link>{' '}
            &{' '}
            <Link
              href="/privacy-policy"
              className="text-gray-900 font-semibold hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </Link>
          </p>

          {/* Spacer to push button to bottom */}
          <div className="flex-1" />

          {/* Continue Button */}
          <motion.button
            type="button"
            onClick={onContinue}
            disabled={!isPhoneValid || isLoading}
            className={cn(
              'w-full py-4 rounded-full font-semibold text-base transition-all duration-300',
              isPhoneValid && !isLoading
                ? 'bg-wc-blue-500 text-white shadow-lg shadow-wc-blue-500/30 hover:bg-wc-blue-600 active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
            whileTap={isPhoneValid && !isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending OTP...
              </span>
            ) : (
              'Continue'
            )}
          </motion.button>
        </motion.div>
      </BottomSheet>
    </motion.div>
  );
};

/** Props for OTPStepScreen component */
interface OTPStepScreenProps {
  phoneNumber: string;
  otpValue: string;
  isLoading: boolean;
  error: string | null;
  onOtpChange: (otp: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
  onClose: () => void;
}

/** OTP step - blue curved header with illustration, white bottom section (50-50 layout) */
const OTPStepScreen = ({
  otpValue,
  isLoading,
  error,
  onOtpChange,
  onVerify,
  onResend,
  onBack,
  onClose,
}: OTPStepScreenProps): React.ReactNode => {
  const isOtpComplete = otpValue.length === 6;

  return (
    <motion.div
      className="relative flex flex-col h-full bg-white"
      initial={{ x: '30%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '30%', opacity: 0 }}
      transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
    >
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Gradient Header with OTP Illustration - 75% height */}
      <GradientHeader
        variant="with-illustration"
        height="threeQuarter"
        illustration="/assets/images/otp-sms.png"
        illustrationAlt="OTP verification illustration"
      />

      {/* White Content Section - fills remaining space */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 px-6 pb-8 pt-6 flex flex-col relative z-10">
        {/* Title */}
        <motion.h1
          className="text-2xl font-bold text-gray-900 mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Enter your OTP
        </motion.h1>

        {/* OTP Input */}
        <motion.div
          className="w-full max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <OTPInput
            onChange={onOtpChange}
            onResend={onResend}
            error={error || undefined}
            disabled={isLoading}
            variant="default"
            showResend={true}
          />
        </motion.div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1" />

        {/* Continue Button */}
        <motion.button
          type="button"
          onClick={onVerify}
          disabled={!isOtpComplete || isLoading}
          className={cn(
            'w-full max-w-sm mx-auto py-4 rounded-md font-semibold text-base transition-all duration-300 block',
            isOtpComplete && !isLoading
              ? 'bg-wc-blue-500 text-white shadow-lg shadow-wc-blue-500/30 hover:bg-wc-blue-600 active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={isOtpComplete && !isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            'Continue'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AuthModal;
