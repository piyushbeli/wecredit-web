import type { Lender, ActiveLendersResponse } from '@/types/wecredit';

/** Active lender with its ID */
export interface ActiveLender {
  id: string;
  lender: Lender;
}

/**
 * Normalizes a string for lender name comparison.
 * Lowercase, trim, collapse spaces to single hyphen for slug-like matching.
 */
function normalizeLenderNameForMatch(name: string): string {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Checks if the URL lender name matches any active lender.
 * Matches against lender.Name and id (case-insensitive, supports slug-like URLs).
 */
export function isLenderNameInActiveLenders(
  urlLenderName: string,
  activeLenders: ActiveLender[]
): boolean {
  return getMatchedLenderCanonicalName(urlLenderName, activeLenders) !== null;
}

/**
 * Returns the canonical lender name (lender.Name) for API calls when URL matches an active lender.
 * Use this for LeadFormModal so the form fields API receives the expected format.
 */
export function getMatchedLenderCanonicalName(
  urlLenderName: string,
  activeLenders: ActiveLender[]
): string | null {
  if (!urlLenderName || typeof urlLenderName !== 'string' || urlLenderName.trim() === '') {
    return null;
  }
  if (!activeLenders || activeLenders.length === 0) {
    return null;
  }
  const normalizedUrl = normalizeLenderNameForMatch(urlLenderName);
  const matched = activeLenders.find(({ id, lender }) => {
    const normalizedName = normalizeLenderNameForMatch(lender.Name || '');
    const normalizedId = normalizeLenderNameForMatch(id);
    return (
      normalizedName === normalizedUrl ||
      normalizedId === normalizedUrl ||
      lender.Name?.toLowerCase().trim() === urlLenderName.toLowerCase().trim()
    );
  });
  if (!matched) return null;
  return matched.lender.Name || matched.id;
}

/**
 * Checks if a lender is active (enabled and affiliate status)
 */
function isActiveLender(lender: Lender): boolean {
  return Number(lender.internalStatus)===1;
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
