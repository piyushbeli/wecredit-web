'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import StandaloneAuthLayout from '@/components/auth/standalone-auth-layout';
import { authService } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

const LoginPage = (): React.ReactNode => {
  const router = useRouter();
  const { isAuthInitialized, isAuthenticated, setPhoneNumber } = useAuthStore();
  const [phoneNumber, setLocalPhoneNumber] = useState('');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPhoneValid = phoneNumber.length === 10 && /^[6-9]/.test(phoneNumber);
  const canContinue = isPhoneValid && hasAcceptedTerms && !isLoading;

  useEffect(() => {
    if (isAuthInitialized && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthInitialized, isAuthenticated, router]);

  if (!isAuthInitialized || isAuthenticated) {
    return null;
  }

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 10);
    setLocalPhoneNumber(digitsOnly);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!canContinue) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.sendOtp(phoneNumber);
      if (!result.success) {
        setError(result.error || 'Failed to send OTP. Please try again.');
        return;
      }

      setPhoneNumber(phoneNumber);
      sessionStorage.setItem('standalone_auth_phone', phoneNumber);
      router.push(`/otp-confirmation?mobile=${phoneNumber}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StandaloneAuthLayout>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[600px] rounded-2xl bg-white p-8 shadow-[0_24px_70px_rgba(0,0,0,0.09)] md:p-12"
        noValidate
      >
        <h2 className="text-2xl font-semibold text-[#20242b] md:text-3xl">Welcome to WeCredit</h2>
        <p className="mt-4 text-base text-gray-500">Login/Create your account</p>

        <div className="mt-10">
          <label className="block text-sm font-bold uppercase tracking-wide text-gray-600">
            Phone Number
          </label>
          <div className="mt-6 flex items-center border-b-2 border-brand-primary pb-3">
            <div className="flex items-center gap-3 pr-4">
              <span className="text-2xl">🇮🇳</span>
              <span className="text-lg font-medium text-[#20242b]">+91</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="Enter your mobile number"
              maxLength={10}
              inputMode="numeric"
              autoComplete="tel"
              className="min-w-0 flex-1 bg-transparent py-2 text-lg text-[#20242b] outline-none placeholder:text-gray-400 md:text-xl"
            />
          </div>
          {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
        </div>

        <label className="mt-7 flex items-center gap-3 text-sm text-gray-500 md:text-base">
          <input
            type="checkbox"
            checked={hasAcceptedTerms}
            onChange={(event) => setHasAcceptedTerms(event.target.checked)}
            className="h-5 w-5 rounded border-gray-300 accent-brand-primary"
          />
          <span>
            By continuing, you agree to our{' '}
            <Link href="/terms-of-service" className="font-semibold text-brand-primary">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="font-semibold text-brand-primary">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={!canContinue}
          className="mt-9 flex h-14 w-full items-center justify-center rounded-md bg-brand-primary text-base font-semibold text-white transition-colors hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 md:text-lg"
        >
          {isLoading ? 'Sending OTP...' : 'Continue'}
        </button>
      </form>
    </StandaloneAuthLayout>
  );
};

export default LoginPage;
