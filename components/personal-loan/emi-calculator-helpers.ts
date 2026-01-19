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
