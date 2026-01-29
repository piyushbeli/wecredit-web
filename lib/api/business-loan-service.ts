/**
 * Business Loan Service
 * API service for business loan form submissions
 */

import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { wecreditConfig } from '@/lib/config';
import { PARTNER_CODE, STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';

/** Business Loan API endpoint - uses /api/forward for loan operations */
const BUSINESS_LOAN_ENDPOINT = `${wecreditConfig.apiUrl}/api/forward`;

// ============================================
// Type Definitions
// ============================================

export type CompanyType = 'Proprietor' | 'LLP' | 'OPC' | 'PARTNERSHIP' | 'PVT LTD';
export type Gender = 'Male' | 'Female' | 'Other';

export interface BusinessLoanEnquiryPayload {
  name: string;
  mobile: string;
  email: string;
  annualTurnover: number;
  companyType: CompanyType;
  gender: Gender;
  pincode: string;
  requiredLoanAmount: number;
  hasGst: boolean;
  businessNature: string;
  consent: boolean;
}

interface BusinessLoanSubmitRequestBody {
  name: string;
  email: string;
  phoneNumber: number;
  annualTurnover: number;
  companyType: CompanyType;
  gender: Gender;
  pincode: string;
  requiredLoanAmount: number;
  hasGst: boolean;
  businessNature: string;
  endpoint: string;
  partnerCode: string;
}

interface BusinessLoanStatusRequestBody {
  endpoint: string;
  partnerCode: string;
}

interface BusinessLoanStatusResult {
  hasExistingLead: boolean;
  data?: unknown;
  error?: string;
}

// ============================================
// Header Builders
// ============================================

function buildDefaultHeaders(): Record<string, string> {
  return {
    ...wecreditConfig.headers,
    Accept: 'application/json',
  };
}

function buildBusinessLoanHeaders(mobile: string): Record<string, string> {
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

// ============================================
// API Functions
// ============================================

export async function fetchBusinessLoanStatus(
  mobile: string,
  signal?: AbortSignal
): Promise<BusinessLoanStatusResult> {
  const phoneDigits = mobile.replace(/\D/g, '');
  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    // Validation guard to avoid unnecessary backend calls for invalid inputs.
    return { hasExistingLead: false, error: 'Invalid mobile number' };
  }

  const requestBody: BusinessLoanStatusRequestBody = {
    endpoint: 'fetch-bl-leads',
    partnerCode: PARTNER_CODE,
  };

  const url = new URL(BUSINESS_LOAN_ENDPOINT);
  // API expects phoneNumber in query params and mobile in headers.
  url.searchParams.set('phoneNumber', phoneDigits);

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: buildBusinessLoanHeaders(phoneDigits),
      body: JSON.stringify(requestBody),
      signal,
    });

    let responseData: unknown = undefined;
    try {
      responseData = await response.json();
    } catch {
      // Response body might be empty or non-JSON on some failures.
    }

    const responseMessage =
      typeof responseData === 'object' && responseData
        ? (responseData as { message?: string; error?: string }).message ||
          (responseData as { message?: string; error?: string }).error
        : undefined;
    const responseStatus =
      typeof responseData === 'object' && responseData
        ? (responseData as { status?: number }).status
        : undefined;

    // "BL Lead Not Found" is the expected response when the user has not submitted.
    if (
      response.status === 404 ||
      responseStatus === 404 ||
      responseMessage === 'BL Lead Not Found'
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
    if (error instanceof Error && error.name === 'AbortError') {
      // Silent abort to avoid confusing users during route changes.
      return { hasExistingLead: false };
    }
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    toast.error(errorMessage, {
      description: 'Failed to check your submission. Please try again.',
    });
    return { hasExistingLead: false, error: errorMessage };
  }
}

export async function submitBusinessLoanEnquiry(
  payload: BusinessLoanEnquiryPayload
): Promise<boolean> {
  const phoneDigits = payload.mobile.replace(/\D/g, '');
  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    toast.error('Invalid mobile number', {
      description: 'Please enter a valid 10-digit mobile number.',
    });
    return false;
  }

  const requestBody: BusinessLoanSubmitRequestBody = {
    endpoint: 'bl-leads',
    partnerCode: PARTNER_CODE,
    name: payload.name,
    email: payload.email,
    phoneNumber: Number(phoneDigits),
    annualTurnover: payload.annualTurnover,
    companyType: payload.companyType,
    gender: payload.gender,
    pincode: payload.pincode,
    requiredLoanAmount: payload.requiredLoanAmount,
    hasGst: payload.hasGst,
    businessNature: payload.businessNature,
  };

  console.log('requestBody', requestBody);
  debugger;
  try {
    const response = await fetch(BUSINESS_LOAN_ENDPOINT, {
      method: 'POST',
      headers: buildBusinessLoanHeaders(phoneDigits),
      body: JSON.stringify(requestBody),
    });

    if (response.ok && response.status === 200) {
      return true;
    }

    let errorMessage = 'Failed to submit business loan enquiry';
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
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    toast.error(errorMessage, {
      description: 'Failed to submit your request. Please check your connection.',
    });
    return false;
  }
}
