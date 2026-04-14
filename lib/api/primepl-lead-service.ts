/**
 * Primepl lead service — status check and submit via forward API.
 * Status: `fetch-prime-pl-lead`. Submit: `prime-pl-leads`.
 */

import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import type { PrimeplLeadEnquiryPayload } from '@/components/primepl-lead/primepl-lead-form.config';
import { wecreditConfig } from '@/lib/config';
import { STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';
import { getEffectivePartnerCode } from '@/lib/utils/effective-partner-code';
import { getErrorMessage, isAbortError } from '@/lib/utils/error-helpers';
import {
  getLoanFormStatus,
  getResponseMessage,
  getResponseStatus,
} from '@/lib/utils/response-helpers';

const PRIMEPL_LEAD_ENDPOINT = `${wecreditConfig.apiUrl}/api/forward`;

/** Forward API `endpoint` for existing-lead status (matches backend contract). */
const PRIMEPL_STATUS_ENDPOINT = 'fetch-prime-pl-lead';
/** Forward API `endpoint` for create lead (matches curl). */
const PRIMEPL_SUBMIT_ENDPOINT = 'prime-pl-leads';

interface PrimeplLeadSubmitRequestBody {
  endpoint: string;
  partnerCode: string;
  fullName: string;
  /** API sample sends phone as string digits. */
  phoneNumber: string;
  locationText: string;
  areaPincode: number;
  loanAmount: number;
  occupation: string;
  netSalaryPm: number;
  sourceChannel: string;
}

interface PrimeplLeadStatusRequestBody {
  endpoint: string;
  partnerCode: string;
}

interface PrimeplLeadStatusResult {
  hasExistingLead: boolean;
  data?: unknown;
  error?: string;
}

function buildDefaultHeaders(): Record<string, string> {
  return {
    ...wecreditConfig.headers,
    Accept: 'application/json',
  };
}

function buildPrimeplLeadHeaders(mobile: string): Record<string, string> {
  const token = getCookie(STORAGE_AUTH_TOKEN);
  const headers: Record<string, string> = {
    ...buildDefaultHeaders(),
    mobile,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchPrimeplLeadStatus(
  mobile: string,
  signal?: AbortSignal
): Promise<PrimeplLeadStatusResult> {
  const phoneDigits = mobile.replace(/\D/g, '');
  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    return { hasExistingLead: false, error: 'Invalid mobile number' };
  }

  const requestBody: PrimeplLeadStatusRequestBody = {
    endpoint: PRIMEPL_STATUS_ENDPOINT,
    partnerCode: getEffectivePartnerCode(),
  };

  const url = new URL(PRIMEPL_LEAD_ENDPOINT);
  url.searchParams.set('phoneNumber', phoneDigits);

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: buildPrimeplLeadHeaders(phoneDigits),
      body: JSON.stringify(requestBody),
      signal,
    });

    let responseData: unknown = undefined;
    try {
      responseData = await response.json();
    } catch {
      // Response body might be empty or non-JSON on some failures.
    }

    const responseMessage = getResponseMessage(responseData);
    const responseStatus = getResponseStatus(responseData);
    const loanFormStatus = getLoanFormStatus(responseData);

    if (loanFormStatus !== undefined) {
      const normalizedStatus =
        typeof loanFormStatus === 'string' ? loanFormStatus.trim().toLowerCase() : loanFormStatus;
      const hasSuccessStatus =
        normalizedStatus === true ||
        normalizedStatus === 1 ||
        normalizedStatus === 'success' ||
        normalizedStatus === 'submitted' ||
        normalizedStatus === 'approved' ||
        normalizedStatus === 'completed';
      return { hasExistingLead: hasSuccessStatus, data: responseData };
    }

    if (
      response.status === 404 ||
      responseStatus === 404 ||
      responseMessage?.toLowerCase().includes('lead not found')
    ) {
      return { hasExistingLead: false, data: responseData };
    }

    if (response.ok) {
      return { hasExistingLead: true, data: responseData };
    }

    const errorMessage =
      responseMessage || `Request failed with status ${response.status}`;
    toast.error(errorMessage, {
      description: 'Unable to check your previous submission.',
    });
    return { hasExistingLead: false, error: errorMessage, data: responseData };
  } catch (error) {
    // Re-throw so callers (e.g. useLoanModalState) can ignore stale cancelled checks;
    // returning "no lead" would race with a newer request and flip UI incorrectly.
    if (isAbortError(error)) {
      throw error;
    }
    const errorMessage = getErrorMessage(error, 'Network error occurred');
    toast.error(errorMessage, {
      description: 'Failed to check your submission. Please try again.',
    });
    return { hasExistingLead: false, error: errorMessage };
  }
}

export async function submitPrimeplLeadEnquiry(
  payload: PrimeplLeadEnquiryPayload
): Promise<boolean> {
  const phoneDigits = payload.phoneNumber.replace(/\D/g, '');
  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    toast.error('Invalid phone number', {
      description: 'Please enter a valid 10-digit phone number.',
    });
    return false;
  }

  const requestBody: PrimeplLeadSubmitRequestBody = {
    endpoint: PRIMEPL_SUBMIT_ENDPOINT,
    partnerCode: getEffectivePartnerCode(),
    fullName: payload.fullName,
    phoneNumber: phoneDigits,
    locationText: payload.locationText,
    areaPincode: payload.areaPincode,
    loanAmount: payload.loanAmount,
    occupation: payload.occupation,
    netSalaryPm: payload.netSalaryPm,
    sourceChannel: payload.sourceChannel,
  };

  try {
    const response = await fetch(PRIMEPL_LEAD_ENDPOINT, {
      method: 'POST',
      headers: buildPrimeplLeadHeaders(phoneDigits),
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      toast.success('Request submitted successfully');
      return true;
    }

    let errorMessage = 'Failed to submit your request';
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch {
      errorMessage = `Request failed with status ${response.status}`;
    }

    toast.error(errorMessage, {
      description: 'Unable to submit your request. Please try again.',
    });
    return false;
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Network error occurred');
    toast.error(errorMessage, {
      description: 'Failed to submit your request. Please check your connection.',
    });
    return false;
  }
}
