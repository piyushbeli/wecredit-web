'use client';

/**
 * Hero lead capture form with +91 phone input and Get Started CTA.
 * Triggers the existing personal-loan apply flow after OTP or when logged in.
 */

import { JSX, useCallback, useState } from 'react';
import Link from 'next/link';
import { ActionButton } from '@/components/shared';
import { useAuth } from '@/hooks/use-auth';
import { useLoanApplicationStore } from '@/stores/loan-application-store';
import { sanitizeNumericInput } from '@/lib/utils/form-helpers';

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

const isValidIndianMobile = (phone: string): boolean => INDIAN_MOBILE_REGEX.test(phone);

const LeadCaptureForm = (): JSX.Element => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, openAuthModalWithPhoneAndAction } = useAuth();
  const { triggerApplyFlow, isApplyLoading } = useLoanApplicationStore();

  const handlePhoneChange = useCallback((value: string): void => {
    const sanitized = sanitizeNumericInput(value, 10);
    setPhone(sanitized);
    if (error) {
      setError(null);
    }
  }, [error]);

  const handleGetStarted = useCallback((): void => {
    if (!isValidIndianMobile(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (isAuthenticated) {
      triggerApplyFlow();
      return;
    }

    // Skip phone sheet and continue apply flow after OTP via pending action.
    void openAuthModalWithPhoneAndAction(phone, { type: 'open_personal_loan_apply' });
  }, [phone, isAuthenticated, triggerApplyFlow, openAuthModalWithPhoneAndAction]);

  const hasPhoneError = Boolean(error);

  return (
    <div className="w-full mx-auto">
      {/* Phone input with fixed +91 prefix */}
      <div
        className={`flex items-center bg-white rounded-lg border overflow-hidden mb-3 ${
          hasPhoneError ? 'border-red-300' : 'border-gray-200'
        }`}
      >
        <span className="px-3 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 shrink-0">
          +91
        </span>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder="Enter mobile number"
          className="flex-1 px-3 py-3 text-base text-gray-900 outline-none placeholder:text-gray-400"
          aria-label="Mobile number"
          aria-invalid={hasPhoneError}
        />
      </div>

      {hasPhoneError && (
        <p className="text-xs text-red-600 mb-2" role="alert">
          {error}
        </p>
      )}

      <ActionButton
        type="button"
        fullWidth
        className="h-14 text-base font-medium"
        onClick={handleGetStarted}
        isLoading={isApplyLoading}
      >
        Get Started
      </ActionButton>

      <p className="text-xs text-gray-500 mt-3 leading-5">
        By continuing, you agree to our{' '}
        <Link href="/terms-of-service/" className="text-brand-primary underline">
          Terms &amp; Conditions
        </Link>
      </p>
    </div>
  );
};

export default LeadCaptureForm;
