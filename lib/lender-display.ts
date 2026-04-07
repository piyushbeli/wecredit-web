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
