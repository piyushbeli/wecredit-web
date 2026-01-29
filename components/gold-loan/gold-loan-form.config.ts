/**
 * Gold Loan form configuration: state shape, validation, and API payload builder.
 * Single-step form.
 */

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

/** Normalize numeric input for mobile and loan amount. */
export const sanitizeNumericInput = (value: string, maxLength?: number): string => {
  const digits = value.replace(/\D/g, '');
  return typeof maxLength === 'number' ? digits.slice(0, maxLength) : digits;
};

/** PAN format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F). */
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

/**
 * Validate DOB in YYYY-MM-DD format (native date input).
 * Same format as Lead form; day/month/year bounds checked.
 */
function isValidDobFormat(value: string): boolean {
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return false;
  const [y, m, d] = trimmed.split('-').map((x) => parseInt(x ?? '0', 10));
  if (d < 1 || d > 31) return false;
  if (m < 1 || m > 12) return false;
  if (y < 1900 || y > 2099) return false;
  return true;
}

/**
 * Convert YYYY-MM-DD (native date input) to DD-MM-YYYY for API.
 * Same as Lead form formatDateForApi.
 */
export const formatDobForApi = (dateStr: string): string => {
  if (!dateStr.trim()) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }
  return dateStr;
};

/**
 * Convert DD-MM-YYYY to YYYY-MM-DD for native date input display.
 * Same as Lead form convertDateToNativeFormat (e.g. when initializing from API).
 */
export const dobToNativeFormat = (dateStr: string): string => {
  if (!dateStr?.trim()) return '';
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

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

  const panUpper = values.pan.trim().toUpperCase();
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
    pan: values.pan.trim().toUpperCase(),
    state: values.state.trim(),
    city: values.city.trim(),
    loanAmount: Number(values.loanAmount),
    consent: values.consent,
  };
};
