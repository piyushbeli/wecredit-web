'use client';

import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GradientHeader } from '@/components/shared';
import { BottomSheet, PhoneInput, OTPInput, PhoneIllustration } from '@/components/auth';
import { useAuthStore } from '@/stores/auth-store';
import { authService, setAuthToken, setMobile } from '@/lib/api';
import { cn } from '@/lib/utils';

/** Auth step type for login page */
type LoginStep = 'phone' | 'otp';

/**
 * Login/Account page for phone number authentication
 * Full-page version of the auth flow (same as modal but as a route)
 */
const LoginPage = (): React.ReactNode => {
  const router = useRouter();
  const { isAuthenticated, setUser } = useAuthStore();
  
  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Redirect if already authenticated */
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  /** Handle phone number change */
  const handlePhoneChange = useCallback(
    (value: string, _isValid: boolean): void => {
      setPhoneNumber(value);
      setError(null);
    },
    []
  );

  /** Check if phone number is valid */
  const isPhoneValid = phoneNumber.length === 10 && /^[6-9]/.test(phoneNumber);

  /** Handle continue button click - send OTP */
  const handleSendOtp = async (): Promise<void> => {
    if (!isPhoneValid || isLoading) return;
    setIsLoading(true);
    setError(null);
    const result = await authService.sendOtp(phoneNumber);
    if (result.success) {
      setStep('otp');
      setIsLoading(false);
    } else {
      setError(result.error || 'Failed to send OTP. Please try again.');
      setIsLoading(false);
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
    setIsLoading(true);
    setError(null);
    const result = await authService.verifyOtp(phoneNumber, otpValue);
    if (result.success && result.data) {
      setAuthToken(result.data.token);
      setMobile(phoneNumber);
      setUser(result.data.user, result.data.token);
      router.push('/');
    } else {
      setError(result.error || 'Invalid OTP. Please try again.');
      setIsLoading(false);
    }
  };

  /** Handle OTP resend */
  const handleResendOtp = async (): Promise<void> => {
    setError(null);
    setOtpValue('');
    const result = await authService.sendOtp(phoneNumber);
    if (!result.success) {
      setError(result.error || 'Failed to resend OTP. Please try again.');
    }
  };

  /** Handle back button click */
  const handleBack = (): void => {
    if (step === 'otp') {
      setStep('phone');
      setError(null);
      setOtpValue('');
    } else {
      router.back();
    }
  };

  const isOtpComplete = otpValue.length === 6;

  return (
    <div className="fixed inset-0 z-100 flex flex-col bg-white">
      <AnimatePresence mode="wait">
        {step === 'phone' ? (
          <motion.div
            key="phone-step"
            className="flex flex-col h-full bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            {/* Gradient Header with Logo - 75% height */}
            <GradientHeader variant="logo-only" height="threeQuarter" />

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
                    onChange={handlePhoneChange}
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
                  >
                    Terms & Conditions
                  </Link>{' '}
                  &{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-gray-900 font-semibold hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>

                {/* Spacer to push button to bottom */}
                <div className="flex-1" />

                {/* Continue Button */}
                <motion.button
                  type="button"
                  onClick={handleSendOtp}
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
        ) : (
          <motion.div
            key="otp-step"
            className="flex flex-col h-full bg-white"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2 }}
          >
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBack}
              className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>

            {/* Blue Curved Header with Phone Illustration - 75% height */}
            <div className="wc-hero-gradient-wrapper relative h-[75vh] flex items-center justify-center">
              {/* Curved bottom edge */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-[2rem]" />
              
              {/* Phone Illustration */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="relative z-10"
              >
                <PhoneIllustration />
              </motion.div>
            </div>

            {/* White Content Section - fills remaining space */}
            <div className="flex-1 bg-white px-6 pb-8 -mt-4 flex flex-col">
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
                  onChange={handleOtpChange}
                  onResend={handleResendOtp}
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
                onClick={handleVerifyOtp}
                disabled={!isOtpComplete || isLoading}
                className={cn(
                  'w-full max-w-sm mx-auto py-4 rounded-full font-semibold text-base transition-all duration-300 block',
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
