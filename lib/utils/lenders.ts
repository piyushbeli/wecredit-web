import type { Lender, ActiveLendersResponse } from '@/types/wecredit';

/** Active lender with its ID */
export interface ActiveLender {
  id: string;
  lender: Lender;
}

/**
 * Checks if a lender is active (enabled and affiliate status)
 */
function isActiveLender(lender: Lender): boolean {
  return Number(lender.IsAppEnabled) === 1 && Number(lender.affiliateStatus) === 1;
}

/**
 * Filters active lenders from API response
 * Handles multiple response formats: string, array, or object
 * Returns only lenders where IsAppEnabled=1 and affiliateStatus=1
 */
export function filterActiveLenders(response: ActiveLendersResponse | string | Lender[]): ActiveLender[] {
  if (!response) return [];

  // Handle string response (needs parsing)
  let data: unknown = response;
  if (typeof response === 'string') {
    try {
      data = JSON.parse(response);
    } catch {
      console.error('[filterActiveLenders] Failed to parse string response');
      return [];
    }
  }

  // Handle array response
  if (Array.isArray(data)) {
    return (data as Lender[])
      .filter(isActiveLender)
      .map((lender) => ({
        id: String(lender.id || lender.Name),
        lender,
      }));
  }

  // Handle object response (Record<string, Lender>)
  const lendersObject = data as Record<string, Lender>;
  return Object.entries(lendersObject)
    .filter(([, lender]) => isActiveLender(lender))
    .map(([id, lender]) => ({ id, lender }));
}
