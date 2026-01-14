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
import { withApiLogging } from '@/lib/utils/api-logger';
import { toast } from 'sonner';
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
  statusCode: '3012',
  lenders: [],
  isRehitLenders: 1,
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
  const requestBody = {
    endpoint: ENDPOINTS.PUBLIC.ACTIVE_LENDERS,
    partnerCode: wecreditConfig.partnerCode,
  };
  try {
    const data = await withApiLogging<ActiveLendersResponse>(
      'fetchActiveLenders',
      () => fetch(wecreditConfig.gatewayUrl, {
        method: 'POST',
        headers: buildHeaders(options),
        body: JSON.stringify(requestBody),
        cache: 'no-store',
      }),
      {
        method: 'POST',
        url: wecreditConfig.gatewayUrl,
        headers: buildHeaders(options),
        body: requestBody,
        mobile: options.mobile,
        hasAuthorization: Boolean(options.authorization),
      }
    );
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unable to fetch lenders. Please try again later.';
    toast.error(errorMessage);
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
    return DEFAULT_LENDERS_RESPONSE;
  }
  const requestBody = {
    endpoint: ENDPOINTS.PUBLIC.ACTIVE_LENDERS,
    partnerCode: wecreditConfig.partnerCode,
  };
  try {
    const data = await withApiLogging<ActiveLendersResponse>(
      'fetchActiveLendersForUser',
      () => fetch(wecreditConfig.gatewayUrl, {
        method: 'POST',
        headers: buildHeaders({ mobile, authorization }),
        body: JSON.stringify(requestBody),
        cache: 'no-store',
      }),
      {
        method: 'POST',
        url: wecreditConfig.gatewayUrl,
        headers: buildHeaders({ mobile, authorization }),
        body: requestBody,
        mobile,
        hasAuthorization: Boolean(authorization),
      }
    );
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to load personalized lenders';
    toast.error(errorMessage, {
      description: 'Unable to fetch your personalized offers. Please try again later.',
    });
    return DEFAULT_LENDERS_RESPONSE;
  }
}

/**
 * PDF Step 6: Check Status All API
 * 
 * Checks the status of all loan applications/offers for the user
 * Used after login to determine if user has existing offers
 * 
 * Response Status Codes:
 * - 3003: Offers found successfully
 * - 3004: No offers, but can try more lenders
 * - 3005: API error occurred
 * - 3006: All lenders rejected
 * - 3012: General error
 * - 3018: Other specific error condition
 */

/** Lead API endpoint - uses /api/forward for lead operations */
const CHECK_STATUS_ALL_ENDPOINT = `${wecreditConfig.apiUrl}/api/forward`;

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
  const requestBody = {
    mobile: Number(mobile),
    endpoint: ENDPOINTS.PUBLIC.CHECK_STATUS_ALL,
    partnerCode: wecreditConfig.partnerCode,
  };
  try {
    const data = await withApiLogging<CheckStatusAllResponse>(
      'checkStatusAll',
      () => fetch(CHECK_STATUS_ALL_ENDPOINT, {
        method: 'POST',
        headers: buildHeaders({ mobile, authorization }),
        body: JSON.stringify(requestBody),
        cache: 'no-store',
      }),
      {
        method: 'POST',
        url: CHECK_STATUS_ALL_ENDPOINT,
        headers: buildHeaders({ mobile, authorization }),
        body: requestBody,
        mobile,
        hasAuthorization: Boolean(authorization),
      }
    );
    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'Unable to check status. Please try again.';
    toast.error(errorMessage, {
      description: 'Failed to check your loan application status.',
    });
    return {
      success: false,
      error: errorMessage,
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
 * @param lenderName - Name of the lender user clicked
 * @returns Handling result with appropriate action type
 * 
 * Cases:
 * - Lender Found & wcStatus = INITIATED → Continue with existing application
 * - Lender Found & wcStatus != INITIATED → Show existing status/offer
 * - Lender Not Found → Start new application
 */
export function determineLenderHandling(
  offers: LenderOfferStatus[],
  lenderName: string
): LenderHandlingResult {
  // Case: No offers exist at all
  if (!offers || offers.length === 0) {
    return { type: 'no_offers' };
  }
  // Find the clicked lender in the offers list
  const matchingOffer = offers.find(
    (offer) => offer.lenderName === lenderName
  );
  // Case: Lender not found in offer list → New application
  if (!matchingOffer) {
    return { type: 'not_found', lenderName };
  }
  // Case: Lender found with INITIATED status
  if (matchingOffer.wcStatus === 'INITIATED') {
    return { type: 'initiated', offer: matchingOffer };
  }
  // Case: Lender found with other status (existing application)
  return { type: 'existing', offer: matchingOffer };
}

/**
 * Re-hit All Lenders API
 * 
 * Triggers a re-check across all available lenders to find more offers
 * Used when user wants to check for additional lenders beyond initial offers
 * 
 * @param mobile - User's mobile number
 * @param authorization - Optional auth token
 * @returns Result with updated offers list
 */

/** Lead API endpoint - uses /api/forward for lead operations */
const HIT_ALL_LENDERS_ENDPOINT = `${wecreditConfig.apiUrl}/api/forward`;


export async function hitAllLenders(
  mobile: string,
  authorization?: string
): Promise<CheckStatusResult> {
  if (!mobile) {
    return {
      success: false,
      error: 'Mobile number required',
    };
  }
  const requestBody = {
    mobile: Number(mobile),
    endpoint: ENDPOINTS.PUBLIC.HIT_ALL_LENDERS,
    partnerCode: wecreditConfig.partnerCode,
  };
  try {
    const data = await withApiLogging<CheckStatusAllResponse>(
      'hitAllLenders',
      () => fetch(HIT_ALL_LENDERS_ENDPOINT, {
        method: 'POST',
        headers: buildHeaders({ mobile, authorization }),
        body: JSON.stringify(requestBody),
        cache: 'no-store',
      }),
      {
        method: 'POST',
        url: HIT_ALL_LENDERS_ENDPOINT,
        headers: buildHeaders({ mobile, authorization }),
        body: requestBody,
        mobile,
        hasAuthorization: Boolean(authorization),
      }
    );
    
    // Show success toast
    toast.success('Checked for new offers', {
      description: `Found ${data.lenders.length} lender${data.lenders.length !== 1 ? 's' : ''}`,
    });
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'Unable to check for new offers. Please try again.';
    toast.error(errorMessage, {
      description: 'Failed to refresh your loan offers.',
    });
    return {
      success: false,
      error: errorMessage,
      data: DEFAULT_CHECK_STATUS_RESPONSE,
    };
  }
}
