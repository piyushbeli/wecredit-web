/**
 * Lead Service
 * API service for lead creation operations (fetch form fields, create lead)
 * Based on WeCredit Lead Creation API documentation
 */

import { getCookie } from 'cookies-next';
import { wecreditConfig } from '@/lib/config';
import { ENDPOINTS, PARTNER_CODE, STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import { toast } from 'sonner';
import type {
  FormField,
  FetchFormFieldsResponse,
  CheckDedupeRequest,
  CheckDedupeResponse,
  CreateLeadRequest,
  CreateLeadResponse,
  LeadFormData,
  GenderValue,
  EmploymentTypeValue,
  AddressTypeValue,
  MaritalStatusValue,
} from '@/types/lead';

/** Lead API endpoint - uses /api/forward for lead operations */
const LEAD_ENDPOINT = `${wecreditConfig.apiUrl}/api/forward`;

// ============================================
// Response Types
// ============================================

/** Result type for lead service operations */
interface LeadServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// Utility Functions
// ============================================

/**
 * Gets the current page URL for utm_url header
 */
function getUtmUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.location.href;
}

/**
 * Gets user IP address from ipify.org
 * Returns placeholder if fetch fails
 */
async function fetchUserIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (response.ok) {
      const data = await response.json();
      return data.ip || '127.0.0.1';
    }
  } catch {
    // Silently fail and return placeholder
  }
  return '127.0.0.1';
}

/**
 * Gets current datetime in required format: yyyy-MM-dd HH:mm:ss
 */
function getCurrentDateTime(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

/**
 * Converts date from DD-MM-YYYY to yyyy-MM-dd format
 */
function convertDateToApiFormat(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
}

// ============================================
// Header Builders
// ============================================

/**
 * Builds default headers for lead API requests
 */
function buildDefaultHeaders(): Record<string, string> {
  return {
    ...wecreditConfig.headers,
    'Accept': 'application/json',
  };
}

/**
 * Builds headers for fetch form fields API
 */
function buildFetchFormFieldsHeaders(
  lenderName: string,
  fetchDetails: boolean
): Record<string, string> {
  const token = getCookie(STORAGE_AUTH_TOKEN);
  const mobile = getCookie(STORAGE_MOBILE);
  return {
    ...buildDefaultHeaders(),
    'Authorization': `Bearer ${token || ''}`,
    'mobile': String(mobile || ''),
    'lenderName': lenderName,
    'fetchDetails': fetchDetails.toString(),
  };
}

/**
 * Builds headers for create lead API
 */
function buildCreateLeadHeaders(): Record<string, string> {
  const token = getCookie(STORAGE_AUTH_TOKEN);
  const mobile = getCookie(STORAGE_MOBILE);
  return {
    ...buildDefaultHeaders(),
    'Authorization': `Bearer ${token || ''}`,
    'mobile': String(mobile || ''),
    'utm_url': getUtmUrl(),
  };
}

// ============================================
// API Functions
// ============================================

/**
 * Checks if user exists in system and needs to fill form
 * @param mobile - User's mobile number (10 digits)
 * @param partnerCode - Partner code (default: WC001)
 * @returns Result with dedupe response (statusCode 1003 = needs form)
 */
async function checkDedupe(
  mobile: string,
  partnerCode: string = PARTNER_CODE
): Promise<LeadServiceResult<CheckDedupeResponse>> {
  const requestBody: CheckDedupeRequest = {
    mobile,
    endpoint: ENDPOINTS.PUBLIC.CHECK_DEDUPE,
    partnerCode,
  };
  try {
    const token = getCookie(STORAGE_AUTH_TOKEN);
    const response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: {
        ...buildDefaultHeaders(),
        'Authorization': `Bearer ${token || ''}`,
        'mobile': mobile,
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorMsg = `Failed to check dedupe: ${response.status}`;
      toast.error(errorMsg, {
        description: 'Unable to verify user status. Please try again.',
      });
      return {
        success: false,
        error: errorMsg,
      };
    }
    const data: CheckDedupeResponse = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    toast.error(errorMessage, {
      description: 'Failed to check user status. Please check your connection.',
    });
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Fetches dynamic form field configuration for a specific lender
 * @param lenderName - Lender identifier (e.g., "abfl", "bajaj")
 * @param fetchDetails - Whether to fetch pre-filled values (default: true)
 * @returns Result with form fields array sorted by order
 */
async function fetchFormFields(
  lenderName: string,
  fetchDetails: boolean = true
): Promise<LeadServiceResult<FormField[]>> {
  const requestBody = {
    endpoint: ENDPOINTS.PUBLIC.LENDERS_FORM_FILLED,
    partnerCode: PARTNER_CODE,
  };
  try {
    const response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: buildFetchFormFieldsHeaders(lenderName, fetchDetails),
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorMsg = `Failed to fetch form fields: ${response.status}`;
      toast.error(errorMsg, {
        description: 'Unable to load the form. Please try again.',
      });
      return {
        success: false,
        error: errorMsg,
      };
    }
    const data: FetchFormFieldsResponse = await response.json();
    // Sort fields by order
    const sortedFields = data.fields.sort((a, b) => a.order - b.order);
    return {
      success: true,
      data: sortedFields,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    toast.error(errorMessage, {
      description: 'Failed to load form fields. Please check your connection.',
    });
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Creates a new lead with the provided form data
 * @param formData - User-filled form data (from dynamic form)
 * @param partnerCode - Partner code (default: WC001)
 * @param lenderName - Optional specific lender for campaign forms
 * @returns Result with lead ID and status
 */
async function createLead(
  formData: LeadFormData,
  partnerCode: string = PARTNER_CODE,
  lenderName?: string
): Promise<LeadServiceResult<CreateLeadResponse>> {
  try {
    const mobile = getCookie(STORAGE_MOBILE) as string || formData.mobile;
    // Use ConsentIp and ConsentDateTime from form if available, otherwise fetch/generate
    const consentIp = formData.ConsentIp || await fetchUserIp();
    const consentDateTime = formData.ConsentDateTime || getCurrentDateTime();
    // Transform form data to API format
    const requestBody: CreateLeadRequest = {
      mobile: mobile,
      name: formData.name.trim(),
      pan: formData.pan.toUpperCase(),
      employmentType: formData.employmentType as EmploymentTypeValue,
      salary: parseFloat(formData.salary.replace(/,/g, '')),
      dob: convertDateToApiFormat(formData.dob),
      pincode: parseInt(formData.pincode, 10),
      gender: formData.gender as GenderValue,
      email: formData.email.trim(),
      permanentAddress: formData.permanentAddress || undefined,
      addressType: (formData.addressType as AddressTypeValue) || undefined,
      companyName: formData.companyName || undefined,
      companyAddress: formData.companyAddress || undefined,
      companyPincode: formData.companyPincode ? parseInt(formData.companyPincode, 10) : undefined,
      modeOfSalary: formData.modeOfSalary || undefined,
      maritalStatus: (formData.maritalStatus as MaritalStatusValue) || undefined,
      ConsentIp: consentIp,
      ConsentDateTime: consentDateTime,
      endpoint: 'create-lead',
      partnerCode: partnerCode,
      ...(lenderName && { lenderName: [lenderName] }),
    };
    const response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: buildCreateLeadHeaders(),
      body: JSON.stringify(requestBody),
    });
    const data: CreateLeadResponse = await response.json();
    if (!response.ok || data.statusCode === 'error') {
      const errorMsg = data.statusMessage || 'Failed to create lead';
      toast.error(errorMsg, {
        description: 'Unable to submit your application. Please try again.',
      });
      return {
        success: false,
        error: errorMsg,
      };
    }
    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    toast.error(errorMessage, {
      description: 'Failed to submit your application. Please check your connection.',
    });
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/** Lead service object with all lead-related API calls */
export const leadService = {
  checkDedupe,
  fetchFormFields,
  createLead,
};

/** Export utility functions for reuse */
export {
  fetchUserIp,
  getCurrentDateTime,
  convertDateToApiFormat,
};

export type { LeadServiceResult };
