/**
 * WeCredit Public API Client
 * Pure data fetching - no transformation
 * Calls WeCredit API directly with partnerCode in payload
 */

import { api } from '@/lib/utils/api';
import { wecreditApi } from '@/lib/config/endpoints';
import { wecreditConfig } from '@/lib/config';
import type { ActiveLendersResponse } from '@/types/wecredit';

/** Options for WeCredit API requests */
export interface WeCreditOptions {
  mobile?: string;
  authorization?: string;
  headers?: Record<string, string>;
}

/**
 * Builds headers for WeCredit API request
 */
function buildHeaders(options: WeCreditOptions): Record<string, string> {
  const { mobile, authorization, headers = {} } = options;
  return {
    ...(mobile && { mobile }),
    ...(authorization && { Authorization: `Bearer ${authorization}` }),
    ...wecreditConfig.devHeaders,
    ...headers,
  };
}

/**
 * Fetches active lenders from WeCredit API
 * Returns raw API response - no transformation
 */
export async function fetchActiveLenders(
  options: WeCreditOptions = {}
): Promise<ActiveLendersResponse> {
  return api.post<ActiveLendersResponse>(
    wecreditApi.gatewayUrl,
    {
      endpoint: wecreditApi.endpoints.activeLenders,
      partnerCode: wecreditConfig.partnerCode,
    },
    { headers: buildHeaders(options) }
  );
}
