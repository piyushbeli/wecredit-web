/**
 * Gold Loan Service
 * API service for gold loan form submissions (forward API, same pattern as home loan).
 */

import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { wecreditConfig } from '@/lib/config';
import { PARTNER_CODE, STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';
import type { GoldLoanEnquiryPayload } from '@/components/gold-loan/gold-loan-form.config';

const GOLD_LOAN_ENDPOINT = `${wecreditConfig.apiUrl}/api/forward`;

interface GoldLoanSubmitRequestBody {
  endpoint: string;
  partnerCode: string;
  name: string;
  phoneNumber: number;
  dob: string;
  pan: string;
  state: string;
  city: string;
  loanAmount: number;
  consent: boolean;
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
    partnerCode: PARTNER_CODE,
    name: payload.name,
    phoneNumber: Number(phoneDigits),
    dob: payload.dob,
    pan: payload.pan,
    state: payload.state,
    city: payload.city,
    loanAmount: payload.loanAmount,
    consent: payload.consent,
  };

  try {
    const response = await fetch(GOLD_LOAN_ENDPOINT, {
      method: 'POST',
      headers: buildGoldLoanHeaders(phoneDigits),
      body: JSON.stringify(requestBody),
    });

    if (response.ok && response.status === 200) {
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
    const errorMessage =
      error instanceof Error ? error.message : 'Network error occurred';
    toast.error(errorMessage, {
      description: 'Failed to submit your request. Please check your connection.',
    });
    return false;
  }
}
