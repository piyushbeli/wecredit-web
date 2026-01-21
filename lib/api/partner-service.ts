/**
 * Partner Service
 * API service for partner inquiry form submissions
 * Submits partner with us form data to backend
 */

import { getCookie } from 'cookies-next';
import { wecreditConfig } from '@/lib/config';
import { PARTNER_CODE, STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';
import { toast } from 'sonner';

/** Partner API endpoint - uses /api/forward for partner operations */
const PARTNER_ENDPOINT = `${wecreditConfig.apiUrl}/api/forward`;

// ============================================
// Type Definitions
// ============================================

/** Form data structure for partner inquiry */
export interface PartnerFormData {
  fullName: string;
  email: string;
  phoneNumber: string; // Will be converted to mobile (number)
  message: string;
}

/** Request body structure for partner API */
interface PartnerWithUsRequest {
  endpoint: string;
  partnerCode: string;
  fullName: string;
  email: string;
  mobile: number;
  message: string;
}

// ============================================
// Header Builders
// ============================================

/**
 * Builds default headers for partner API requests
 */
function buildDefaultHeaders(): Record<string, string> {
  return {
    ...wecreditConfig.headers,
    'Accept': 'application/json',
  };
}

/**
 * Builds headers for partner with us API request
 * Includes Bearer token from cookies (if available) and mobile number in header
 * @param mobile - Mobile number to include in header (from form data)
 */
function buildPartnerHeaders(mobile: string): Record<string, string> {
  const token = getCookie(STORAGE_AUTH_TOKEN);
  const headers: Record<string, string> = {
    ...buildDefaultHeaders(),
    'mobile': mobile,
  };
  
  // Only include Authorization header if token exists
  // This prevents sending "Bearer " (empty token) which could cause backend issues
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// ============================================
// API Functions
// ============================================

/**
 * Submits partner inquiry form data to backend
 * @param formData - Partner form data (fullName, email, phoneNumber, message)
 * @returns Boolean indicating success (true) or failure (false)
 */
export async function partnerWithUs(
  formData: PartnerFormData
): Promise<boolean> {
  // Validate phone number is exactly 10 digits before conversion
  const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
  if (!/^[0-9]{10}$/.test(phoneDigits)) {
    toast.error('Invalid phone number', {
      description: 'Phone number must be exactly 10 digits.',
    });
    return false;
  }

  // Transform form data to API format
  const requestBody: PartnerWithUsRequest = {
    endpoint: 'partner-with-us',
    partnerCode: PARTNER_CODE,
    fullName: formData.fullName.trim(),
    email: formData.email.trim(),
    mobile: parseInt(phoneDigits, 10),
    message: formData.message.trim(),
  };

  try {
    const response = await fetch(PARTNER_ENDPOINT, {
      method: 'POST',
      headers: buildPartnerHeaders(phoneDigits),
      body: JSON.stringify(requestBody),
    });

    // Success: HTTP 200 returns true
    if (response.ok && response.status === 200) {
      return true;
    }

    // Failure: non-200 status
    let errorMessage = 'Failed to submit partner inquiry';
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // Response body is not JSON or couldn't be parsed
      errorMessage = `Request failed with status ${response.status}`;
    }

    toast.error(errorMessage, {
      description: 'Unable to submit your inquiry. Please try again.',
    });
    return false;
  } catch (error) {
    // Handle network errors and exceptions
    const errorMessage = error instanceof Error
      ? error.message
      : 'Network error occurred';
    
    toast.error(errorMessage, {
      description: 'Failed to submit your inquiry. Please check your connection.',
    });
    return false;
  }
}
