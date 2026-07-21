/**
 * Affiliate pre-auth helpers.
 * JWT payload is read only to recover mobile for API headers — auth still requires validateToken.
 */

const MOBILE_CLAIM_KEYS = [
  'phoneNumber',
  'mobile',
  'phone',
  'phone_number',
  'mn',
  'Mobile',
] as const;

/**
 * Returns a 10-digit Indian mobile if present in the token payload; otherwise null.
 * Prefers JWT `phoneNumber` claim (affiliate tokens). Does not verify the JWT signature.
 */
export function extractMobileFromPreAuthToken(token: string): string | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`;
    const parsed = JSON.parse(atob(padded)) as Record<string, unknown>;
    for (const key of MOBILE_CLAIM_KEYS) {
      const value = parsed[key];
      if (typeof value !== 'string' && typeof value !== 'number') {
        continue;
      }
      const digits = String(value).replace(/\D/g, '');
      const local = digits.length > 10 ? digits.slice(-10) : digits;
      if (/^[6-9]\d{9}$/.test(local)) {
        return local;
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Normalizes `mn` query param to a 10-digit mobile, if valid.
 */
export function normalizeMnQueryParam(mn: string | null | undefined): string | null {
  if (!mn) {
    return null;
  }
  const digits = mn.replace(/\D/g, '');
  const local = digits.length > 10 ? digits.slice(-10) : digits;
  if (/^[6-9]\d{9}$/.test(local)) {
    return local;
  }
  return null;
}

/**
 * Removes only `pre_auth` from the current URL; keeps utm/partner params.
 */
export function removePreAuthFromUrl(): void {
  if (typeof window === 'undefined') {
    return;
  }
  const url = new URL(window.location.href);
  if (!url.searchParams.has('pre_auth')) {
    return;
  }
  url.searchParams.delete('pre_auth');
  window.history.replaceState({}, '', url.toString());
}

/**
 * Builds /offers path from current search params without exposing pre_auth.
 */
export function buildOffersRedirectPath(searchParamsString: string): string {
  const params = new URLSearchParams(searchParamsString);
  params.delete('pre_auth');
  const query = params.toString();
  return query ? `/offers?${query}` : '/offers';
}
