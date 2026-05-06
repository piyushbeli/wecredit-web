/**
 * Lead Creation Types
 * TypeScript interfaces for the lead creation flow APIs
 */

// ============================================
// FORM FIELD TYPES (from lenders-form-filled API)
// ============================================

/** All possible field keys returned by the API */
export type FormFieldKey =
  | 'name'
  | 'mobile'
  | 'phone'
  | 'dob'
  | 'email'
  | 'pan'
  | 'pincode'
  | 'gender'
  | 'employmentType'
  | 'salary'
  | 'monthlyIncome'
  | 'declaredIncome'
  | 'loanAmount'
  | 'requiredLoanAmount'
  | 'companyName'
  | 'companyAddress'
  | 'companyPincode'
  | 'permanentAddress'
  | 'addressType'
  | 'maritalStatus'
  | 'modeOfSalary'
  | 'ConsentIp'
  | 'ConsentDateTime'
  | 'consent'
  | 'consentPrivacyPolicy'
  | 'hasCreditCard'
  | 'creditCardLimit'
  | 'consentPartnerTerms';

/** Field types returned by the API */
export type FormFieldType = 'string' | 'number' | 'float' | 'boolean';

/** Dynamic form field structure from API */
export interface FormField {
  /** Display label for the field */
  title: string;
  /** Unique identifier (use this as form field name) */
  key: FormFieldKey;
  /** Field type: string, number, float */
  type: FormFieldType;
  /** Options for select fields (empty array if no options) */
  options: string[];
  /** Pre-filled value (if user data exists) */
  value: string;
  /** Whether field is required */
  isMandatory: boolean;
  /** Display order (sort fields by this) */
  order: number;
  /** Optional lenderName for custom rendering (not from API, injected in UI) */
  lenderName?: string;
}

/** Check if a field should render as a select/dropdown */
export function isSelectField(field: FormField): boolean {
  return field.options.length > 0;
}

/** Response from lenders-form-filled API */
export interface FetchFormFieldsResponse {
  fields: FormField[];
}

// ============================================
// CHECK DEDUPE TYPES
// ============================================

/** Request body for check-dedupe API */
export interface CheckDedupeRequest {
  /** 10-digit mobile number */
  mobile: string;
  /** Always "check-dedupe" */
  endpoint: 'check-dedupe';
  /** Partner code from URL */
  partnerCode: string;
}

/** Response from check-dedupe API */
export interface CheckDedupeResponse {
  /** Status code: 1003 means user needs to fill form, otherwise user can proceed */
  statusCode: number | string;
  /** Human-readable status message */
  statusMessage: string;
  /** True when user should see Prime PL thank-you overlay */
  isPrimePlLead?: boolean;
}

// ============================================
// CREATE LEAD TYPES
// ============================================

/** Gender values (lowercase as returned by API) */
export type GenderValue = 'male' | 'female' | 'other';

/** Gender values for display (capitalized) */
export type GenderDisplayValue = 'Male' | 'Female' | 'Other';

/** Employment type values (as returned by API) */
export type EmploymentTypeValue = 'salaried' | 'selfEmployed';

/** Employment type values for display */
export type EmploymentTypeDisplayValue = 'Salaried' | 'Self Employed';

/** Address type values (lowercase as returned by API) */
export type AddressTypeValue = 'current' | 'permanent';

/** Address type values for display */
export type AddressType = 'Permanent' | 'Current';

/** Marital status values (lowercase as returned by API) */
export type MaritalStatusValue = 'single' | 'married';

/** Marital status values for display */
export type MaritalStatus = 'Single' | 'Married';

/** Request body for create-lead API */
export interface CreateLeadRequest {
  /** 10-digit mobile number */
  mobile: string;
  /** Full name (First + Last) */
  name: string;
  /** PAN card number (UPPERCASE) */
  pan: string;
  /** Employment type: salaried or selfEmployed */
  employmentType: EmploymentTypeValue;
  /** Monthly income (no commas) */
  salary: number;
  /** Date of birth: yyyy-MM-dd */
  dob: string;
  /** 6-digit PIN code */
  pincode: number;
  /** Gender: male, female, other (lowercase) */
  gender: GenderValue;
  /** Valid email address */
  email: string;
  /** User's address */
  permanentAddress?: string;
  /** current or permanent (lowercase) */
  addressType?: AddressTypeValue;
  /** Employer name */
  companyName?: string;
  /** Office address */
  companyAddress?: string;
  /** Office PIN code */
  companyPincode?: number;
  /** Mode of salary */
  modeOfSalary?: string;
  /** single or married (lowercase) */
  maritalStatus?: MaritalStatusValue;
  /** User's IP address */
  ConsentIp: string;
  /** Timestamp: yyyy-MM-dd HH:mm:ss */
  ConsentDateTime: string;
  /** Always "create-lead" */
  endpoint: 'create-lead';
  /** Partner code from URL */
  partnerCode: string;
  /** Specific lenders (Campaign form) */
  lenderName?: string[];
  /** Sub-lender reference */
  originSubLender?: string;
  /** Whether the user has a credit card (multi-lender flow) */
  hasCreditCard?: boolean;
  /** Max credit limit on the user's card when they have one (multi-lender flow) */
  creditCardLimit?: number;
  /** Required loan amount when captured on the dynamic lead form */
  requiredLoanAmount?: number;
}

/** Response from create-lead API */
export interface CreateLeadResponse {
  /** Unique lead identifier */
  leadId: string;
  /** Status code: success or error */
  statusCode: string;
  /** Human-readable status message */
  statusMessage: string;
  /** True when lead is routed to Prime PL success path */
  isPrimePlLead?: boolean;
}

// ============================================
// FORM STATE TYPES
// ============================================

/** Form data structure for UI state (values as stored in form) */
export interface LeadFormData {
  /** Full name */
  name: string;
  /** Mobile number */
  mobile: string;
  /** Phone number (alternative to mobile) */
  phone?: string;
  /** DD-MM-YYYY format */
  dob: string;
  /** Email address */
  email: string;
  /** PAN card number */
  pan: string;
  /** 6-digit PIN code */
  pincode: string;
  /** Lowercase: male, female, other */
  gender: string;
  /** Lowercase: salaried, selfEmployed */
  employmentType: string;
  /** Numeric string (may include commas) */
  salary: string;
  /** Monthly income */
  monthlyIncome?: string;
  /** Declared income */
  declaredIncome?: string;
  /** Loan amount */
  loanAmount?: string;
  /** Required loan amount (lenders-form-filled API) */
  requiredLoanAmount?: string;
  /** Lowercase: single, married */
  maritalStatus: string;
  /** Lowercase: current, permanent */
  addressType: string;
  /** Permanent address */
  permanentAddress: string;
  /** Mode of salary */
  modeOfSalary: string;
  /** Company name */
  companyName: string;
  /** Company address */
  companyAddress: string;
  /** Company PIN code */
  companyPincode: string;
  /** User's IP address (auto-filled) */
  ConsentIp: string;
  /** Consent timestamp (auto-filled) */
  ConsentDateTime: string;
  /** Consent checkbox value */
  consent?: string;
  /** Multi-lender partner terms checkbox value */
  consentPartnerTerms?: string;
  /** Sub-lender reference from URL */
  originSubLender?: string;
  /** Whether the user has a credit card (multi-lender flow; stored as 'true' | 'false' in UI) */
  hasCreditCard?: boolean;
  /** Max credit limit as entered by the user (multi-lender flow) */
  creditCardLimit?: string;
}

/** Form validation errors */
export interface FormErrors {
  [key: string]: string | undefined;
}

// ============================================
// API HEADERS
// ============================================

/** Headers for fetch form fields API */
export interface FetchFormFieldsHeaders {
  'Content-Type': string;
  Authorization: string;
  mobile: string;
  lenderName: string;
  fetchDetails: string;
}

/** Headers for create lead API */
export interface CreateLeadHeaders {
  'Content-Type': string;
  Accept: string;
  Authorization: string;
  mobile: string;
  utm_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  lendername?: string;
}
