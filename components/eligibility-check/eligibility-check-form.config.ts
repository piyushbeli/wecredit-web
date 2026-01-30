/**
 * Eligibility Check form configuration: state shape, validation, and API payload.
 */

import {
  formatDobForApi,
  dobToNativeFormat,
  isValidDobFormat,
  normalizePan,
} from '@/lib/utils/form-helpers';

export { formatDobForApi, dobToNativeFormat };
export type GenderOption = 'Male' | 'Female' | 'Other';

export const GENDER_OPTIONS: { value: GenderOption; label: string }[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

export interface EligibilityCheckFormValues {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  phoneNumber: string;
  dob: string;
  pan: string;
  pincode: string;
  email: string;
}

export const DEFAULT_ELIGIBILITY_CHECK_FORM_VALUES: EligibilityCheckFormValues = {
  firstName: '',
  lastName: '',
  middleName: '',
  gender: '',
  phoneNumber: '',
  dob: '',
  pan: '',
  pincode: '',
  email: '',
};

/** API request payload for /api/wechat (fetch-bureau). */
export interface EligibilityCheckPayload {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: GenderOption;
  phoneNumber: string;
  dob: string;
  pan: string;
  pincode: string;
  email: string;
}

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

/** Basic email format if provided (optional field). */
function isValidEmail(value: string): boolean {
  if (!value.trim()) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value.trim());
}

export function validateEligibilityCheckForm(
  values: EligibilityCheckFormValues
): Record<string, string> {
  const errors: Record<string, string> = {};

  const firstNameTrim = values.firstName.trim();
  if (!firstNameTrim) {
    errors.firstName = 'First name is required';
  } else if (firstNameTrim.length < 2 || firstNameTrim.length > 50) {
    errors.firstName = 'First name must be between 2 and 50 characters';
  }

  const lastNameTrim = values.lastName.trim();
  if (!lastNameTrim) {
    errors.lastName = 'Last name is required';
  } else if (lastNameTrim.length < 2 || lastNameTrim.length > 50) {
    errors.lastName = 'Last name must be between 2 and 50 characters';
  }

  if (!values.gender.trim()) {
    errors.gender = 'Gender is required';
  } else if (!GENDER_OPTIONS.some((o) => o.value === values.gender)) {
    errors.gender = 'Please select a valid gender';
  }

  const phoneDigits = values.phoneNumber.replace(/\D/g, '');
  if (!phoneDigits) {
    errors.phoneNumber = 'Phone number is required';
  } else if (phoneDigits.length !== 10) {
    errors.phoneNumber = 'Enter a valid 10-digit phone number';
  }

  if (!values.dob.trim()) {
    errors.dob = 'Date of birth is required';
  } else if (!isValidDobFormat(values.dob)) {
    errors.dob = 'Enter a valid date (DD-MM-YYYY)';
  }

  const panUpper = normalizePan(values.pan);
  if (!panUpper) {
    errors.pan = 'PAN is required';
  } else if (panUpper.length !== 10) {
    errors.pan = 'Enter a valid 10-character PAN number';
  } else if (!PAN_REGEX.test(panUpper)) {
    errors.pan = 'Enter a valid PAN (e.g. ABCDE1234F)';
  }

  const pincodeDigits = values.pincode.replace(/\D/g, '');
  if (!pincodeDigits) {
    errors.pincode = 'Pin code is required';
  } else if (pincodeDigits.length !== 6) {
    errors.pincode = 'Enter a valid 6-digit pin code';
  }

  if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  return errors;
}

export function buildEligibilityCheckPayload(
  values: EligibilityCheckFormValues
): EligibilityCheckPayload {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    middleName: values.middleName.trim(),
    gender: values.gender as GenderOption,
    phoneNumber: values.phoneNumber.trim(),
    dob: formatDobForApi(values.dob),
    pan: normalizePan(values.pan),
    pincode: values.pincode.trim(),
    email: values.email.trim(),
  };
}
