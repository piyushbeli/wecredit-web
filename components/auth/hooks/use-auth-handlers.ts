import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { authService, setAuthToken, setMobile } from '@/lib/api';
import { useLoading } from '@/hooks/use-loading';

/**
 * Return type for useAuthHandlers hook
 */
interface UseAuthHandlersReturn {
  phoneNumber: string;
  otpValue: string;
  isPhoneValid: boolean;
  isLoading: boolean;
  error: string | null;
  handlePhoneChange: (value: string, isValid: boolean) => void;
  handleSendOtp: () => Promise<void>;
  handleOtpChange: (otp: string) => void;
  handleVerifyOtp: (otpOverride?: string) => Promise<void>;
  handleResendOtp: () => Promise<void>;
  setOtpValue: (value: string) => void;
}

/**
 * Custom hook for handling authentication business logic
 * Encapsulates phone validation, OTP sending, verification, and resend logic
 * 
 * @returns Handler functions and state for authentication flow
 */
export const useAuthHandlers = (): UseAuthHandlersReturn => {
  const {
    phoneNumber,
    isModalOpen,
    currentStep,
    shouldAutoSendOtp,
    isLoading,
    error,
    setStep,
    setPhoneNumber,
    setUser,
    setLoading,
    setError,
    clearShouldAutoSendOtp,
  } = useAuthStore();
  const { showLoading, hideLoading } = useLoading();

  const [otpValue, setOtpValue] = useState('');
  const isVerifyingOtpRef = useRef<boolean>(false);

  /**
   * Upswing / OTP-first entry: modal opens on OTP with phone pre-filled; we must still
   * call sendOtp (same as tapping Continue on the phone step). Clears shouldAutoSendOtp
   * synchronously before the async send so Strict Mode does not double-send.
   */
  useEffect(() => {
    if (!isModalOpen || !shouldAutoSendOtp || currentStep !== 'otp') {
      return;
    }

    const trimmed = phoneNumber.trim();
    const isValidForOtp =
      trimmed.length === 10 && /^[6-9]/.test(trimmed) && /^\d{10}$/.test(trimmed);
    if (!isValidForOtp) {
      clearShouldAutoSendOtp();
      setError('Enter a valid 10-digit mobile number starting with 6–9.');
      return;
    }

    clearShouldAutoSendOtp();

    setLoading(true);
    setError(null);
    showLoading('Sending OTP...', 'We are verifying your phone number.');
    void (async () => {
      try {
        const result = await authService.sendOtp(trimmed);
        if (result.success) {
          setLoading(false);
        } else {
          setError(result.error || 'Failed to send OTP. Please try again.');
        }
      } finally {
        hideLoading();
      }
    })();
  }, [
    isModalOpen,
    shouldAutoSendOtp,
    currentStep,
    phoneNumber,
    clearShouldAutoSendOtp,
    setError,
    setLoading,
    showLoading,
    hideLoading,
  ]);

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
    showLoading('Sending OTP...', 'We are verifying your phone number.');
    try {
      const result = await authService.sendOtp(phoneNumber);
      if (result.success) {
        setStep('otp');
        setLoading(false);
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
      }
    } finally {
      hideLoading();
    }
  };

  /** Handle OTP change */
  const handleOtpChange = (otp: string): void => {
    setOtpValue(otp);
    setError(null);
  };

  /** Handle OTP verification */
  const handleVerifyOtp = async (otpOverride?: string): Promise<void> => {
    const otpToVerify = otpOverride ?? otpValue;
    if (otpToVerify.length !== 6 || isLoading || isVerifyingOtpRef.current) return;
    isVerifyingOtpRef.current = true;
    setLoading(true);
    setError(null);
    try {
      showLoading('Please wait...', "We're preparing your WeCredit experience.");
      const result = await authService.verifyOtp(phoneNumber, otpToVerify);
      if (result.success && result.data) {
        setAuthToken(result.data.token);
        setMobile(phoneNumber);
        setUser(result.data.user, result.data.token);
        setOtpValue('');
        return;
      }
      setError(result.error || 'Invalid OTP. Please try again.');
    } finally {
      isVerifyingOtpRef.current = false;
      hideLoading();
    }
  };

  /** Handle OTP resend */
  const handleResendOtp = async (): Promise<void> => {
    setError(null);
    setOtpValue('');
    showLoading('Resending OTP...', 'Please wait a moment.');
    try {
      const result = await authService.resendOtp(phoneNumber);
      if (!result.success) {
        setError(result.error || 'Failed to resend OTP. Please try again.');
      }
    } finally {
      hideLoading();
    }
  };

  return {
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
  };
};
