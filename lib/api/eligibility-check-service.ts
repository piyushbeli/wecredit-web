/**
 * Eligibility Check Service
 * API service for credit eligibility / bureau report form (wechat API).
 */

import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { wecreditConfig } from '@/lib/config';
import { SOURCE_WEBSITE, STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';
import type { EligibilityCheckPayload } from '@/components/eligibility-check/eligibility-check-form.config';

const ELIGIBILITY_CHECK_ENDPOINT = `${wecreditConfig.apiUrl}/api/wechat`;
const ELIGIBILITY_CHECK_ENDPOINT_PROD = `https://wecredit.co.in/api/wechat`;

export interface CheckEligibilityStatusResult {
  showSuccess: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Check eligibility / bureau status (get-bureau-url).
 * Used on page load to decide whether to show success screen or form.
 * No toast on failure so we can fall back to the form silently.
 */
export async function checkEligibilityStatus(
  phoneNumber: string,
  signal?: AbortSignal
): Promise<CheckEligibilityStatusResult> {
  const phoneDigits = phoneNumber.replace(/\D/g, '');

  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    return { showSuccess: false, error: 'Invalid mobile number' };
  }

  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase();

  const requestBody = {
    source: SOURCE_WEBSITE,
    agentId: '',
    phoneNumber:  phoneDigits,
    endpoint: 'get-bureau-url',
  };

  const eligibilityCheckEndpoint = environment === "staging" ? ELIGIBILITY_CHECK_ENDPOINT : ELIGIBILITY_CHECK_ENDPOINT_PROD;

  try {
    const response = await fetch(eligibilityCheckEndpoint, {
      method: 'POST',
      headers: buildEligibilityCheckHeaders(phoneDigits, true),
      body: JSON.stringify(requestBody),
      signal,
    });

    let responseData: unknown;
    try {
      responseData = await response.json();
    } catch {
      responseData = undefined;
    }

    if (response.ok) {
      return { showSuccess: true, data: responseData };
    }

    const responseMessage =
      typeof responseData === 'object' && responseData
        ? (responseData as { message?: string }).message ??
          (responseData as { error?: string }).error ??
          (responseData as { statusMessage?: string }).statusMessage
        : undefined;
    return {
      showSuccess: false,
      data: responseData,
      error: responseMessage ?? `Request failed with status ${response.status}`,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { showSuccess: false };
    }
    const errorMessage =
      error instanceof Error ? error.message : 'Network error occurred';
    return { showSuccess: false, error: errorMessage };
  }
}

function buildDefaultHeaders(): Record<string, string> {
  return {
    ...wecreditConfig.headers,
    Accept: '*/*',
  };
}

/**
 * Build headers for eligibility check API requests
 * @param phoneNumber - User's phone number
 * @param excludeAgentHost - If true, removes X-Agent-Host header (for get-bureau-url endpoint)
 */
function buildEligibilityCheckHeaders(
  phoneNumber: string,
  excludeAgentHost?: boolean
): Record<string, string> {
  const token = getCookie(STORAGE_AUTH_TOKEN);
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase();

  const headers: Record<string, string> = {
    ...buildDefaultHeaders(),
    mobile:  phoneNumber.replace(/\D/g, ''),
  };

  headers['X-Agent-Host'] = 'agent-backend';
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Submit eligibility check (bureau report) to wechat API.
 * Returns true on success, false on failure (errors surfaced via toast).
 */
export async function submitEligibilityCheck(
  payload: EligibilityCheckPayload
): Promise<boolean> {
  const phoneDigits = payload.phoneNumber.replace(/\D/g, '');
  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    toast.error('Invalid phone number', {
      description: 'Please enter a valid 10-digit phone number.',
    });
    return false;
  }

  const requestBody = {
    source: SOURCE_WEBSITE,
    agentId: '',
    processName: '',
    firstName: payload.firstName.trim(),
    middleName: payload.middleName?.trim() ?? '',
    lastName: payload.lastName.trim(),
    phoneNumber: phoneDigits,
    dob: payload.dob,
    gender: payload.gender,
    pincode: payload.pincode.trim(),
    pan: payload.pan.trim().toUpperCase(),
    endpoint: 'fetch-bureau',
    email: payload.email?.trim() ?? '',
  };

  try {
    const response = await fetch(ELIGIBILITY_CHECK_ENDPOINT, {
      method: 'POST',
      headers: buildEligibilityCheckHeaders(phoneDigits),
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return true;
    }

    let errorMessage = 'Failed to submit eligibility check';
    try {
      const errorData = await response.json();
      const msg =
        (errorData as { message?: string }).message ??
        (errorData as { error?: string }).error ??
        (errorData as { statusMessage?: string }).statusMessage;
      if (msg) errorMessage = String(msg);
    } catch {
      errorMessage = `Request failed with status ${response.status}`;
    }

    toast.error(errorMessage, {
      description: 'Unable to submit your request. Please try again.',
    });
    return false;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Network error occurred';
    toast.error(errorMessage, {
      description: 'Failed to submit your request. Please check your connection.',
    });
    return false;
  }
}
