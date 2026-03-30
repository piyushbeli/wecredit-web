/**
 * Gold Loan Service
 * API service for gold loan form submissions (forward API, same pattern as home loan).
 */

import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { wecreditConfig } from '@/lib/config';
import { STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';
import { getEffectivePartnerCode } from '@/lib/utils/effective-partner-code';
import { getErrorMessage, isAbortError } from '@/lib/utils/error-helpers';
import {
  getLoanFormStatus,
  getResponseMessage,
  getResponseStatus,
} from '@/lib/utils/response-helpers';
import type { GoldLoanEnquiryPayload } from '@/components/gold-loan/gold-loan-form.config';

const GOLD_LOAN_ENDPOINT = `${wecreditConfig.apiUrl}/api/forward`;

interface GoldLoanSubmitRequestBody {
  endpoint: string;
  partnerCode: string;
  fullName: string;
  phoneNumber: number;
  dob: string;
  pan: string;
  state: string;
  city: string;
  loanAmount: number;
  // consent: boolean;
}

interface GoldLoanStatusRequestBody {
  endpoint: string;
  partnerCode: string;
}

interface GoldLoanStatusResult {
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

function buildGoldLoanHeaders(mobile: string): Record<string, string> {
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

export async function fetchGoldLoanStatus(
  mobile: string,
  signal?: AbortSignal
): Promise<GoldLoanStatusResult> {
  const phoneDigits = mobile.replace(/\D/g, '');
  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    // Validation guard to avoid unnecessary backend calls for invalid inputs.
    return { hasExistingLead: false, error: 'Invalid mobile number' };
  }

  const requestBody: GoldLoanStatusRequestBody = {
    endpoint: 'fetch-gl-lead',
    partnerCode: getEffectivePartnerCode(),
  };

  const url = new URL(GOLD_LOAN_ENDPOINT);
  // API expects phoneNumber in query params and mobile in headers.
  url.searchParams.set('phoneNumber', phoneDigits);

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: buildGoldLoanHeaders(phoneDigits),
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
      // Some status APIs return a dedicated loan_form_status field instead of HTTP 404/200.
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

    // "Lead Not Found" is the expected response when the user has not submitted.
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
    if (isAbortError(error)) {
      return { hasExistingLead: false };
    }
    const errorMessage = getErrorMessage(error, 'Network error occurred');
    toast.error(errorMessage, {
      description: 'Failed to check your submission. Please try again.',
    });
    return { hasExistingLead: false, error: errorMessage };
  }
}

export async function submitGoldLoanEnquiry(
  payload: GoldLoanEnquiryPayload
): Promise<boolean> {
  const phoneDigits = payload.mobile.replace(/\D/g, '');
  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    toast.error('Invalid phone number', {
      description: 'Please enter a valid 10-digit phone number.',
    });
    return false;
  }

  const requestBody: GoldLoanSubmitRequestBody = {
    endpoint: 'gl-leads',
    partnerCode: getEffectivePartnerCode(),
    fullName: payload.name,
    phoneNumber: Number(phoneDigits),
    dob: payload.dob,
    pan: payload.pan,
    state: payload.state,
    city: payload.city,
    loanAmount: payload.loanAmount,
    // consent: payload.consent,
  };

  try {
    const response = await fetch(GOLD_LOAN_ENDPOINT, {
      method: 'POST',
      headers: buildGoldLoanHeaders(phoneDigits),
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      toast.success('Gold loan enquiry submitted successfully')
      return true;
    }

    let errorMessage = 'Failed to submit gold loan enquiry';
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
