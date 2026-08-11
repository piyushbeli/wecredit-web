import type { LenderType } from '@/types/wecredit';

/**
 * Prefix for the max-amount line on lender cards.
 * Extend when new `LenderType` values need distinct copy (e.g. personal_loan).
 */
export const getAmountUptoLabel = (
  lenderType: LenderType | null | undefined
): string => {
  if (lenderType === 'business_loan') {
    return 'Business Loan Amount upto';
  }
  return 'Amount upto';
};

export const formatTrendingOfferTenure = (
  tenure: number | null,
  isPayday: number | null | undefined
): string => {
  if (!tenure) {
    return 'N/A';
  }

  const unit = Number(isPayday) === 1 ? 'd' : 'm';
  return `${tenure}${unit}`;
};
