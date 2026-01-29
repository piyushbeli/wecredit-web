/**
 * Home Loan form configuration: state shape, validation, and API payload builder.
 * Single-step form; no step mapping.
 */

export type HomeLoanEmploymentType = 'Salaried' | 'Self-employed';

export interface HomeLoanFormState {
  firstName: string;
  lastName: string;
  mobile: string;
  permanentPincode: string;
  propertyPincode: string;
  employmentType: HomeLoanEmploymentType;
  loanAmount: string;
  consent: boolean;
}

export const HOME_LOAN_EMPLOYMENT_OPTIONS: HomeLoanEmploymentType[] = [
  'Salaried',
  'Self-employed',
];

export const DEFAULT_HOME_LOAN_FORM_STATE: HomeLoanFormState = {
  firstName: '',
  lastName: '',
  mobile: '',
  permanentPincode: '',
  propertyPincode: '',
  employmentType: 'Salaried',
  loanAmount: '',
  consent: true,
};

/** Normalize numeric input for mobile and pincode fields. */
export const sanitizeNumericInput = (value: string, maxLength?: number): string => {
  const digits = value.replace(/\D/g, '');
  return typeof maxLength === 'number' ? digits.slice(0, maxLength) : digits;
};

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

  if (!values.employmentType) {
    nextErrors.employmentType = 'Employment type is required';
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
  permanentPincode: string;
  propertyPincode: string;
  employmentType: HomeLoanEmploymentType;
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
    permanentPincode: values.permanentPincode.trim(),
    propertyPincode: values.propertyPincode.trim(),
    employmentType: values.employmentType,
    loanAmount: Number(values.loanAmount),
    consent: values.consent,
  };
};
