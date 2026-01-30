/**
 * Car Loan form configuration: state shape, validation, and API payload builder.
 * Single-step form.
 */

import { sanitizeNumericInput } from '@/lib/utils/form-helpers';

export { sanitizeNumericInput };
export type CarLoanGender = 'Male' | 'Female';
export type CarLoanEmploymentType = 'Salaried' | 'Self-employed';

export interface CarLoanFormState {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  gender: CarLoanGender;
  state: string;
  pincode: string;
  employmentType: CarLoanEmploymentType;
  carModel: string;
  consent: boolean;
}

export const CAR_LOAN_GENDER_OPTIONS: CarLoanGender[] = ['Male', 'Female'];

export const CAR_LOAN_EMPLOYMENT_OPTIONS: CarLoanEmploymentType[] = [
  'Salaried',
  'Self-employed',
];

export const DEFAULT_CAR_LOAN_FORM_STATE: CarLoanFormState = {
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  gender: 'Male',
  state: '',
  pincode: '',
  employmentType: 'Salaried',
  carModel: '',
  consent: true,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateCarLoanForm = (
  values: CarLoanFormState
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

  if (!values.email.trim()) {
    nextErrors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    nextErrors.email = 'Enter a valid email address';
  }

  if (!values.gender) {
    nextErrors.gender = 'Gender is required';
  }

  if (!values.state.trim()) {
    nextErrors.state = 'State is required';
  }

  const pincodeDigits = values.pincode.replace(/\D/g, '');
  if (!pincodeDigits) {
    nextErrors.pincode = 'Pincode is required';
  } else if (pincodeDigits.length !== 6) {
    nextErrors.pincode = 'Enter a valid 6-digit pincode';
  }

  if (!values.employmentType) {
    nextErrors.employmentType = 'Employment type is required';
  }

  if (!values.carModel.trim()) {
    nextErrors.carModel = 'Car model is required';
  }

  if (!values.consent) {
    nextErrors.consent = 'Please accept the terms and privacy policy';
  }

  return nextErrors;
};

export interface CarLoanEnquiryPayload {
  name: string;
  mobile: string;
  email: string;
  gender: CarLoanGender;
  state: string;
  pincode: string;
  employmentType: CarLoanEmploymentType;
  carModel: string;
  consent: boolean;
}

export const buildCarLoanPayload = (
  values: CarLoanFormState
): CarLoanEnquiryPayload => {
  const fullName = (values.firstName.trim() + ' ' + values.lastName.trim()).trim();
  return {
    name: fullName,
    mobile: values.mobile.trim(),
    email: values.email.trim(),
    gender: values.gender,
    state: values.state.trim(),
    pincode: values.pincode.trim(),
    employmentType: values.employmentType,
    carModel: values.carModel.trim(),
    consent: values.consent,
  };
};
