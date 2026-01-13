/**
 * WeCredit Public API Client
 * Direct calls to WeCredit backend API
 * 
 * Implements:
 * - PDF Step 2: Fetch Active Lenders (Generic – Without Mobile Header)
 * - PDF Step 3: Fetch Active Lenders (User-Specific – With Mobile Header)
 * - PDF Step 6: Check Status All API
 */

import { wecreditConfig } from '@/lib/config';
import { ENDPOINTS, HEADER_MOBILE } from '@/lib/constants/api-keys';
import type {
  ActiveLendersResponse,
  CheckStatusAllResponse,
  CheckStatusResult,
  LenderOfferStatus,
  LenderHandlingResult,
} from '@/types/wecredit';

/** Options for WeCredit API requests */
export interface WeCreditOptions {
  mobile?: string;
  authorization?: string;
  headers?: Record<string, string>;
}

/** Default empty response when API fails */
const DEFAULT_LENDERS_RESPONSE: ActiveLendersResponse = {};

/** Default check status response when API fails */
const DEFAULT_CHECK_STATUS_RESPONSE: CheckStatusAllResponse = {
  success: false,
  message: 'Unable to check status',
  hasOffers: false,
  offers: [],
};

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
 * PDF Step 2: Fetch Active Lenders (Generic – Without Mobile Header)
 * 
 * Fetches generic active lenders from WeCredit API
 * Used when user is NOT logged in
 * Returns empty object on error to prevent page crash
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
      // No caching - ensure network call is visible in browser dev tools
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.warn(`[fetchActiveLenders] API returned ${response.status}, using fallback`);
      return DEFAULT_LENDERS_RESPONSE;
    }
    const data = await response.json() as ActiveLendersResponse;
    return data;
  } catch {
    console.warn('[fetchActiveLenders] API unavailable, using fallback');
    return DEFAULT_LENDERS_RESPONSE;
  }
}

/**
 * PDF Step 3: Fetch Active Lenders (User-Specific – With Mobile Header)
 * 
 * Fetches user-specific active lenders from WeCredit API
 * Requires mobile number in header for user identification
 * Used when user IS logged in
 */
export async function fetchActiveLendersForUser(
  mobile: string,
  authorization?: string
): Promise<ActiveLendersResponse> {
  if (!mobile) {
    console.warn('[fetchActiveLendersForUser] Mobile number required');
    return DEFAULT_LENDERS_RESPONSE;
  }
  try {
    const response = await fetch(wecreditConfig.gatewayUrl, {
      method: 'POST',
      headers: buildHeaders({ mobile, authorization }),
      body: JSON.stringify({
        endpoint: ENDPOINTS.PUBLIC.ACTIVE_LENDERS,
        partnerCode: wecreditConfig.partnerCode,
      }),
      // No caching for user-specific data
      cache: 'no-store',
    });
    if (!response.ok) {
      console.warn(`[fetchActiveLendersForUser] API returned ${response.status}, using fallback`);
      return DEFAULT_LENDERS_RESPONSE;
    }
    const data = await response.json() as ActiveLendersResponse;
    return data;
  } catch {
    console.warn('[fetchActiveLendersForUser] API unavailable, using fallback');
    return DEFAULT_LENDERS_RESPONSE;
  }
}

/**
 * PDF Step 6: Check Status All API
 * 
 * Checks the status of all loan applications/offers for the user
 * Used after login to determine if user has existing offers
 * 
 * Decision Logic:
 * - Case 1: No Offer Generated → hasOffers = false
 * - Case 2: Offers Exist for User → hasOffers = true, offers array populated
 */
export async function checkStatusAll(
  mobile: string,
  authorization?: string
): Promise<CheckStatusResult> {
  if (!mobile) {
    return {
      success: false,
      error: 'Mobile number required',
    };
  }
  try {
    const response = await fetch(wecreditConfig.gatewayUrl, {
      method: 'POST',
      headers: buildHeaders({ mobile, authorization }),
      body: JSON.stringify({
        endpoint: ENDPOINTS.PUBLIC.CHECK_STATUS_ALL,
        partnerCode: wecreditConfig.partnerCode,
      }),
      cache: 'no-store',
    });
    if (!response.ok) {
      console.warn(`[checkStatusAll] API returned ${response.status}`);
      return {
        success: false,
        error: `Server returned ${response.status}`,
      };
    }
    const data = await response.json() as CheckStatusAllResponse;
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('[checkStatusAll] API error:', error);
    return {
      success: false,
      error: 'Unable to check status. Please try again.',
      data: DEFAULT_CHECK_STATUS_RESPONSE,
    };
  }
}

/**
 * PDF Step 7: Clicked Lender Handling
 * 
 * Determines how to handle a clicked lender based on wcStatus
 * 
 * @param offers - List of user's existing offers from checkStatusAll
 * @param lenderId - ID of the lender user clicked
 * @returns Handling result with appropriate action type
 * 
 * Cases:
 * - Lender Found & wcStatus = INITIATED → Continue with existing application
 * - Lender Found & wcStatus != INITIATED → Show existing status/offer
 * - Lender Not Found → Start new application
 */
export function determineLenderHandling(
  offers: LenderOfferStatus[],
  lenderId: string
): LenderHandlingResult {
  // Case: No offers exist at all
  if (!offers || offers.length === 0) {
    return { type: 'no_offers' };
  }
  // Find the clicked lender in the offers list
  const matchingOffer = offers.find(
    (offer) => offer.lenderId === lenderId || offer.lenderName === lenderId
  );
  // Case: Lender not found in offer list → New application
  if (!matchingOffer) {
    return { type: 'not_found', lenderId };
  }
  // Case: Lender found with INITIATED status
  if (matchingOffer.wcStatus === 'INITIATED') {
    return { type: 'initiated', offer: matchingOffer };
  }
  // Case: Lender found with other status (existing application)
  return { type: 'existing', offer: matchingOffer };
}
