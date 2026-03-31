import { PARTNER_CODE } from '@/lib/constants/api-keys';
import { useUrlParamsStore } from '@/stores/url-params-store';

/**
 * Returns the affiliate `partner` query param when captured in session (see AuthProvider),
 * otherwise the default `WC001` from api-keys.
 *
 * Use for API request bodies that expect `partnerCode` so affiliate links (e.g. ?partner=gm001)
 * drive the backend partner context instead of always sending WC001.
 *
 * SSR-safe: returns PARTNER_CODE when `window` is undefined.
 */
export function getEffectivePartnerCode(): string {
  if (typeof window === 'undefined') {
    return PARTNER_CODE;
  }
  const p = useUrlParamsStore.getState().partner;
  return p?.trim() || PARTNER_CODE;
}
