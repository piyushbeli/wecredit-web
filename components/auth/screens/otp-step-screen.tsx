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
  isDesktopModal = false,
}: OTPStepScreenProps): React.ReactNode => {
  const isOtpComplete = otpValue.length === 6;
  const containerStyle: React.CSSProperties = useAppHeight();
  const usesResponsiveModalHeight = isDesktopModal && headerHeightPercent === 65;
  const headerHeightStyle: React.CSSProperties | undefined = headerHeightPercent && !usesResponsiveModalHeight
    ? {
      height: `calc(var(--app-height, 1vh) * ${headerHeightPercent})`,
    }
    : undefined;
  const headerClassName = usesResponsiveModalHeight
    ? 'h-[calc(var(--app-height,1vh)*65)] md:h-[300px]'
    : undefined;
  const resolvedHeaderHeight: HeaderHeightPreset | undefined =
    headerHeightPercent ? undefined : headerHeight;

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!isOtpComplete || isLoading) return;
    // Pass otpValue explicitly — avoids stale state; no auto-verify on 6th digit
    // (that + Enter would double-submit and invalidate a one-time OTP).
    void onVerify(otpValue);
  };

  return (
    <motion.div
      className={cn(
        'relative flex flex-col bg-white',
        isDesktopModal && 'min-h-[calc(var(--app-height,1vh)*100)] md:h-auto md:min-h-0 md:bg-[#0B63D8]'
      )}
      style={isDesktopModal ? undefined : containerStyle}
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
        className={cn(
          headerClassName,
          'md:bg-[#0B63D8]',
          'md:rounded-t-3xl md:overflow-hidden md:[&>div:first-child]:hidden',
          'md:[&>div:last-child]:flex md:[&>div:last-child]:items-center md:[&>div:last-child]:justify-center',
          'md:[&>div:last-child>div]:flex md:[&>div:last-child>div]:h-full md:[&>div:last-child>div]:items-center md:[&>div:last-child>div]:justify-center',
          'md:[&_img]:h-full md:[&_img]:max-h-[280px] md:[&_img]:w-full md:[&_img]:object-contain'
        )}
        illustration={IMAGES.ILLUSTRATIONS.OTP_SMS}
        illustrationAlt="OTP verification illustration"
      />

      {/* White Content Section - fills remaining space */}
      <form
        className="flex-1 bg-white rounded-t-3xl -mt-6 px-6 pb-8 pt-6 flex flex-col relative z-10 md:mt-0 md:flex-none md:rounded-t-none md:px-10 md:pt-8"
        onSubmit={handleFormSubmit}
        noValidate
      >
        {/* Title */}
        <h1
          className="text-2xl font-bold text-gray-900 mb-6 text-center"
        >
          Enter your OTP
        </h1>

        {/* OTP Input */}
        <div
          className="w-full mx-auto"
        >
          <OTPInput
            value={otpValue}
            onChange={onOtpChange}
            onResend={onResend}
            onChangeNumber={onBack}
            error={error || undefined}
            disabled={isLoading}
            variant="default"
            showResend={true}
            phoneNumber={phoneNumber}
          />
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1 md:hidden" />

        {/* Continue Button */}
        <motion.button
          type="submit"
          disabled={!isOtpComplete || isLoading}
          className={cn(
            'w-full max-w-sm mx-auto py-4 rounded-md font-semibold text-base transition-all duration-300 block',
            isOtpComplete && !isLoading
              ? 'bg-wc-blue-500 text-white shadow-lg shadow-wc-blue-500/30 hover:bg-wc-blue-600 active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
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
      </form>
    </motion.div>
  );
};
