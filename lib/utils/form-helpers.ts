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
