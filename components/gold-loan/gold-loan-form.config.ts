/**
 * Gold Loan form configuration: state shape, validation, and API payload builder.
 * Single-step form.
 */

import {
  sanitizeNumericInput,
  formatDobForApi,
  dobToNativeFormat,
  isValidDobFormat,
  normalizePan,
} from '@/lib/utils/form-helpers';

export { sanitizeNumericInput, formatDobForApi, dobToNativeFormat };
export interface GoldLoanFormState {
  firstName: string;
  lastName: string;
  mobile: string;
  dob: string;
  pan: string;
  state: string;
  city: string;
  loanAmount: string;
  consent: boolean;
}

export const DEFAULT_GOLD_LOAN_FORM_STATE: GoldLoanFormState = {
  firstName: '',
  lastName: '',
  mobile: '',
  dob: '',
  pan: '',
  state: '',
  city: '',
  loanAmount: '',
  consent: true,
};

/** PAN format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F). */
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export const validateGoldLoanForm = (
  values: GoldLoanFormState
): Record<string, string> => {
  const nextErrors: Record<string, string> = {};

  if (!values.firstName.trim()) {
    nextErrors.firstName = 'First name is required';
  }

  if (!values.lastName.trim()) {
    nextErrors.lastName = 'Last name is required';
  }

  const mobileDigits = values.mobile.replace(/\D/g, '');
  if (!mobileDigits) {
    nextErrors.mobile = 'Phone number is required';
  } else if (mobileDigits.length !== 10) {
    nextErrors.mobile = 'Enter a valid 10-digit phone number';
  }

  if (!values.dob.trim()) {
    nextErrors.dob = 'Date of birth is required';
  } else if (!isValidDobFormat(values.dob)) {
    nextErrors.dob = 'Enter a valid date of birth';
  }

  const panUpper = normalizePan(values.pan);
  if (!panUpper) {
    nextErrors.pan = 'PAN is required';
  } else if (panUpper.length !== 10) {
    nextErrors.pan = 'Enter a valid 10-character PAN number';
  } else if (!PAN_REGEX.test(panUpper)) {
    nextErrors.pan = 'Enter a valid PAN (e.g. ABCDE1234F)';
  }

  if (!values.state.trim()) {
    nextErrors.state = 'State is required';
  }

  if (!values.city.trim()) {
    nextErrors.city = 'City is required';
  }

  if (!values.loanAmount.trim()) {
    nextErrors.loanAmount = 'Loan amount is required';
  } else if (Number(values.loanAmount) <= 0) {
    nextErrors.loanAmount = 'Enter a valid loan amount';
  }

  if (!values.consent) {
    nextErrors.consent = 'Please accept the terms and privacy policy';
  }

  return nextErrors;
};

export interface GoldLoanEnquiryPayload {
  name: string;
  mobile: string;
  dob: string;
  pan: string;
  state: string;
  city: string;
  loanAmount: number;
  consent: boolean;
}

export const buildGoldLoanPayload = (
  values: GoldLoanFormState
): GoldLoanEnquiryPayload => {
  const fullName = (values.firstName.trim() + ' ' + values.lastName.trim()).trim();
  return {
    name: fullName,
    mobile: values.mobile.trim(),
    dob: formatDobForApi(values.dob),
    pan: normalizePan(values.pan),
    state: values.state.trim(),
    city: values.city.trim(),
    loanAmount: Number(values.loanAmount),
    consent: values.consent,
  };
};
