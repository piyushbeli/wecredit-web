/**
 * Form Formatters
 * Formatting functions for lead creation form data
 */

/**
 * Formats a number string with Indian currency style (1,00,000)
 * @param value - Number string to format
 * @returns Formatted string with Indian number grouping
 * @example formatIndianCurrency("150000") // "1,50,000"
 */
export function formatIndianCurrency(value: string): string {
  const num = value.replace(/,/g, '');
  if (!num || isNaN(Number(num))) return value;
  const formatter = new Intl.NumberFormat('en-IN');
  return formatter.format(Number(num));
}

/**
 * Parses Indian currency formatted string to plain number
 * @param value - Formatted currency string
 * @returns Plain number or NaN if invalid
 * @example parseIndianCurrency("1,50,000") // 150000
 */
export function parseIndianCurrency(value: string): number {
  return parseFloat(value.replace(/,/g, ''));
}

/**
 * Formats date from yyyy-MM-dd to DD-MM-YYYY (display format)
 * @param date - Date string in yyyy-MM-dd format
 * @returns Date string in DD-MM-YYYY format
 * @example formatDateForDisplay("1990-05-15") // "15-05-1990"
 */
export function formatDateForDisplay(date: string): string {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  if (!year || !month || !day) return date;
  return `${day}-${month}-${year}`;
}

/**
 * Formats date from DD-MM-YYYY to yyyy-MM-dd (API format)
 * @param date - Date string in DD-MM-YYYY format
 * @returns Date string in yyyy-MM-dd format
 * @example formatDateForAPI("15-05-1990") // "1990-05-15"
 */
export function formatDateForAPI(date: string): string {
  if (!date) return '';
  const [day, month, year] = date.split('-');
  if (!day || !month || !year) return date;
  return `${year}-${month}-${day}`;
}

/**
 * Formats current datetime for ConsentDateTime field
 * @returns Current datetime in yyyy-MM-dd HH:mm:ss format
 * @example formatConsentDateTime() // "2026-01-13 14:30:45"
 */
export function formatConsentDateTime(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

/**
 * Formats mobile number with country code
 * @param mobile - 10 digit mobile number
 * @param countryCode - Country code (default: +91)
 * @returns Formatted mobile number
 * @example formatMobileWithCountryCode("9876543210") // "+91 9876543210"
 */
export function formatMobileWithCountryCode(
  mobile: string,
  countryCode: string = '+91'
): string {
  const cleanMobile = mobile.replace(/\D/g, '');
  if (cleanMobile.length !== 10) return mobile;
  return `${countryCode} ${cleanMobile}`;
}

/**
 * Formats PAN number to uppercase
 * @param pan - PAN number to format
 * @returns Uppercase PAN number
 * @example formatPAN("abcde1234f") // "ABCDE1234F"
 */
export function formatPAN(pan: string): string {
  return pan.toUpperCase();
}

/**
 * Capitalizes first letter of each word
 * @param text - Text to capitalize
 * @returns Capitalized text
 * @example capitalizeWords("john doe") // "John Doe"
 */
export function capitalizeWords(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats date input as user types (DD-MM-YYYY)
 * Automatically inserts dashes at appropriate positions
 * @param value - Current input value
 * @param previousValue - Previous input value
 * @returns Formatted date string
 * @example formatDateInput("15", "") // "15"
 * @example formatDateInput("150", "15") // "15-0"
 */
export function formatDateInput(value: string, previousValue: string): string {
  // Remove non-numeric characters except dashes
  const cleaned = value.replace(/[^\d-]/g, '');
  // If deleting, return cleaned value
  if (cleaned.length < previousValue.length) {
    return cleaned;
  }
  // Only digits for processing
  const digits = cleaned.replace(/-/g, '');
  // Format based on length
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)}`;
}

/**
 * Formats salary input with Indian number grouping as user types
 * @param value - Current input value
 * @returns Formatted salary string
 * @example formatSalaryInput("150000") // "1,50,000"
 */
export function formatSalaryInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return formatIndianCurrency(digits);
}

/**
 * Extracts initials from a full name
 * @param name - Full name
 * @returns Initials (max 2 characters)
 * @example getInitials("John Doe") // "JD"
 */
export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
