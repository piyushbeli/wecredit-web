'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GradientHeader } from '@/components/shared';
import { BottomSheet, PhoneInput } from '@/components/auth';
import { cn } from '@/lib/utils';

/**
 * Login/Account page for phone number authentication
 * Uses fixed positioning to create a full-screen overlay
 */
const LoginPage = (): React.ReactNode => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  /** Handle phone number change */
  const handlePhoneChange = (value: string, isValid: boolean): void => {
    setPhoneNumber(value);
    setIsPhoneValid(isValid);
  };

  /** Handle continue button click */
  const handleContinue = (): void => {
    if (isPhoneValid) {
      // TODO: Implement OTP flow
      console.log('Continue with phone:', phoneNumber);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white overflow-auto">
      {/* Gradient Header with Logo */}
      <GradientHeader variant="logo-only" height="tall" />

      {/* Bottom Sheet */}
      <BottomSheet>
        {/* Title Section */}
        <div className="mb-6">
          <motion.h1
            className="text-2xl font-bold text-gray-900 mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Account
          </motion.h1>
          <motion.p
            className="text-gray-500 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Login/Create your account
          </motion.p>
        </div>

        {/* Phone Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-xs font-semibold text-gray-500 tracking-wider mb-2">
            PHONE NUMBER
          </label>
          <PhoneInput
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder=""
          />
        </motion.div>

        {/* Terms & Conditions */}
        <motion.p
          className="text-xs text-gray-500 mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
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
            Private Policy
          </Link>
        </motion.p>

        {/* Continue Button */}
        <motion.button
          type="button"
          onClick={handleContinue}
          disabled={!isPhoneValid}
          className={cn(
            'w-full mt-6 py-4 rounded-full font-semibold text-base transition-all duration-300',
            isPhoneValid
              ? 'bg-wc-blue-500 text-white shadow-lg shadow-wc-blue-500/30 hover:bg-wc-blue-600 active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileTap={isPhoneValid ? { scale: 0.98 } : {}}
        >
          Continue
        </motion.button>
      </BottomSheet>
    </div>
  );
};

export default LoginPage;

