/**
 * Eligibility Check Service
 * API service for credit eligibility / bureau report form (wechat API).
 */

import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import bureauReportMockData from '@/mocks/bureau-report-api-response.json';
import { bureauReportConfig, wecreditConfig } from '@/lib/config';
import { SOURCE_WEBSITE, STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';
import type {
  EligibilityCheckFormValues,
  EligibilityCheckPayload,
} from '@/components/eligibility-check/eligibility-check-form.config';
import {
  extractBureauPdfUrl,
  storeBureauResponse,
} from '@/lib/utils/bureau-pdf';
import { isUsableBureauReportResponse } from '@/lib/utils/credit-report-adapter';
import { dobToNativeFormat } from '@/lib/utils/form-helpers';
import type { BureauReportApiResponse } from '@/types/credit-report';

const ELIGIBILITY_CHECK_ENDPOINT = `${wecreditConfig.apiUrl}/api/wechat`;
const ELIGIBILITY_CHECK_ENDPOINT_PROD = `https://wecredit.co.in/api/wechat`;
const BUREAU_REPORT_MOCK = bureauReportMockData satisfies BureauReportApiResponse;
let queuedEligibilityPayload: EligibilityCheckPayload | null = null;
let queuedEligibilityRequest: Promise<SubmitEligibilityCheckResult> | null = null;

export function queueEligibilityCheck(payload: EligibilityCheckPayload): void {
  queuedEligibilityPayload = payload;
  queuedEligibilityRequest = null;
}

export function hasQueuedEligibilityCheck(): boolean {
  return queuedEligibilityPayload !== null;
}

export function runQueuedEligibilityCheck(): Promise<SubmitEligibilityCheckResult> | null {
  if (!queuedEligibilityPayload) {
    return null;
  }
  if (!queuedEligibilityRequest) {
    queuedEligibilityRequest = submitEligibilityCheck(queuedEligibilityPayload).then((result) => {
      if (!result.success) {
        queuedEligibilityRequest = null;
      }
      return result;
    });
  }
  return queuedEligibilityRequest;
}

export function clearQueuedEligibilityCheck(): void {
  queuedEligibilityPayload = null;
  queuedEligibilityRequest = null;
}

/**
 * Extract error message from API response
 */
function extractErrorMessage(data: unknown): string | undefined {
  if (typeof data !== 'object' || !data) return undefined;
  const obj = data as { message?: string; error?: string; statusMessage?: string };
  return obj.message ?? obj.error ?? obj.statusMessage;
}

export interface CheckEligibilityStatusResult {
  showSuccess: boolean;
  data?: unknown;
  error?: string;
}

export function getSavedEligibilityValues(data: unknown): EligibilityCheckFormValues | null {
  if (!data || typeof data !== 'object') return null;

  const response = data as Record<string, unknown>;
  if (!response.details || typeof response.details !== 'object') return null;
  const savedData = response.details as Record<string, unknown>;
  const readValue = (key: string): string => {
    const value = savedData[key];
    return typeof value === 'string' ? value : '';
  };
  const genderValue = readValue('gender').toLowerCase();
  const gender =
    genderValue === 'male' || genderValue === 'female' || genderValue === 'other'
      ? `${genderValue.charAt(0).toUpperCase()}${genderValue.slice(1)}`
      : '';
  const values = {
    firstName: readValue('firstName'),
    middleName: readValue('middleName'),
    lastName: readValue('lastName'),
    phoneNumber: readValue('phoneNumber'),
    email: readValue('email'),
    dob: dobToNativeFormat(readValue('dob')),
    gender,
    pincode: readValue('pincode'),
    pan: readValue('pan').toUpperCase(),
  } satisfies EligibilityCheckFormValues;

  return Object.values(values).some((value) => value.trim()) ? values : null;
}

interface BureauUrlApiResult {
  response: Response;
  data: unknown;
}

async function requestBureauUrl(
  phoneDigits: string,
  signal?: AbortSignal
): Promise<BureauUrlApiResult> {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase();
  const eligibilityCheckEndpoint =
    environment === 'staging'
      ? ELIGIBILITY_CHECK_ENDPOINT
      : ELIGIBILITY_CHECK_ENDPOINT_PROD;

  const response = await fetch(eligibilityCheckEndpoint, {
    method: 'POST',
    headers: buildEligibilityCheckHeaders(phoneDigits),
    body: JSON.stringify({
      source: SOURCE_WEBSITE,
      agentId: '',
      phoneNumber: phoneDigits,
      endpoint: 'get-bureau-url',
    }),
    signal,
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = undefined;
  }

  return { response, data };
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

  if (bureauReportConfig.useMockData) {
    return { showSuccess: false };
  }

  try {
    const { response, data: responseData } = await requestBureauUrl(
      phoneDigits,
      signal
    );

    if (response.ok && isUsableBureauReportResponse(responseData)) {
      storeBureauResponse(responseData);
      return { showSuccess: true, data: responseData };
    }

    const responseMessage = extractErrorMessage(responseData);
    return {
      showSuccess: false,
      data: responseData,
      error: responseMessage ?? 'Credit report data is not available yet',
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

/**
 * Fetches a fresh presigned bureau PDF URL without modifying it.
 */
export async function fetchFreshBureauPdfUrl(
  phoneNumber: string
): Promise<string | undefined> {
  const phoneDigits = phoneNumber.replace(/\D/g, '');
  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    return undefined;
  }

  const { response, data: responseData } = await requestBureauUrl(phoneDigits);

  if (!response.ok) {
    return undefined;
  }

  const pdfUrl = extractBureauPdfUrl(responseData);
  return pdfUrl;
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
  const headers: Record<string, string> = {
    ...buildDefaultHeaders(),
    mobile: phoneNumber.replace(/\D/g, ''),
  };

  if (excludeAgentHost) {
    delete headers['X-Agent-Host'];
  } else {
    headers['X-Agent-Host'] = 'agent-backend';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export interface SubmitEligibilityCheckResult {
  success: boolean;
  pdfUrl?: string;
}

/**
 * Submit eligibility check (bureau report) to wechat API.
 * Stores pdfUrl for the credit-score screen; does not open the PDF here.
 */
export async function submitEligibilityCheck(
  payload: EligibilityCheckPayload
): Promise<SubmitEligibilityCheckResult> {
  const phoneDigits = payload.phoneNumber.replace(/\D/g, '');
  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    toast.error('Invalid phone number', {
      description: 'Please enter a valid 10-digit phone number.',
    });
    return { success: false };
  }


  if (bureauReportConfig.useMockData) {
    storeBureauResponse(BUREAU_REPORT_MOCK);
    return {
      success: true,
      pdfUrl: extractBureauPdfUrl(BUREAU_REPORT_MOCK),
    };
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
      const responseData = await response.json();
      if (!isUsableBureauReportResponse(responseData)) {
        toast.error('Credit report data is unavailable', {
          description: 'Please retry your credit report request.',
        });
        return { success: false };
      }
      const pdfUrl = extractBureauPdfUrl(responseData);
      storeBureauResponse(responseData);
      return { success: true, pdfUrl };
    }

    let errorMessage = 'Failed to submit eligibility check';
    try {
      const errorData = await response.json();
      const msg = extractErrorMessage(errorData);
      if (msg) errorMessage = String(msg);
    } catch {
      errorMessage = `Request failed with status ${response.status}`;
    }

    toast.error(errorMessage, {
      description: 'Unable to submit your request. Please try again.',
    });
    return { success: false };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Network error occurred';
    toast.error(errorMessage, {
      description: 'Failed to submit your request. Please check your connection.',
    });
    return { success: false };
  }
}
