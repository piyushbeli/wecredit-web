/**
 * Federal Bank redirect service — polls `/api/forward` until utmLink is ready.
 */

import {
  ENDPOINTS,
  FEDERALBANK_REDIRECT_MAX_POLL_MS,
  FEDERALBANK_REDIRECT_MIN_POLL_MS,
  FEDERALBANK_REDIRECT_POLL_INTERVAL_MS,
} from '@/lib/constants/api-keys';
import { buildHeaders } from '@/lib/api/wecredit';
import { buildUpswingForwardRequestUrl } from '@/lib/api/upswing-navigation-event';
import { getEffectivePartnerCode } from '@/lib/utils/effective-partner-code';
import type { FederationBankRedirectResponse } from '@/types/wecredit';

export interface FederationBankRedirectResult {
  success: boolean;
  error?: string;
}

type FederationBankPollAttemptResult =
  | { type: 'success'; utmLink: string }
  | { type: 'pending' }
  | { type: 'error'; error: string };

function parseStatusCode(statusCode: FederationBankRedirectResponse['statusCode']): number | undefined {
  if (typeof statusCode === 'number') {
    return statusCode;
  }
  if (typeof statusCode === 'string') {
    const parsed = Number.parseInt(statusCode, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

function parseFederationBankRedirectResponse(
  json: FederationBankRedirectResponse,
): FederationBankPollAttemptResult {
  const statusCodeNum = parseStatusCode(json.statusCode);

  if (statusCodeNum === 200 && json.utmLink) {
    return { type: 'success', utmLink: json.utmLink };
  }

  if (statusCodeNum === 2006) {
    return {
      type: 'error',
      error: json.statusMessage ?? 'Unable to start Federal Bank journey.',
    };
  }

  return { type: 'pending' };
}

function waitForPollInterval(ms: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  return new Promise((resolve, reject) => {
    const timeoutId = globalThis.setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = (): void => {
      globalThis.clearTimeout(timeoutId);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

async function fetchFederationBankRedirectAttempt(
  mobile: string,
  authorization: string | undefined,
  signal?: AbortSignal,
): Promise<FederationBankPollAttemptResult> {
  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: buildHeaders({ mobile, authorization }),
    body: JSON.stringify({
      endpoint: ENDPOINTS.FORWARD.FEDERALBANK_REDIRECT,
      partnerCode: getEffectivePartnerCode(),
    }),
    cache: 'no-store',
  };
  if (signal instanceof AbortSignal) {
    fetchOptions.signal = signal;
  }

  const response = await fetch(buildUpswingForwardRequestUrl(mobile), fetchOptions);
  const text = await response.text();

  try {
    const json = JSON.parse(text) as FederationBankRedirectResponse;
    return parseFederationBankRedirectResponse(json);
  } catch {
    return {
      type: 'error',
      error: 'Unexpected response from Federal Bank redirect.',
    };
  }
}

/**
 * Polls Federal Bank redirect until `statusCode: 200` with `utmLink`, for at least 30 seconds.
 */
export async function pollFederationBankRedirect(
  mobile: string,
  authorization?: string,
  signal?: AbortSignal,
): Promise<FederationBankRedirectResult> {
  if (!mobile) {
    return {
      success: false,
      error: 'Mobile number required',
    };
  }

  const startedAt = Date.now();

  while (true) {
    if (signal?.aborted) {
      return {
        success: false,
        error: 'Request cancelled',
      };
    }

    let attempt: FederationBankPollAttemptResult;
    try {
      attempt = await fetchFederationBankRedirectAttempt(mobile, authorization, signal);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request cancelled',
        };
      }
      attempt = { type: 'pending' };
    }

    if (attempt.type === 'success') {
      window.location.replace(attempt.utmLink);
      return { success: true };
    }

    if (attempt.type === 'error') {
      return {
        success: false,
        error: attempt.error,
      };
    }

    const elapsedMs = Date.now() - startedAt;
    const hasReachedMinPollDuration = elapsedMs >= FEDERALBANK_REDIRECT_MIN_POLL_MS;
    if (hasReachedMinPollDuration && elapsedMs >= FEDERALBANK_REDIRECT_MAX_POLL_MS) {
      return {
        success: false,
        error: 'Federal Bank redirect is taking longer than expected. Please try again.',
      };
    }

    const remainingMs = FEDERALBANK_REDIRECT_MAX_POLL_MS - elapsedMs;
    const intervalMs = Math.min(FEDERALBANK_REDIRECT_POLL_INTERVAL_MS, remainingMs);
    if (intervalMs <= 0) {
      continue;
    }

    try {
      await waitForPollInterval(intervalMs, signal);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request cancelled',
        };
      }
      throw error;
    }
  }
}
