import type { BusinessLoanEnquiryPayload, CompanyType, Gender } from '@/lib/api/business-loan-service';
import { BUSINESS_NATURE_CATEGORIES } from '@/lib/constants/business-loan';
import { sanitizeNumericInput } from '@/lib/utils/form-helpers';

export { sanitizeNumericInput };

export type HasGstValue = '' | 'true' | 'false';

/** Field keys per step for multi-step form */
export type BusinessLoanStepFieldKey =
  | 'firstName'
  | 'lastName'
  | 'mobile'
  | 'email'
  | 'gender'
  | 'pincode'
  | 'companyType'
  | 'businessNature'
  | 'hasGst'
  | 'annualTurnover'
  | 'requiredLoanAmount'
  | 'consent';

/** Step 1: Personal Information; Step 2: Business Details; Step 3: Business Financials */
export const BUSINESS_LOAN_STEP_FIELD_MAPPING: Record<number, BusinessLoanStepFieldKey[]> = {
  1: ['firstName', 'lastName', 'mobile', 'email', 'gender', 'pincode'],
  2: ['companyType', 'businessNature', 'hasGst'],
  3: ['annualTurnover', 'requiredLoanAmount', 'consent'],
};

export const BUSINESS_LOAN_STEP_TITLES: Record<number, string> = {
  1: 'Personal Information',
  2: 'Business Details',
  3: 'Business Financials',
};

export const BUSINESS_LOAN_TOTAL_STEPS = 3;

export interface BusinessLoanFormState {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  annualTurnover: string;
  companyType: CompanyType;
  gender: Gender;
  pincode: string;
  requiredLoanAmount: string;
  hasGst: HasGstValue;
  businessNature: string;
  consent: boolean;
}

export const COMPANY_TYPE_OPTIONS: CompanyType[] = [
  'Proprietor',
  'LLP',
  'OPC',
  'PARTNERSHIP',
  'PVT LTD',
];

export const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'Other'];

export const DEFAULT_FORM_STATE: BusinessLoanFormState = {
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  annualTurnover: '',
  companyType: 'Proprietor',
  gender: 'Male',
  pincode: '',
  requiredLoanAmount: '',
  hasGst: '',
  businessNature: '',
  consent: true,
};

/**
 * Test data for business loan form prefill (testing only).
 * Uses a valid BUSINESS_NATURE_CATEGORIES entry so validation passes.
 */
export const BUSINESS_LOAN_PREFILL_TEST_VALUES: BusinessLoanFormState = {
  firstName: 'Test',
  lastName: 'User',
  mobile: '9876543210',
  email: 'test.user@example.com',
  annualTurnover: '500000',
  companyType: 'Proprietor',
  gender: 'Male',
  pincode: '560001',
  requiredLoanAmount: '100000',
  hasGst: 'true',
  businessNature: BUSINESS_NATURE_CATEGORIES[0] ?? 'Professional Services',
  consent: true,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getCanonicalBusinessNature = (value: string): string => {
  // Normalize to a known category to prevent backend mismatch and typos.
  const trimmed = value.trim();
  if (!trimmed) return '';
  const match = BUSINESS_NATURE_CATEGORIES.find(
    (item) => item.toLowerCase() === trimmed.toLowerCase()
  );
  return match ?? trimmed;
};

export const validateBusinessLoanForm = (
  values: BusinessLoanFormState
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
    nextErrors.mobile = 'Mobile number is required';
  } else if (mobileDigits.length !== 10) {
    nextErrors.mobile = 'Enter a valid 10-digit mobile number';
  }

  if (!values.email.trim()) {
    nextErrors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    nextErrors.email = 'Enter a valid email address';
  }

  if (!values.annualTurnover.trim()) {
    nextErrors.annualTurnover = 'Annual turnover is required';
  } else if (Number(values.annualTurnover) <= 0) {
    nextErrors.annualTurnover = 'Enter a valid annual turnover';
  }

  if (!values.companyType) {
    nextErrors.companyType = 'Company type is required';
  }

  if (!values.gender) {
    nextErrors.gender = 'Gender is required';
  }

  const pincodeDigits = values.pincode.replace(/\D/g, '');
  if (!pincodeDigits) {
    nextErrors.pincode = 'Pincode is required';
  } else if (pincodeDigits.length !== 6) {
    nextErrors.pincode = 'Enter a valid 6-digit pincode';
  }

  if (!values.requiredLoanAmount.trim()) {
    nextErrors.requiredLoanAmount = 'Required loan amount is required';
  } else if (Number(values.requiredLoanAmount) <= 0) {
    nextErrors.requiredLoanAmount = 'Enter a valid loan amount';
  }

  if (!values.hasGst) {
    nextErrors.hasGst = 'Please select a GST option';
  }

  const canonical = getCanonicalBusinessNature(values.businessNature);
  if (!canonical) {
    nextErrors.businessNature = 'Nature of business is required';
  } else if (!BUSINESS_NATURE_CATEGORIES.some(
    (item) => item.toLowerCase() === canonical.toLowerCase()
  )) {
    nextErrors.businessNature = 'Please select a category from the list';
  }

  if (!values.consent) {
    nextErrors.consent = 'Please accept the terms and privacy policy';
  }

  return nextErrors;
};

export const buildBusinessLoanPayload = (
  values: BusinessLoanFormState
): BusinessLoanEnquiryPayload => {
  const fullName = (values.firstName.trim() + ' ' + values.lastName.trim()).trim();
  return {
    name: fullName,
    mobile: values.mobile.trim(),
    email: values.email.trim(),
    annualTurnover: Number(values.annualTurnover),
    companyType: values.companyType,
    gender: values.gender,
    pincode: values.pincode.trim(),
    requiredLoanAmount: Number(values.requiredLoanAmount),
    hasGst: values.hasGst === 'true',
    businessNature: getCanonicalBusinessNature(values.businessNature),
    consent: values.consent,
  };
}
