'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { useAuthHandlers } from './hooks/use-auth-handlers';
import { usePostLogin } from './hooks/use-post-login';
import { PhoneStepScreen } from './screens/phone-step-screen';
import { OTPStepScreen } from './screens/otp-step-screen';

/**
 * Auth Modal component
 * Renders a full-screen modal with phone input and OTP verification steps
 * 
 * Post-Login Behaviour (PDF Step 5A):
 * After successful login, checks for pending action and executes it
 */
const AuthModal = (): React.ReactNode => {
  const { isModalOpen, currentStep, closeModal, setStep, setError } = useAuthStore();
  const pathname: string = usePathname();
  const previousPathnameRef = useRef<string | null>(null);

  useBodyScrollLock(isModalOpen);

  // Use custom hooks for business logic
  const {
    phoneNumber,
    otpValue,
    isPhoneValid,
    isLoading,
    error,
    handlePhoneChange,
    handleSendOtp,
    handleOtpChange,
    handleVerifyOtp,
    handleResendOtp,
    setOtpValue,
  } = useAuthHandlers();

  // Handle post-login actions
  usePostLogin();

  /** Handle back button click */
  const handleBack = (): void => {
    if (currentStep === 'otp') {
      setStep('phone');
      setError(null);
      setOtpValue('');
    }
  };

  /** Handle close */
  const handleClose = useCallback((): void => {
    closeModal();
    setOtpValue('');
  }, [closeModal, setOtpValue]);

  /** Handle backdrop click */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect((): void => {
    if (!isModalOpen) {
      previousPathnameRef.current = pathname;
      return;
    }
    if (previousPathnameRef.current && previousPathnameRef.current !== pathname) {
      handleClose();
    }
    previousPathnameRef.current = pathname;
  }, [handleClose, isModalOpen, pathname]);
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
            {/* Screen transitions - use sync mode to avoid a visible gap when switching */}
            <AnimatePresence mode="sync" initial={false}>
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

export default AuthModal;
