/**
 * Auth Service
 * API service for authentication operations (OTP send/verify/resend/validate/logout)
 * Based on WeCredit OTP Authentication API documentation
 */

import { getCookie } from 'cookies-next';
import { wecreditConfig } from '@/lib/config';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import { getEffectivePartnerCode } from '@/lib/utils/effective-partner-code';
import { clearAuthData } from '@/lib/utils/api';
import type { User } from '@/stores/auth-store';
import { getAttributionHeaders, getAttributionHeadersCommon, getAttributionUtmUrl } from './attribution-headers';

/** Auth API endpoint - all auth operations use this single endpoint */
const AUTH_ENDPOINT = `${wecreditConfig.apiUrl}/api/auth`;

/** Default flow name for loan applications */
const DEFAULT_FLOW_NAME = 'loan_application';

/** LocalStorage keys */
const FINGERPRINT_STORAGE_KEY = 'device_fingerprint';
const DEVICE_INFO_STORAGE_KEY = 'device';

// ============================================
// API Response Codes
// ============================================

/** Success response codes */
export const AUTH_RESPONSE_CODES = {
  SUCCESS: 2000,
  PROFILE_COMPLETE: 2001,
  PROFILE_INCOMPLETE: 2002,
  PENDING_VERIFICATION: 2003,
  UNDER_REVIEW: 2004,
} as const;

/** Error response codes */
export const AUTH_ERROR_CODES = {
  INVALID_MOBILE: 4001,
  NOT_REGISTERED: 4002,
  RATE_LIMITED: 4003,
  INVALID_OTP: 4004,
  OTP_EXPIRED: 4005,
  ACCOUNT_BLOCKED: 4006,
  SMS_UNAVAILABLE: 5001,
  SERVER_ERROR: 5002,
} as const;

/** Valid token response codes */
const VALID_TOKEN_CODES = [
  AUTH_RESPONSE_CODES.PROFILE_COMPLETE,
  AUTH_RESPONSE_CODES.PROFILE_INCOMPLETE,
  AUTH_RESPONSE_CODES.PENDING_VERIFICATION,
  AUTH_RESPONSE_CODES.UNDER_REVIEW,
] as const;

// ============================================
// Request Types (matching API documentation)
// ============================================

/** Request payload for sending OTP (login) */
interface SendOtpRequest {
  mobile: string;
  endpoint: 'login';
  lenderName?: string;
}

/** Request payload for verifying OTP */
interface VerifyOtpRequest {
  mobile: string;
  otp: string;
  fingerprint: string;
  flow_name: string;
  ip: string;
  endpoint: 'verify_otp';
}

/** Request payload for resending OTP */
interface ResendOtpRequest {
  mobile: string;
  endpoint: 'resend_otp';
}

/** Request payload for logout */
interface LogoutRequest {
  mobile: string;
  endpoint: 'logout';
}

// ============================================
// Response Types
// ============================================

/** Standard API response from auth endpoints */
interface AuthApiResponse {
  code: number;
  message: string;
}

/** Response structure for send OTP */
interface SendOtpResponse {
  success: boolean;
  message: string;
  code: number;
}

/** Response structure for verify OTP */
interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
  code: number;
}

/** Response structure for resend OTP */
interface ResendOtpResponse {
  success: boolean;
  message: string;
  code: number;
}

/** Response structure for validate token */
interface ValidateTokenResponse {
  isValid: boolean;
  code?: number;
  requiresProfileCompletion?: boolean;
  message?: string;
  failureReason?: 'network_error' | 'invalid_token' | 'unknown';
}

/** Response structure for logout */
interface LogoutResponse {
  success: boolean;
  message: string;
  code: number;
}

/** Auth service result type */
interface AuthResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: number;
}

// ============================================
// Utility Functions
// ============================================

/**
 * Generates a UUID v4 for device fingerprint
 * Uses crypto.randomUUID if available, falls back to manual generation
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

/**
 * Gets or generates a device fingerprint
 * Stores in localStorage for consistency across sessions
 */
function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') {
    return generateUUID();
  }
  let fingerprint = localStorage.getItem(FINGERPRINT_STORAGE_KEY);
  if (!fingerprint) {
    fingerprint = generateUUID();
    localStorage.setItem(FINGERPRINT_STORAGE_KEY, fingerprint);
  }
  return fingerprint;
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
 * Gets device info from localStorage
 */
function getDeviceInfo(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return localStorage.getItem(DEVICE_INFO_STORAGE_KEY) || '';
}

/** Generic fallback messages when API doesn't provide a meaningful message */
const FALLBACK_ERROR_MESSAGES: Record<number, string> = {
  [AUTH_ERROR_CODES.INVALID_MOBILE]: 'Invalid mobile number. Please enter a valid 10-digit number.',
  [AUTH_ERROR_CODES.NOT_REGISTERED]: 'Mobile number not registered. Please sign up first.',
  [AUTH_ERROR_CODES.RATE_LIMITED]: 'Too many requests. Please wait 30 seconds and try again.',
  [AUTH_ERROR_CODES.INVALID_OTP]: 'Invalid OTP. Please check and try again.',
  [AUTH_ERROR_CODES.OTP_EXPIRED]: 'OTP has expired. Please request a new one.',
  [AUTH_ERROR_CODES.ACCOUNT_BLOCKED]: 'Account blocked. Please contact support.',
  [AUTH_ERROR_CODES.SMS_UNAVAILABLE]: 'SMS service unavailable. Please try again later.',
  [AUTH_ERROR_CODES.SERVER_ERROR]: 'Server error. Please try again later.',
};

/**
 * Checks if the API message is meaningful (not empty or generic)
 */
function isMessageMeaningful(message: string): boolean {
  if (!message || message.trim() === '') return false;
  const genericMessages = ['error', 'failed', 'invalid', 'success'];
  const lowerMessage = message.toLowerCase().trim();
  return !genericMessages.includes(lowerMessage);
}

/**
 * Capitalizes first letter of the message for display
 */
function formatErrorMessage(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) return trimmed;
  // Capitalize first letter and add period if missing
  const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return formatted.endsWith('.') || formatted.endsWith('!') || formatted.endsWith('?')
    ? formatted
    : `${formatted}.`;
}

/**
 * Gets user-friendly error message
 * Prioritizes API message, falls back to predefined messages
 */
function getErrorMessage(code: number, apiMessage: string): string {
  // Use API message if it's meaningful
  if (isMessageMeaningful(apiMessage)) {
    return formatErrorMessage(apiMessage);
  }
  // Fall back to predefined message for this code
  return FALLBACK_ERROR_MESSAGES[code] || 'Something went wrong. Please try again.';
}

// ============================================
// Header Builders
// ============================================

/**
 * Build default headers for unauthenticated requests
 * Includes Content-Type, Accept, and utm_url
 */
function buildDefaultHeaders(): Record<string, string> {
  return {
    ...wecreditConfig.headers,
    'Accept': 'application/json',
    ...getAttributionHeadersCommon(),
  };
}

/**
 * Builds HTTP headers for authenticated API requests
 * Retrieves token and mobile from cookies and includes them in headers
 * @returns Headers object with Authorization, mobile, and deviceInfo
 */
function buildAuthHeaders(): Record<string, string> {
  const token = getCookie(STORAGE_AUTH_TOKEN);
  const mobile = getCookie(STORAGE_MOBILE);
  const deviceInfo = getDeviceInfo();
  return {
    ...buildDefaultHeaders(),
    'Authorization': `Bearer ${token || ''}`,
    'mobile': String(mobile || ''),
    ...(deviceInfo && { 'deviceInfo': deviceInfo }),
  };
}

// ============================================
// API Helper
// ============================================

/**
 * Makes a POST request to the auth endpoint
 * Handles both success and error responses uniformly
 */
async function authPost<T>(payload: unknown): Promise<{ data: T | null; error: string | null; code: number | null }> {
  try {
    const response = await fetch(AUTH_ENDPOINT, {
      method: 'POST',
      headers: buildDefaultHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json() as AuthApiResponse;
    return {
      data: data as T,
      error: null,
      code: data.code || null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    return {
      data: null,
      error: errorMessage,
      code: null,
    };
  }
}

/**
 * Makes a GET request to the auth endpoint with auth headers
 * Used for token validation
 * @param endpoint - Optional endpoint query parameter (e.g., 'validate')
 */
async function authGet<T>(endpoint?: string): Promise<{ data: T | null; error: string | null; code: number | null }> {
  try {
    const url = endpoint ? `${AUTH_ENDPOINT}?endpoint=${endpoint}` : AUTH_ENDPOINT;
    const response = await fetch(url, {
      method: 'GET',
      headers: buildAuthHeaders(),
    });
    const data = await response.json() as AuthApiResponse;
    return {
      data: data as T,
      error: null,
      code: data.code || null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    return {
      data: null,
      error: errorMessage,
      code: null,
    };
  }
}

// ============================================
// API Functions
// ============================================

/**
 * Send OTP to the given mobile number
 * @param mobile - 10 digit mobile number (must start with 6-9)
 * @param lenderName - Partner/lender code (default: affiliate `partner` query when set, else WC001)
 * @returns Result with success status and message
 */
async function sendOtp(
  mobile: string,
  lenderName: string = getEffectivePartnerCode()
): Promise<AuthResult<SendOtpResponse>> {
  const payload: SendOtpRequest = {
    mobile,
    endpoint: 'login',
    lenderName,
  };
  const { data, error: networkError } = await authPost<AuthApiResponse>(payload);
  if (networkError) {
    return {
      success: false,
      error: 'Unable to connect. Please check your internet connection.',
    };
  }
  if (!data) {
    return {
      success: false,
      error: 'Failed to send OTP. Please try again.',
    };
  }
  const isSuccess = data.code === AUTH_RESPONSE_CODES.SUCCESS;
  return {
    success: isSuccess,
    data: {
      success: isSuccess,
      message: isSuccess ? 'OTP sent successfully' : data.message,
      code: data.code,
    },
    ...(isSuccess ? {} : {
      error: getErrorMessage(data.code, data.message),
      errorCode: data.code,
    }),
  };
}

/**
 * Verify OTP and authenticate user
 * @param mobile - 10 digit mobile number
 * @param otp - 6 digit OTP received via SMS
 * @returns Result with token and user on success
 */
async function verifyOtp(
  mobile: string,
  otp: string
): Promise<AuthResult<VerifyOtpResponse>> {
  // Fetch IP address before verification
  const ip = await fetchUserIp();
  const payload: VerifyOtpRequest = {
    mobile,
    otp,
    fingerprint: getDeviceFingerprint(),
    flow_name: DEFAULT_FLOW_NAME,
    ip,
    endpoint: 'verify_otp',
  };
  const { data, error: networkError } = await authPost<AuthApiResponse>(payload);
  if (networkError) {
    return {
      success: false,
      error: 'Unable to connect. Please check your internet connection.',
    };
  }
  if (!data) {
    return {
      success: false,
      error: 'Failed to verify OTP. Please try again.',
    };
  }
  const isSuccess = data.code === AUTH_RESPONSE_CODES.SUCCESS;
  if (isSuccess) {
    // On success, the message field contains the JWT token
    const token = data.message;
    return {
      success: true,
      data: {
        success: true,
        message: 'OTP verified successfully',
        token,
        user: {
          id: `user-${mobile}`,
          phoneNumber: mobile,
          name: `User ${mobile.slice(-4)}`,
        },
        code: data.code,
      },
    };
  }
  return {
    success: false,
    error: getErrorMessage(data.code, data.message),
    errorCode: data.code,
  };
}

/**
 * Resend OTP to the mobile number
 * @param mobile - 10 digit mobile number
 * @returns Result with success status
 */
async function resendOtp(mobile: string): Promise<AuthResult<ResendOtpResponse>> {
  const payload: ResendOtpRequest = {
    mobile,
    endpoint: 'resend_otp',
  };
  const { data, error: networkError } = await authPost<AuthApiResponse>(payload);
  if (networkError) {
    return {
      success: false,
      error: 'Unable to connect. Please check your internet connection.',
    };
  }
  if (!data) {
    return {
      success: false,
      error: 'Failed to resend OTP. Please try again.',
    };
  }
  const isSuccess = data.code === AUTH_RESPONSE_CODES.SUCCESS;
  return {
    success: isSuccess,
    data: {
      success: isSuccess,
      message: isSuccess ? 'OTP resent successfully' : data.message,
      code: data.code,
    },
    ...(isSuccess ? {} : {
      error: getErrorMessage(data.code, data.message),
      errorCode: data.code,
    }),
  };
}

/**
 * Validates existing auth token
 * Makes GET request to /api/auth?endpoint=validate
 * @returns Validation result with profile status
 */
async function validateToken(): Promise<ValidateTokenResponse> {
  const { data, error: networkError } = await authGet<AuthApiResponse>('validate');
  if (networkError) {
    // A transient network issue should not force-logout a valid user session.
    return {
      isValid: false,
      failureReason: 'network_error',
      message: 'Unable to validate session due to network issue',
    };
  }
  if (!data) {
    return { isValid: false, failureReason: 'unknown' };
  }
  const isValidCode = VALID_TOKEN_CODES.includes(data.code as typeof VALID_TOKEN_CODES[number]);
  if (isValidCode) {
    return {
      isValid: true,
      code: data.code,
      requiresProfileCompletion: data.code === AUTH_RESPONSE_CODES.PROFILE_INCOMPLETE,
      message: data.message,
    };
  }
  // Token invalid - clear stored data
  clearAuthData();
  return { isValid: false, code: data.code, failureReason: 'invalid_token' };
}

/**
 * Logs out the user and clears all auth data
 * @param mobile - User's mobile number
 * @returns Result with success status
 */
async function logout(mobile: string): Promise<AuthResult<LogoutResponse>> {
  const payload: LogoutRequest = {
    mobile,
    endpoint: 'logout',
  };
  try {
    await authPost<AuthApiResponse>(payload);
  } catch {
    // Continue with local logout even if API fails
  }
  // Always clear local data
  clearAuthData();
  return {
    success: true,
    data: {
      success: true,
      message: 'Logged out successfully',
      code: AUTH_RESPONSE_CODES.SUCCESS,
    },
  };
}

/**
 * Checks if user is currently logged in
 * Verifies presence of both auth token and mobile number in cookies
 * @returns true if valid auth credentials exist, false otherwise
 */
function isUserLoggedIn(): boolean {
  const token = getCookie(STORAGE_AUTH_TOKEN);
  const mobile = getCookie(STORAGE_MOBILE);
  return !!(token && mobile);
}

/** Auth service object with all auth-related API calls */
export const authService = {
  sendOtp,
  verifyOtp,
  resendOtp,
  validateToken,
  logout,
  isUserLoggedIn,
  clearAuthData,
};

/** Export response code constants */
export { AUTH_RESPONSE_CODES as AuthResponseCodes, AUTH_ERROR_CODES as AuthErrorCodes };

/** Export utility functions */
export { getDeviceFingerprint, fetchUserIp, buildDefaultHeaders, buildAuthHeaders };

export type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ValidateTokenResponse,
  LogoutRequest,
  LogoutResponse,
  AuthResult,
  AuthApiResponse,
};
