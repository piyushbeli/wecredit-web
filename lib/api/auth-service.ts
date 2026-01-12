/**
 * Auth Service
 * API service for authentication operations (OTP send/verify)
 * 
 * NOTE: Currently using mock implementations for development.
 * Uncomment the real API calls when backend is ready.
 */

// import { ApiHandler } from '@/lib/utils/api';
// import { ENDPOINTS } from '@/lib/constants/api-keys';
import type { User } from '@/stores/auth-store';

/** Request payload for sending OTP */
interface SendOtpRequest {
  phoneNumber: string;
  countryCode?: string;
}

/** Response from send OTP API */
interface SendOtpResponse {
  success: boolean;
  message: string;
  /** Session ID for OTP verification */
  sessionId?: string;
}

/** Request payload for verifying OTP */
interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string;
  sessionId?: string;
}

/** Response from verify OTP API */
interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

/** Auth service result type */
interface AuthResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Mock delay to simulate network request */
const mockDelay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Send OTP to the given phone number
 * @param phoneNumber - 10 digit phone number
 * @param countryCode - Country code (default: +91)
 * @returns Result with session ID on success
 */
async function sendOtp(
  phoneNumber: string,
  countryCode: string = '+91'
): Promise<AuthResult<SendOtpResponse>> {
  // ============================================
  // MOCK IMPLEMENTATION - Remove when API ready
  // ============================================
  console.log(`[MOCK] Sending OTP to ${countryCode} ${phoneNumber}`);
  await mockDelay(1000); // Simulate network delay
  
  // Mock success response
  return {
    success: true,
    data: {
      success: true,
      message: 'OTP sent successfully',
      sessionId: 'mock-session-' + Date.now(),
    },
  };
  // ============================================
  // END MOCK IMPLEMENTATION
  // ============================================

  /* 
  // REAL API IMPLEMENTATION - Uncomment when ready
  try {
    const payload: SendOtpRequest = {
      phoneNumber,
      countryCode,
    };
    const response = await ApiHandler.post<SendOtpResponse>(
      ENDPOINTS.AUTH.SEND_OTP,
      payload
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send OTP';
    return {
      success: false,
      error: message,
    };
  }
  */
}

/**
 * Verify OTP and authenticate user
 * @param phoneNumber - 10 digit phone number
 * @param otp - 6 digit OTP
 * @param sessionId - Optional session ID from sendOtp
 * @returns Result with token and user on success
 */
async function verifyOtp(
  phoneNumber: string,
  otp: string,
  sessionId?: string
): Promise<AuthResult<VerifyOtpResponse>> {
  // ============================================
  // MOCK IMPLEMENTATION - Remove when API ready
  // ============================================
  console.log(`[MOCK] Verifying OTP ${otp} for ${phoneNumber}, session: ${sessionId}`);
  await mockDelay(1500); // Simulate network delay
  
  // Mock: Accept any 6-digit OTP for testing
  // In production, this would validate against the actual OTP
  if (otp.length !== 6) {
    return {
      success: false,
      error: 'Invalid OTP. Please enter a 6-digit code.',
    };
  }

  // Mock success response
  return {
    success: true,
    data: {
      success: true,
      message: 'OTP verified successfully',
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'user-' + phoneNumber,
        phoneNumber: phoneNumber,
        name: 'User ' + phoneNumber.slice(-4),
      },
    },
  };
  // ============================================
  // END MOCK IMPLEMENTATION
  // ============================================

  /*
  // REAL API IMPLEMENTATION - Uncomment when ready
  try {
    const payload: VerifyOtpRequest = {
      phoneNumber,
      otp,
      ...(sessionId && { sessionId }),
    };
    const response = await ApiHandler.post<VerifyOtpResponse>(
      ENDPOINTS.AUTH.VERIFY_OTP,
      payload
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify OTP';
    return {
      success: false,
      error: message,
    };
  }
  */
}

/** Auth service object with all auth-related API calls */
export const authService = {
  sendOtp,
  verifyOtp,
};

export type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  AuthResult,
};
