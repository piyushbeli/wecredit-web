/**
 * Lead Service
 * API service for lead creation operations (fetch form fields, create lead)
 * Based on WeCredit Lead Creation API documentation
 */

import { getCookie } from 'cookies-next';
import { wecreditConfig } from '@/lib/config';
import { ENDPOINTS, STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import { getEffectivePartnerCode } from '@/lib/utils/effective-partner-code';
import { toast } from 'sonner';
import { useUrlParamsStore } from '@/stores/url-params-store';
import { getAttributionHeaders, getAttributionHeadersCommon, getAttributionUtmUrl } from './attribution-headers';
import { notifyCreateLeadNavigationEvent } from './upswing-navigation-event';
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

// Note: we intentionally do not use `window.location.href` directly for `utm_url` header,
// because we sometimes clean URL query params via `history.replaceState` immediately after capture.
// Instead, we capture the original URL in the session store and reuse it.

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

/**
 * Parse multi-lender credit card max limit from form string (digits / optional commas).
 * Returns undefined when empty or invalid so we never send bad numbers downstream.
 */
function parseCreditCardMaxAmount(value: string | undefined): number | undefined {
  const raw = (value ?? '').replace(/,/g, '').trim();
  if (!raw) return undefined;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

/**
 * Multi-lender personal loan: maps credit card answers for create-lead.
 * Returns an empty object when the form did not ask (single-lender flows).
 */
function buildMultiLenderCreditCardPayload(
  formData: Pick<LeadFormData, 'hasCreditCard' | 'creditCardLimit'>
): Partial<Pick<CreateLeadRequest, 'hasCreditCard' | 'creditCardLimit'>> {
  const { hasCreditCard, creditCardLimit } = formData;

  // Dynamic form did not include a credit-card question for this lender.
  if (hasCreditCard === undefined) {
    return {};
  }

  if (hasCreditCard === false) {
    return { hasCreditCard: false };
  }

  const payload: Partial<Pick<CreateLeadRequest, 'hasCreditCard' | 'creditCardLimit'>> = {
    hasCreditCard: true,
  };

  const maxAmount = parseCreditCardMaxAmount(creditCardLimit);
  if (maxAmount !== undefined) {
    payload.creditCardLimit = maxAmount;
  }

  return payload;
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
  const hasExplicitLenderName = lenderName.trim().length > 0;
  return {
    ...buildDefaultHeaders(),
    'Authorization': `Bearer ${token || ''}`,
    'mobile': String(mobile || ''),
    'lendername': lenderName,
    'fetchDetails': fetchDetails.toString(),
    ...getAttributionHeadersCommon(
      hasExplicitLenderName ? { omitLender: true } : undefined
    ),
  };
}

/**
 * Builds headers for create lead API.
 * Adds `lenderUniqueId` when the session captured it from URL query (see AuthProvider + url-params-store).
 */
function buildCreateLeadHeaders(): Record<string, string> {
  const token = getCookie(STORAGE_AUTH_TOKEN);
  const mobile = getCookie(STORAGE_MOBILE);
  const lenderUniqueIdFromUrl = useUrlParamsStore.getState().lenderUniqueId;

  const headers: Record<string, string> = {
    ...buildDefaultHeaders(),
    'Authorization': `Bearer ${token || ''}`,
    'mobile': String(mobile || ''),
    ...getAttributionHeadersCommon(),
  };

  // Backend expects this header only when the landing URL carried the id (avoid empty / noise).
  if (lenderUniqueIdFromUrl) {
    headers['lenderUniqueId'] = lenderUniqueIdFromUrl;
  }

  return headers;
}

// ============================================
// API Functions
// ============================================

/**
 * Checks if user exists in system and needs to fill form
 * @param mobile - User's mobile number (10 digits)
 * @param partnerCode - Partner code (default: affiliate `partner` query when set, else WC001)
 * @returns Result with dedupe response (statusCode 1003 = needs form)
 */
async function checkDedupe(
  mobile: string,
  partnerCode: string = getEffectivePartnerCode()
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
        ...getAttributionHeadersCommon(),
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
    const raw = (await response.json()) as CheckDedupeResponse & {
      /** Some gateways serialize booleans with snake_case */
      is_prime_pl_lead?: unknown;
    };
    const isPrimePlLeadResolved =
      raw.isPrimePlLead === true || raw.is_prime_pl_lead === true;
    const data: CheckDedupeResponse = {
      ...raw,
      ...(isPrimePlLeadResolved ? { isPrimePlLead: true } : {}),
    };
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
    partnerCode: getEffectivePartnerCode(),
  };
  try {
    const headers = buildFetchFormFieldsHeaders(lenderName, fetchDetails);
    console.log('[headers]:', headers);
    const response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers,
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
 * @param partnerCode - Partner code (default: affiliate `partner` query when set, else WC001)
 * @param lenderName - Optional specific lender for campaign forms
 * @returns Result with lead ID and status
 */
async function createLead(
  formData: LeadFormData,
  partnerCode: string = getEffectivePartnerCode(),
  lenderName?: string,
  lenderUniqueIdFromUrl?: string
): Promise<LeadServiceResult<CreateLeadResponse>> {
  try {
    const isLntLenderOrUpswignLntLender = lenderName?.toLowerCase() === 'lnt' || lenderName?.toLowerCase() === 'upswing_lnt';
    const mobile = getCookie(STORAGE_MOBILE) as string || formData.mobile;
    // Use ConsentIp and ConsentDateTime from form if available, otherwise fetch/generate
    const consentIp = formData.ConsentIp || await fetchUserIp();
    const consentDateTime = formData.ConsentDateTime || getCurrentDateTime();

    // Transform LNT lender name only
    const transformedLenderName =lenderName?.toLowerCase() === "lnt"? "upswing_lnt": lenderName;

    const requiredLoanAmountRaw = formData.requiredLoanAmount?.replace(/,/g, '').trim();
    const requiredLoanAmountParsed =
      requiredLoanAmountRaw ? Number.parseFloat(requiredLoanAmountRaw) : undefined;

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
      endpoint: ENDPOINTS.PUBLIC.CREATE_LEAD,
      partnerCode: partnerCode,
      ...(lenderUniqueIdFromUrl && { lenderUniqueId: [lenderUniqueIdFromUrl] }),
      ...(transformedLenderName && { lenderName: [transformedLenderName] }),
      ...(formData.originSubLender && { originSubLender: formData.originSubLender }),
      ...(requiredLoanAmountParsed !== undefined
        && Number.isFinite(requiredLoanAmountParsed)
        && { requiredLoanAmount: requiredLoanAmountParsed }),

      ...buildMultiLenderCreditCardPayload(formData),

      // Add consents ONLY for LNT
      ...(isLntLenderOrUpswignLntLender && {
  consents: [
    {
      consentCode: "HARD_PULL",
      consentText:
        "I confirm that submission of Aadhaar/Proof of possession of AADHAAR number for KYC purposes is not mandatory, however, I voluntarily consent for providing the same for authentication & verification.",
      submittedAt: new Date().toISOString(),
    },
    {
      consentCode: "PII_TNC",
      consentText:
        'I hereby consent in favour of L&T Finance Ltd. to collect, store & process my personal data ( incl.Aadhaar details, location, audio/video data collected during appraisal process) including fetching and verifying my KYC, bureau and digilocker information and sharing it with third parties for my loan application. I hereby also agree to have read & understood the <link href="https://www.ltfinance.com/docs/default-source/default-document-library/pl_application_t-c.pdf?sfvrsn=ebbca65c_3">Personal Loan terms & Conditions</link> and <link href="https://www.ltfinance.com/privacy-policy">Privacy Policy</link> and consent to the same',
      submittedAt: new Date().toISOString(),
    },
    {
      consentCode: "RESIDENTIAL_STATUS_INDIAN",
      consentText:
        "I hereby consent that I am an Indian Resident.",
      submittedAt: new Date().toISOString(),
    },
    {
      consentCode: "HOUSEHOLD_INCOME_GTE_3L",
      consentText:
        "I hereby consent that my household income is greater than Rs 3,00,000",
      submittedAt: new Date().toISOString(),
    }
  ],
})
    };

    const response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: buildCreateLeadHeaders(),
      body: JSON.stringify(requestBody),
    });

    const raw = (await response.json()) as CreateLeadResponse & {
      /** Some gateways serialize booleans with snake_case */
      is_prime_pl_lead?: unknown;
    };

    const code = raw?.statusCode?.toString();

    if (
      !response.ok ||
      code === "error" ||
      code === "1003" ||
      code === "2006"
    ) {
      const errorMsg = raw.statusMessage || "Failed to create lead";

      toast.error(errorMsg, {
        description: "Unable to submit your application. Please try again.",
      });

      return {
        success: false,
        error: errorMsg,
      };
    }

    if (isLntLenderOrUpswignLntLender && mobile) {
      // This event should not affect lead creation success path.
      notifyCreateLeadNavigationEvent(mobile);
    }

    const isPrimePlLeadResolved =
      raw.isPrimePlLead === true || raw.is_prime_pl_lead === true;

    const data: CreateLeadResponse = {
      ...raw,
      // Normalize snake_case so downstream UI only checks `isPrimePlLead === true`.
      ...(isPrimePlLeadResolved ? { isPrimePlLead: true } : {}),
    };

    console.info('[lead-service:createLead]', {
      phase: 'success',
      statusCode: data.statusCode,
      isPrimePlLead: data.isPrimePlLead === true,
      rawCamelPresent: raw.isPrimePlLead !== undefined && raw.isPrimePlLead !== null,
      rawSnakePresent: raw.is_prime_pl_lead !== undefined && raw.is_prime_pl_lead !== null,
    });

    return {
      success: true,
      data,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Network error";

    toast.error(errorMessage, {
      description:"Failed to submit your application. Please check your connection.",
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
