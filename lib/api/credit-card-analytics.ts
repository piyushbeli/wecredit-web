/**
 * Credit Card Analytics Service
 * Tracks "Apply Now" clicks on credit cards via the clicks_counter API.
 * Fire-and-forget: errors are logged but never shown to the user.
 */

import { wecreditConfig } from '@/lib/config';
import { ENDPOINTS } from '@/lib/constants/api-keys';
import { getAttributionHeaders, getAttributionHeadersCommon, getAttributionUtmUrl } from './attribution-headers';

/** Auth API endpoint - same as auth-service (clicks_counter is an auth endpoint) */
const AUTH_ENDPOINT = `${wecreditConfig.apiUrl}/api/auth`;

// ============================================
// Types
// ============================================

/** Request payload for clicks_counter endpoint */
export interface ClicksCounterRequest {
  mobile: string;
  ip: string;
  clicked_element: string;
  endpoint: 'clicks_counter';
}

/** API response (optional; we don't block on it) */
export interface ClicksCounterResponse {
  success?: boolean;
  message?: string;
  code?: number;
}

/** Result of the tracking call (for logging only) */
export interface CreditCardAnalyticsResult {
  success: boolean;
  error?: string;
}

// ============================================
// Helpers
// ============================================

/**
 * Builds headers for clicks_counter request.
 * Matches auth-service: Content-Type, Accept, utm_url, plus env-specific headers.
 */
function buildClicksCounterHeaders(): Record<string, string> {
  return {
    ...wecreditConfig.headers,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...getAttributionHeadersCommon(),
  };
}

// ============================================
// API
// ============================================

/**
 * Sends a credit card click event to the clicks_counter API.
 * Intended for logged-in users only (caller must check auth).
 * Fails silently: logs errors to console, never throws or notifies user.
 *
 * @param mobile - User's mobile number (from cookies)
 * @param ip - User's IP address (e.g. from fetchUserIp)
 * @param clickedElement - Name of the credit card clicked (e.g. "SBI SimplyCLICK")
 * @returns Result for logging; does not throw
 */
export async function trackCreditCardClick(
  mobile: string,
  ip: string,
  clickedElement: string
): Promise<CreditCardAnalyticsResult> {
  const payload: ClicksCounterRequest = {
    mobile,
    ip,
    clicked_element: clickedElement,
    endpoint: ENDPOINTS.PUBLIC.CLICKS_COUNTER,
  };

  try {
    const response = await fetch(AUTH_ENDPOINT, {
      method: 'POST',
      headers: buildClicksCounterHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorMsg = `clicks_counter failed: ${response.status}`;
      if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging') {
        // eslint-disable-next-line no-console
        console.warn('[CreditCardAnalytics]', errorMsg);
      }
      return { success: false, error: errorMsg };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging') {
      // eslint-disable-next-line no-console
      console.warn('[CreditCardAnalytics]', errorMessage);
    }
    return { success: false, error: errorMessage };
  }
}

export const creditCardAnalytics = {
  trackCreditCardClick,
};
