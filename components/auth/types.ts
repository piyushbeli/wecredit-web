/**
 * Shared type definitions for auth components
 */

/** Props for PhoneStepScreen component */
export interface PhoneStepScreenProps {
  phoneNumber: string;
  isPhoneValid: boolean;
  isLoading: boolean;
  error: string | null;
  onPhoneChange: (value: string, isValid: boolean) => void;
  onContinue: () => void;
  onClose: () => void;
}

/** Props for OTPStepScreen component */
export interface OTPStepScreenProps {
  phoneNumber: string;
  otpValue: string;
  isLoading: boolean;
  error: string | null;
  onOtpChange: (otp: string) => void;
  onVerify: (otpOverride?: string) => void;
  onResend: () => void;
  onBack: () => void;
  onClose: () => void;
}
