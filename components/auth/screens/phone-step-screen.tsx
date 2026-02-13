'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { GradientHeader } from '@/components/shared';
import { BottomSheet, PhoneInput } from '@/components/auth';
import { useAppHeight } from '@/hooks/use-app-height';
import { cn } from '@/lib/utils';
import type { HeaderHeightPreset, PhoneStepScreenProps } from '../types';

/**
 * Phone step screen component
 * Full screen with gradient header and bottom sheet (50-50 layout)
 * Handles phone number input and OTP request
 */
export const PhoneStepScreen = ({
  phoneNumber,
  isPhoneValid,
  isLoading,
  error,
  onPhoneChange,
  onContinue,
  onClose,
  headerHeight = 'sixtyFive',
  headerHeightPercent = 65,
  headerClassName,
  bottomSheetClassName,
}: PhoneStepScreenProps): React.ReactNode => {
  const bottomSheetClasses: string =
    bottomSheetClassName ?? 'flex-1 flex flex-col';
  const containerStyle: React.CSSProperties = useAppHeight();
  const headerHeightStyle: React.CSSProperties | undefined = headerHeightPercent
    ? { height: `calc(var(--app-height, 1vh) * ${headerHeightPercent})` }
    : undefined;
  const resolvedHeaderHeight: HeaderHeightPreset | undefined =
    headerHeightPercent ? undefined : headerHeight;

  return (
    <motion.div
className="relative flex flex-col"
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
         variant="logo-only"
         height={resolvedHeaderHeight}
         style={headerHeightStyle}
         className={headerClassName}
         isPhoneNumberHeader
/>


      {/* Bottom Sheet - fills remaining 50% */}
      <BottomSheet className={bottomSheetClasses}>
        <motion.div
          className="flex-1 flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Title Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-medium mb-1">
              Account
            </h1>
            <p className="text-gray-500 text-sm">
              Login/Create your account
            </p>
          </div>

          {/* Phone Input Section */}
          <div>
            <label className="block text-xs font-semibold tracking-wider mb-2">
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
