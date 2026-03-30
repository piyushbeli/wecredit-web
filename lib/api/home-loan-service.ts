/**
 * Home Loan Service
 * API service for home loan form submissions (forward API, same pattern as business loan).
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
import type { HomeLoanEnquiryPayload } from '@/components/home-loan/home-loan-form.config';

const HOME_LOAN_ENDPOINT = `${wecreditConfig.apiUrl}/api/forward`;

interface HomeLoanSubmitRequestBody {
  endpoint: string;
  partnerCode: string;
  fullName: string;
  mobileNumber: number;
  permanentPincode: number;
  propertyPincode: number;
  incomeSource: string;
  loanAmount: number;
  panNumber: string;
  dob: string;
}

interface HomeLoanStatusRequestBody {
  endpoint: string;
  partnerCode: string;
}

interface HomeLoanStatusResult {
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

function buildHomeLoanHeaders(mobile: string): Record<string, string> {
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

export async function fetchHomeLoanStatus(
  mobile: string,
  signal?: AbortSignal
): Promise<HomeLoanStatusResult> {
  const phoneDigits = mobile.replace(/\D/g, '');
  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    // Validation guard to avoid unnecessary backend calls for invalid inputs.
    return { hasExistingLead: false, error: 'Invalid mobile number' };
  }

  const requestBody: HomeLoanStatusRequestBody = {
    endpoint: 'fetch-hl-lead',
    partnerCode: getEffectivePartnerCode(),
  };

  const url = new URL(HOME_LOAN_ENDPOINT);
  // Home loan status API expects mobileNumber in query params.
  url.searchParams.set('mobileNumber', phoneDigits);

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: buildHomeLoanHeaders(phoneDigits),
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

export async function submitHomeLoanEnquiry(
  payload: HomeLoanEnquiryPayload
): Promise<boolean> {
  const phoneDigits = payload.mobile.replace(/\D/g, '');
  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    toast.error('Invalid phone number', {
      description: 'Please enter a valid 10-digit phone number.',
    });
    return false;
  }

  const requestBody: HomeLoanSubmitRequestBody = {
    endpoint: 'hl-leads',
    partnerCode: getEffectivePartnerCode(),
    fullName: payload.name,
    mobileNumber: Number(phoneDigits),
    permanentPincode: Number(payload.permanentPincode),
    propertyPincode: Number(payload.propertyPincode),
    incomeSource: payload.incomeSource,
    loanAmount: payload.loanAmount,
    panNumber: payload.panNumber,
    dob: payload.dob,
  };

  try {
    const response = await fetch(HOME_LOAN_ENDPOINT, {
      method: 'POST',
      headers: buildHomeLoanHeaders(phoneDigits),
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      toast.success('Home loan enquiry submitted successfully')
      return true;
    }

    let errorMessage = 'Failed to submit home loan enquiry';
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
