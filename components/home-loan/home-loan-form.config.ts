/**
 * Home Loan form configuration: state shape, validation, and API payload builder.
 * Single-step form; no step mapping.
 */

import {
  sanitizeNumericInput,
  formatDobForApi,
  isValidDobFormat,
  normalizePan,
} from '@/lib/utils/form-helpers';

export { sanitizeNumericInput };

export type HomeLoanIncomeSourceType = 'Salaried' | 'Self-employed';

export interface HomeLoanFormState {
  firstName: string;
  lastName: string;
  mobile: string;
  panNumber: string;
  dob: string;
  permanentPincode: string;
  propertyPincode: string;
  incomeSource: HomeLoanIncomeSourceType;
  loanAmount: string;
  consent: boolean;
}

export const HOME_LOAN_INCOME_SOURCE_OPTIONS: HomeLoanIncomeSourceType[] = [
  'Salaried',
  'Self-employed',
];

export const DEFAULT_HOME_LOAN_FORM_STATE: HomeLoanFormState = {
  firstName: '',
  lastName: '',
  mobile: '',
  panNumber: '',
  dob: '',
  permanentPincode: '',
  propertyPincode: '',
  incomeSource: 'Salaried',
  loanAmount: '',
  consent: true,
};

/** PAN format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F). */
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export const validateHomeLoanForm = (
  values: HomeLoanFormState
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

  const permanentPincodeDigits = values.permanentPincode.replace(/\D/g, '');
  if (!permanentPincodeDigits) {
    nextErrors.permanentPincode = 'Permanent address pincode is required';
  } else if (permanentPincodeDigits.length !== 6) {
    nextErrors.permanentPincode = 'Enter a valid 6-digit pincode';
  }

  const propertyPincodeDigits = values.propertyPincode.replace(/\D/g, '');
  if (!propertyPincodeDigits) {
    nextErrors.propertyPincode = 'Property pincode is required';
  } else if (propertyPincodeDigits.length !== 6) {
    nextErrors.propertyPincode = 'Enter a valid 6-digit pincode';
  }

  const panUpper = normalizePan(values.panNumber);
  if (!panUpper) {
    nextErrors.panNumber = 'PAN is required';
  } else if (panUpper.length !== 10) {
    nextErrors.panNumber = 'Enter a valid 10-character PAN number';
  } else if (!PAN_REGEX.test(panUpper)) {
    nextErrors.panNumber = 'Enter a valid PAN (e.g. ABCDE1234F)';
  }

  if (!values.dob.trim()) {
    nextErrors.dob = 'Date of birth is required';
  } else if (!isValidDobFormat(values.dob)) {
    nextErrors.dob = 'Enter a valid date (DD-MM-YYYY)';
  }

  if (!values.incomeSource) {
    nextErrors.incomeSource = 'Source of income is required';
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

/** Payload shape consumed by home-loan-service submit. */
export interface HomeLoanEnquiryPayload {
  name: string;
  mobile: string;
  panNumber: string;
  dob: string;
  permanentPincode: string;
  propertyPincode: string;
  incomeSource: HomeLoanIncomeSourceType;
  loanAmount: number;
  consent: boolean;
}

export const buildHomeLoanPayload = (
  values: HomeLoanFormState
): HomeLoanEnquiryPayload => {
  const fullName = (values.firstName.trim() + ' ' + values.lastName.trim()).trim();
  return {
    name: fullName,
    mobile: values.mobile.trim(),
    panNumber: normalizePan(values.panNumber),
    dob: formatDobForApi(values.dob),
    permanentPincode: values.permanentPincode.trim(),
    propertyPincode: values.propertyPincode.trim(),
    incomeSource: values.incomeSource,
    loanAmount: Number(values.loanAmount),
    consent: values.consent,
  };
};
