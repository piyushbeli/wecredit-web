/**
 * Home Loan Service
 * API service for home loan form submissions (forward API, same pattern as business loan).
 */

import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { wecreditConfig } from '@/lib/config';
import { PARTNER_CODE, STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';
import type { HomeLoanEnquiryPayload } from '@/components/home-loan/home-loan-form.config';

const HOME_LOAN_ENDPOINT = `${wecreditConfig.apiUrl}/api/forward`;

interface HomeLoanSubmitRequestBody {
  endpoint: string;
  partnerCode: string;
  name: string;
  phoneNumber: number;
  permanentPincode: string;
  propertyPincode: string;
  employmentType: string;
  loanAmount: number;
  consent: boolean;
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
    partnerCode: PARTNER_CODE,
    name: payload.name,
    phoneNumber: Number(phoneDigits),
    permanentPincode: payload.permanentPincode,
    propertyPincode: payload.propertyPincode,
    employmentType: payload.employmentType,
    loanAmount: payload.loanAmount,
    consent: payload.consent,
  };

  try {
    const response = await fetch(HOME_LOAN_ENDPOINT, {
      method: 'POST',
      headers: buildHomeLoanHeaders(phoneDigits),
      body: JSON.stringify(requestBody),
    });

    if (response.ok && response.status === 200) {
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
    const errorMessage =
      error instanceof Error ? error.message : 'Network error occurred';
    toast.error(errorMessage, {
      description: 'Failed to submit your request. Please check your connection.',
    });
    return false;
  }
}
