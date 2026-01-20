/**
 * EMI Calculator Helper Functions
 * Pure utility functions for EMI calculations and currency formatting
 */

/** EMI calculation result interface */
export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalAmount: number;
}

/** Tenure mode type */
export type TenureMode = 'months' | 'years';

/**
 * Calculates EMI using standard formula
 * EMI = P x R x (1+R)^N / [(1+R)^N - 1]
 * @param principal - Loan principal amount
 * @param annualRate - Annual interest rate in percentage
 * @param tenureMonths - Loan tenure in months
 * @returns EMI calculation result with monthly EMI, total interest, and total amount
 */
export const calculateEmi = (
  principal: number,
  annualRate: number,
  tenureMonths: number
): EmiResult => {
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    const monthlyEmi = principal / tenureMonths;
    return {
      monthlyEmi,
      totalInterest: 0,
      totalAmount: principal,
    };
  }

  const emiNumerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
  const emiDenominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;
  const monthlyEmi = emiNumerator / emiDenominator;
  const totalAmount = monthlyEmi * tenureMonths;
  const totalInterest = totalAmount - principal;

  return {
    monthlyEmi,
    totalInterest,
    totalAmount,
  };
};

/**
 * Formats number to Indian currency format with rupee symbol
 * @param amount - Number to format
 * @returns Formatted currency string (e.g., "₹ 1,25,000")
 */
export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `₹ ${formatted}`;
};

/**
 * Formats loan amount for display in Indian number system
 * @param amount - Loan amount to format
 * @returns Formatted loan display string (e.g., "₹ 25,000")
 */
export const formatLoanDisplay = (amount: number): string => {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `₹ ${formatted}`;
};

/**
 * Formats number in Indian number system without rupee symbol
 * @param amount - Number to format
 * @returns Formatted string (e.g., "1,25,000")
 */
export const formatIndianNumber = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats tenure value for display
 * @param value - Tenure value
 * @param mode - Tenure mode (months or years)
 * @returns Formatted tenure string (e.g., "12 Months" or "2 Years")
 */
export const formatTenureDisplay = (value: number, mode: TenureMode): string => {
  if (mode === 'years') {
    return `${value} ${value === 1 ? 'Year' : 'Years'}`;
  }
  return `${value} ${value === 1 ? 'Month' : 'Months'}`;
};

/**
 * Formats interest rate for display
 * @param rate - Interest rate value
 * @returns Formatted rate string (e.g., "10.5 %")
 */
export const formatRateDisplay = (rate: number): string => {
  return `${rate} %`;
};

/**
 * Parses Indian currency format string to number
 * Handles formats like "25,000", "₹25,000", "₹ 25,000", "25000"
 * @param input - Currency string to parse
 * @returns Parsed number or NaN if invalid
 */
export const parseIndianCurrency = (input: string): number => {
  if (!input || typeof input !== 'string') {
    return NaN;
  }

  // Remove rupee symbol, spaces, and commas
  const cleaned = input.replace(/[₹,\s]/g, '');

  // Parse the cleaned string
  const parsed = parseFloat(cleaned);

  return parsed;
};

/**
 * Parses percentage string to number
 * Handles formats like "10.5", "10.5%", "10.5 %"
 * @param input - Percentage string to parse
 * @returns Parsed number or NaN if invalid
 */
export const parsePercentage = (input: string): number => {
  if (!input || typeof input !== 'string') {
    return NaN;
  }

  // Remove percentage symbol and spaces
  const cleaned = input.replace(/[%\s]/g, '');

  // Parse the cleaned string
  const parsed = parseFloat(cleaned);

  return parsed;
};

/**
 * Parses tenure string to number
 * Handles formats like "4", "4 Months", "2 Years"
 * @param input - Tenure string to parse
 * @returns Parsed number or NaN if invalid
 */
export const parseTenure = (input: string): number => {
  if (!input || typeof input !== 'string') {
    return NaN;
  }

  // Remove text like "Months", "Years", "Month", "Year" and spaces
  const cleaned = input.replace(/[^0-9.]/g, '');

  // Parse the cleaned string
  const parsed = parseFloat(cleaned);

  return parsed;
};

/**
 * Clamps value to min/max bounds and rounds to nearest step
 * @param value - Value to clamp and round
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param step - Step to round to
 * @returns Clamped and stepped value
 */
export const clampAndStep = (
  value: number,
  min: number,
  max: number,
  step: number
): number => {
  // Handle NaN or invalid input
  if (isNaN(value) || !isFinite(value)) {
    return min;
  }

  // Clamp to bounds
  const clamped = Math.max(min, Math.min(max, value));

  // Round to nearest step
  const stepped = Math.round(clamped / step) * step;

  // Ensure result is still within bounds after stepping
  return Math.max(min, Math.min(max, stepped));
};
