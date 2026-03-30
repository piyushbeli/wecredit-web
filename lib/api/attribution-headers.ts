/**
 * Attribution headers helper
 *
 * Reads attribution params captured from URL into the session store and converts them into
 * optional HTTP headers expected by the backend.
 */
import { useUrlParamsStore } from '@/stores/url-params-store';

/**
 * Returns the URL used for `utm_url` header.
 * We prefer the originally captured URL (before we clean the browser URL), so
 * backend still receives full attribution even after `history.replaceState`.
 */
export function getAttributionUtmUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const { utm_url } = useUrlParamsStore.getState();
  if (utm_url) return utm_url;

  return window.location.href;
}

export type GetAttributionHeadersOptions = {
  /**
   * When true, omit `lendername` from URL attribution (e.g. caller already sends `lenderName`).
   */
  omitLender?: boolean;
};

export function getAttributionHeaders(
  options?: GetAttributionHeadersOptions
): Record<string, string> {
  // This helper is used in API services that can run in SSR contexts too.
  // In those cases, session-based attribution isn't available.
  if (typeof window === 'undefined') {
    return {};
  }

  const { utm_source, utm_medium, utm_campaign, lendername } = useUrlParamsStore.getState();

  const headers: Record<string, string> = {};
  if (utm_source) headers["utm_source"] = utm_source;
  if (utm_medium) headers["utm_medium"] = utm_medium;
  if (utm_campaign) headers["utm_campaign"] = utm_campaign;
  // Avoid duplicate lender signals: explicit header elsewhere wins when omitLender is set.
  if (lendername && !options?.omitLender) headers["lendername"] = lendername;

  return headers;
}

export function getAttributionHeadersCommon(
  options?: GetAttributionHeadersOptions
): Record<string, string> {
  return {
    ...getAttributionHeaders(options),
    'utm_url': getAttributionUtmUrl(),
  };
}

