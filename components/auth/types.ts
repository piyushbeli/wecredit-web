/**
 * Shared type definitions for auth components
 */

/** Props for PhoneStepScreen component */
export type HeaderHeightPreset =
  | 'short'
  | 'medium'
  | 'tall'
  | 'half'
  | 'threeQuarter'
  | 'sixtyFive';

export interface PhoneStepScreenProps {
  phoneNumber: string;
  isPhoneValid: boolean;
  isLoading: boolean;
  error: string | null;
  onPhoneChange: (value: string, isValid: boolean) => void;
  onContinue: () => void;
  onClose: () => void;
  headerHeight?: HeaderHeightPreset;
  headerHeightPercent?: number;
  headerClassName?: string;
  bottomSheetClassName?: string;
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
  headerHeightPercent?: number;
  headerHeight?: HeaderHeightPreset;
}
