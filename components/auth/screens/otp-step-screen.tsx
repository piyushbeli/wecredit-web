'use client';

import { motion } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { GradientHeader } from '@/components/shared';
import { OTPInput } from '@/components/auth';
import { useAppHeight } from '@/hooks/use-app-height';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/constants/images';
import type { HeaderHeightPreset, OTPStepScreenProps } from '../types';

/**
 * OTP step screen component
 * Blue curved header with illustration, white bottom section (50-50 layout)
 * Handles OTP verification
 */
export const OTPStepScreen = ({
  otpValue,
  isLoading,
  error,
  phoneNumber,
  onOtpChange,
  onVerify,
  onResend,
  onBack,
  onClose,
  headerHeightPercent = 65,
  headerHeight = 'threeQuarter',
}: OTPStepScreenProps): React.ReactNode => {
  const isOtpComplete = otpValue.length === 6;
  const containerStyle: React.CSSProperties = useAppHeight();
  const headerHeightStyle: React.CSSProperties | undefined = headerHeightPercent
    ? { height: `calc(var(--app-height, 1vh) * ${headerHeightPercent})` }
    : undefined;
  const resolvedHeaderHeight: HeaderHeightPreset | undefined =
    headerHeightPercent ? undefined : headerHeight;

  return (
    <motion.div
      className="relative flex flex-col bg-white"
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
        height={resolvedHeaderHeight}
        style={headerHeightStyle}
        illustration={IMAGES.ILLUSTRATIONS.OTP_SMS}
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
          className="w-full mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <OTPInput
            onChange={onOtpChange}
            onComplete={(otp) => {
              void onVerify(otp);
            }}
            onResend={onResend}
            onChangeNumber={onBack} 
            error={error || undefined}
            disabled={isLoading}
            variant="default"
            showResend={true}
            phoneNumber={phoneNumber}
          />
        </motion.div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1" />

        {/* Continue Button */}
        <motion.button
          type="button"
          onClick={() => {
            void onVerify();
          }}
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
