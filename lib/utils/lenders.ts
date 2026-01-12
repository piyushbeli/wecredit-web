import type { Lender, ActiveLendersResponse } from '@/types/wecredit';

/** Active lender with its ID */
export interface ActiveLender {
  id: string;
  lender: Lender;
}

/**
 * Filters active lenders from API response
 * Returns only lenders where IsAppEnabled=1 and affiliateStatus=1
 */
export function filterActiveLenders(response: ActiveLendersResponse): ActiveLender[] {
  return Object.entries(response)
    .filter(([, lender]) => 
      Number(lender.IsAppEnabled) === 1 && Number(lender.affiliateStatus) === 1
    )
    .map(([id, lender]) => ({ id, lender }));
}
