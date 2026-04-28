/**
 * Form Helper Utilities
 * Shared input transformation and formatting helpers for forms.
 * Used across business-loan, car-loan, gold-loan, eligibility-check, and home-loan forms.
 */

/**
 * Sanitize numeric input by removing non-digit characters.
 * Used for phone, pincode, and amount fields.
 */
export function sanitizeNumericInput(
  value: string,
  maxLength?: number
): string {
  const digits = value.replace(/\D/g, '');
  return typeof maxLength === 'number' ? digits.slice(0, maxLength) : digits;
}

/**
 * Normalize PAN input for UI use by stripping non-alphanumerics and uppercasing.
 */
export function sanitizePanInput(value: string, maxLength = 10): string {
  const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return cleaned.slice(0, maxLength);
}

/**
 * Convert YYYY-MM-DD (native date input) to DD-MM-YYYY (API format).
 */
export function formatDobForApi(dateStr: string): string {
  if (!dateStr?.trim()) return '';
  // Handle YYYY-MM-DD format (native date input)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }
  // Handle DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return dateStr.replace(/\//g, '-');
  }
  // Already in DD-MM-YYYY format
  return dateStr;
}

/**
 * Convert DD-MM-YYYY to YYYY-MM-DD for native date input display.
 */
export function dobToNativeFormat(dateStr: string): string {
  if (!dateStr?.trim()) return '';
  // Handle DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }
  // Handle DD-MM-YYYY format
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }
  // Already in YYYY-MM-DD format
  return dateStr;
}

/**
 * Normalize DOB input for text-based entry (DD-MM-YYYY).
 * Keeps pasted ISO values readable while the user types digits.
 */
export function normalizeDobTextInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split('-');
    return `${day}-${month}-${year}`;
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    return trimmed.replace(/\//g, '-');
  }

  const digits = trimmed.replace(/\D/g, '').slice(0, 8);
  if (!digits) return '';

  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  return [day, month, year].filter(Boolean).join('-');
}

/**
 * Format DOB for display in text inputs (DD-MM-YYYY).
 */
export function formatDobForDisplay(dateStr: string): string {
  if (!dateStr?.trim()) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return dateStr.replace(/\//g, '-');
  }
  return dateStr;
}

/**
 * Calculates the latest selectable DOB to enforce a minimum age.
 */
export function getDobMaxDate(minAge: number): string {
  const today = new Date();
  // Use local date math to avoid timezone offsets changing the day.
  const cutoff = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
  const year = cutoff.getFullYear();
  const month = String(cutoff.getMonth() + 1).padStart(2, '0');
  const day = String(cutoff.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Validate DOB format (supports YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY).
 * Checks day/month/year ranges (1900-2099).
 */
export function isValidDobFormat(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  const isNative = /^\d{4}-\d{2}-\d{2}$/.test(trimmed);
  const isSlash = /^\d{2}\/\d{2}\/\d{4}$/.test(trimmed);
  const isDash = /^\d{2}-\d{2}-\d{4}$/.test(trimmed);

  if (!isNative && !isSlash && !isDash) return false;

  // Normalize to YYYY-MM-DD for validation
  let normalized: string;
  if (isNative) {
    normalized = trimmed;
  } else {
    const parts = trimmed.replace(/\//g, '-').split('-');
    normalized = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const [y, m, d] = normalized.split('-').map((x) => parseInt(x ?? '0', 10));
  if (d < 1 || d > 31) return false;
  if (m < 1 || m > 12) return false;
  if (y < 1900 || y > 2099) return false;

  return true;
}

/**
 * Uppercase and trim PAN number for consistent API payloads.
 */
export function normalizePan(pan: string): string {
  return pan.trim().toUpperCase();
}

/** Derive firstName and lastName from a single name string (e.g. from auth user). */
export function splitFullName(fullName: string | undefined): { firstName: string; lastName: string } {
  if (!fullName?.trim()) return { firstName: '', lastName: '' };
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ') ?? '';
  return { firstName, lastName };
}

/**
 * Validate credit card max amount input for multi-lender flow.
 * Accepts values with optional commas and requires a positive number.
 */
export function isValidCreditCardMaxAmountInput(raw: string | undefined): boolean {
  const normalized = (raw ?? '').replace(/,/g, '').trim();
  if (!normalized) return false;
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed > 0;
}

/**
 * Whether multi-lender credit card section is complete for submission.
 */
export function isMultiLenderCreditCardSectionComplete(
  isCreditCardFlowEnabled: boolean,
  hasCreditCard: string | undefined,
  creditCardLimit: string | undefined
): boolean {
  if (!isCreditCardFlowEnabled) return true;
  if (hasCreditCard !== 'true' && hasCreditCard !== 'false') return false;
  if (hasCreditCard === 'true') {
    return isValidCreditCardMaxAmountInput(creditCardLimit);
  }
  return true;
}
