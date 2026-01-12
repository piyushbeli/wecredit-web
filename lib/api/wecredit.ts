/**
 * WeCredit Public API Client
 * Direct calls to WeCredit backend API
 */

import { ApiHandler } from '@/lib/utils/api';
import { wecreditConfig } from '@/lib/config';
import { ENDPOINTS, HEADER_MOBILE } from '@/lib/constants/api-keys';
import type { ActiveLendersResponse } from '@/types/wecredit';

/** Options for WeCredit API requests */
export interface WeCreditOptions {
  mobile?: string;
  authorization?: string;
  headers?: Record<string, string>;
}

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
 */
export async function fetchActiveLenders(
  options: WeCreditOptions = {}
): Promise<ActiveLendersResponse> {
  const response = await ApiHandler.post<ActiveLendersResponse>(
    wecreditConfig.gatewayUrl,
    {
      endpoint: ENDPOINTS.PUBLIC.ACTIVE_LENDERS,
      partnerCode: wecreditConfig.partnerCode,
    },
    { headers: buildHeaders(options) }
  );
  return response.data;
}
