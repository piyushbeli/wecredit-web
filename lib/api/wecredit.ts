/**
 * WeCredit Public API Client
 * Direct calls to WeCredit backend API
 */

import { wecreditConfig } from '@/lib/config';
import { ENDPOINTS, HEADER_MOBILE } from '@/lib/constants/api-keys';
import type { ActiveLendersResponse } from '@/types/wecredit';

/** Options for WeCredit API requests */
export interface WeCreditOptions {
  mobile?: string;
  authorization?: string;
  headers?: Record<string, string>;
}

/** Default empty response when API fails */
const DEFAULT_LENDERS_RESPONSE: ActiveLendersResponse = {};

/**
 * Builds headers for WeCredit API request
 * Includes environment-specific headers (X-Agent-Host in dev/staging)
 */
function buildHeaders(options: WeCreditOptions): Record<string, string> {
  const { mobile, authorization, headers = {} } = options;
  return {
    ...wecreditConfig.headers,
    ...(mobile && { [HEADER_MOBILE]: mobile }),
    ...(authorization && { Authorization: `Bearer ${authorization}` }),
    ...headers,
  };
}

/**
 * Fetches active lenders from WeCredit API
 * Calls backend directly: https://api.wecredit.co.in/api/public
 * Returns empty array on error to prevent page crash
 */
export async function fetchActiveLenders(
  options: WeCreditOptions = {}
): Promise<ActiveLendersResponse> {
  try {
    const response = await fetch(wecreditConfig.gatewayUrl, {
      method: 'POST',
      headers: buildHeaders(options),
      body: JSON.stringify({
        endpoint: ENDPOINTS.PUBLIC.ACTIVE_LENDERS,
        partnerCode: wecreditConfig.partnerCode,
      }),
      // Add cache settings for Next.js
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      // Use warn instead of error to avoid Next.js dev overlay
      console.warn(`[fetchActiveLenders] API returned ${response.status}, using fallback`);
      return DEFAULT_LENDERS_RESPONSE;
    }
    const data = await response.json() as ActiveLendersResponse;
    return data;
  } catch {
    // Silently fail and return empty response - API might be temporarily unavailable
    console.warn('[fetchActiveLenders] API unavailable, using fallback');
    return DEFAULT_LENDERS_RESPONSE;
  }
}
