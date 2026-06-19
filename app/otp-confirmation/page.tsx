'use client';

import { Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import OtpInput from 'react-otp-input';
import StandaloneAuthLayout from '@/components/auth/standalone-auth-layout';
import { authService, setAuthToken, setMobile } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

const RESEND_SECONDS = 30;

const OtpConfirmationPage = (): React.ReactNode => {
  const router = useRouter();
  const { setUser, phoneNumber: storePhoneNumber } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [phoneNumber] = useState(() => {
    if (typeof window === 'undefined') return storePhoneNumber;
    const url = new URL(window.location.href);
    const queryMobile = url.searchParams.get('mobile') || '';
    const savedMobile = sessionStorage.getItem('standalone_auth_phone') || '';
    return queryMobile || savedMobile || storePhoneNumber;
  });
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maskedPhone = useMemo(() => {
    if (!phoneNumber) return '';
    return `+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`;
  }, [phoneNumber]);

  useEffect(() => {
    if (!phoneNumber) {
      router.replace('/login');
    }
  }, [phoneNumber, router]);

  useEffect(() => {
    if (canResend) return;
    const timer = window.setInterval(() => {
      setResendTimer((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [canResend]);

  const handleOtpChange = (value: string): void => {
    setOtp(value);
    setError(null);
  };

  const handleVerifyOtp = async (event?: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event?.preventDefault();
    if (otp.length !== 6 || !phoneNumber || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.verifyOtp(phoneNumber, otp);
      if (!result.success || !result.data) {
        setError(result.error || 'Invalid OTP. Please try again.');
        return;
      }

      setAuthToken(result.data.token);
      setMobile(phoneNumber);
      setUser(result.data.user, result.data.token);
      sessionStorage.removeItem('standalone_auth_phone');
      router.replace('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    if (!canResend || !phoneNumber || isLoading) return;

    setError(null);
    setOtp('');
    setIsLoading(true);

    try {
      const result = await authService.resendOtp(phoneNumber);
      if (!result.success) {
        setError(result.error || 'Failed to resend OTP. Please try again.');
        return;
      }
      setResendTimer(RESEND_SECONDS);
      setCanResend(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StandaloneAuthLayout>
      <form
        onSubmit={handleVerifyOtp}
        className="w-full max-w-[600px] rounded-2xl bg-white p-8 shadow-[0_24px_70px_rgba(0,0,0,0.09)] md:p-12"
        noValidate
      >
        <h2 className="text-2xl font-semibold text-[#20242b] md:text-3xl">Enter your OTP</h2>
        <p className="mt-4 text-sm text-gray-500 md:text-base">
          We&apos;ve sent a 6-digit code to {maskedPhone || 'your mobile number'}
        </p>

        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-4 text-sm font-semibold text-brand-primary md:text-base"
        >
          Change Number
        </button>

        <div className="mt-7">
          <OtpInput
            value={otp}
            onChange={handleOtpChange}
            numInputs={6}
            renderInput={(props) => {
              const restProps = { ...props, style: undefined };
              return (
                <input
                  {...restProps}
                  inputMode="numeric"
                  disabled={isLoading}
                  className="h-14 w-14 rounded border-b-2 border-brand-primary bg-[#045CCF]/15 text-center text-2xl font-semibold text-gray-900 outline-none disabled:opacity-60 md:h-16 md:w-16"
                />
              );
            }}
            shouldAutoFocus
            containerStyle={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'space-between',
              width: '100%',
            }}
          />
        </div>

        {error && <p className="mt-4 text-sm font-medium text-red-500">{error}</p>}

        <div className="mt-7 space-y-4 text-sm text-gray-500 md:text-base">
          <p>
            Didn&apos;t receive the OTP?{' '}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || isLoading}
              className="font-semibold text-brand-primary disabled:cursor-not-allowed disabled:text-gray-400"
            >
              Resend OTP
            </button>
          </p>

          <p className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            {canResend ? 'You can resend now' : `Resend in 00:${String(resendTimer).padStart(2, '0')}`}
          </p>
        </div>

        <button
          type="submit"
          disabled={otp.length !== 6 || isLoading}
          className="mt-9 flex h-14 w-full items-center justify-center rounded-md bg-brand-primary text-base font-semibold text-white transition-colors hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 md:text-lg"
        >
          {isLoading ? 'Verifying...' : 'Continue'}
        </button>
      </form>
    </StandaloneAuthLayout>
  );
};

export default OtpConfirmationPage;
