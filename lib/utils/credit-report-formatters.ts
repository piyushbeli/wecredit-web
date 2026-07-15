import type {
  CreditScoreChangeType,
  ScoreFactorRating,
  SummaryValueType,
} from '@/types/credit-report';

/**
 * Formats INR amounts with Indian grouping, e.g. 500000 → ₹5,00,000.
 */
export function formatInrAmount(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * INR label without spacing, e.g. ₹5,00,000.
 */
export function formatInrPriceLabel(amount: number): string {
  return formatInrAmount(amount).replace(/\s/g, '');
}

/**
 * Formats compact INR for summary rows, e.g. 320000 → ₹3.2 L.
 */
export function formatInrCompact(amount: number): string {
  if (amount >= 10000000) {
    return `₹${trimTrailingZero(amount / 10000000)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${trimTrailingZero(amount / 100000)} L`;
  }
  return formatInrAmount(amount);
}

function trimTrailingZero(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return value.toFixed(1).replace(/\.0$/, '');
}

/**
 * Formats summary row values by valueType.
 */
export function formatSummaryValue(
  value: number,
  valueType: SummaryValueType,
  currency = 'INR'
): string {
  if (valueType === 'PERCENTAGE') {
    return `${value}%`;
  }
  if (valueType === 'CURRENCY_COMPACT') {
    if (currency === 'INR') {
      return formatInrCompact(value);
    }
    return `${currency} ${value}`;
  }
  return String(value);
}

/**
 * Formats ISO last-updated date for display, e.g. "Last updated 26 Jun 2026".
 */
export function formatLastUpdatedLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'Last updated —';
  }
  const formatted = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
  return `Last updated ${formatted}`;
}

/**
 * Gauge fill progress 0–1 from score range.
 */
export function getCreditScoreProgress(
  score: number,
  minimumScore: number,
  maximumScore: number
): number {
  if (maximumScore <= minimumScore) {
    return 0;
  }
  const clamped = Math.min(maximumScore, Math.max(minimumScore, score));
  return (clamped - minimumScore) / (maximumScore - minimumScore);
}

export interface ScoreFactorToneClasses {
  readonly textClassName: string;
  readonly barClassName: string;
}

/**
 * Maps factor rating to semantic Tailwind classes (no hex in mock data).
 */
export function getScoreFactorToneClasses(rating: ScoreFactorRating): ScoreFactorToneClasses {
  if (rating === 'EXCELLENT' || rating === 'GOOD' || rating === 'LOW') {
    return {
      textClassName: 'text-[#1FAF5A]',
      barClassName: 'bg-[#1FAF5A]',
    };
  }
  if (rating === 'FAIR') {
    return {
      textClassName: 'text-[#F09A2E]',
      barClassName: 'bg-[#F09A2E]',
    };
  }
  return {
    textClassName: 'text-[#E23B3B]',
    barClassName: 'bg-[#E23B3B]',
  };
}

/**
 * Text class for score rating label under the gauge.
 */
export function getScoreRatingClassName(rating: string): string {
  const normalized = rating.toUpperCase();
  if (normalized === 'FAIR') {
    return 'text-[#F09A2E]';
  }
  if (normalized === 'POOR' || normalized === 'VERY POOR') {
    return 'text-[#E23B3B]';
  }
  return 'text-[#1FAF5A]';
}

/**
 * Text class for monthly score change.
 */
export function getMonthlyChangeClassName(changeType: CreditScoreChangeType): string {
  if (changeType === 'INCREASED') {
    return 'text-[#1FAF5A]';
  }
  if (changeType === 'DECREASED') {
    return 'text-[#E23B3B]';
  }
  return 'text-gray-500';
}

/**
 * Builds monthly change label text from mock fields.
 */
export function formatMonthlyChangeLabel(
  monthlyChange: number,
  changeType: CreditScoreChangeType
): string {
  if (changeType === 'UNCHANGED' || monthlyChange === 0) {
    return 'No change';
  }
  const absolute = Math.abs(monthlyChange);
  if (changeType === 'DECREASED' || monthlyChange < 0) {
    return `↓ ${absolute} pts`;
  }
  return `↑ ${absolute} pts`;
}

/**
 * Mobile full-report CTA label.
 */
export function formatUnlockReportCta(sellingPrice: number, currency = 'INR'): string {
  void sellingPrice;
  void currency;
  return 'View full report';
}

/**
 * Tips card secondary CTA label.
 */
export function formatGetFullReportCta(sellingPrice: number, currency = 'INR'): string {
  const price =
    currency === 'INR' ? formatInrPriceLabel(sellingPrice) : `${currency} ${sellingPrice}`;
  return `Get full report `;
}

/**
 * Loan offer subtitle for mobile.
 */
export function formatLoanOfferMobileSubtitle(
  minimumInterestRate: number,
  disbursalTime: string
): string {
  return `From ${minimumInterestRate}% p.a. · Disbursal in ${disbursalTime}`;
}

/**
 * Loan offer subtitle for desktop.
 */
export function formatLoanOfferDesktopSubtitle(params: {
  readonly minimumInterestRate: number;
  readonly disbursalTime: string;
  readonly collateralRequired: boolean;
}): string {
  const base = `Interest from ${params.minimumInterestRate}% p.a. • Disbursal in ${params.disbursalTime}`;
  if (params.collateralRequired) {
    return base;
  }
  return `${base} • No collateral`;
}

/**
 * Tailwind class for rows that must hide on mobile.
 */
export function getHideOnMobileClassName(
  hideOnMobile?: boolean,
  desktopDisplay: 'block' | 'flex' = 'block'
): string {
  if (!hideOnMobile) {
    return '';
  }
  if (desktopDisplay === 'flex') {
    return 'hidden lg:flex';
  }
  return 'hidden lg:block';
}
