/**
 * API Module Barrel Export
 * Re-exports all API-related utilities and exceptions
 */

export {
  ApiHandler,
  api,
  setAuthToken,
  setMobile,
  clearAuthData,
  ApiError,
} from '@/lib/utils/api';

export type {
  RequestOptions,
  PostOptions,
  GetOptions,
  ApiResponse,
} from '@/lib/utils/api';

export * from './api-exceptions';

export {
  fetchActiveLenders,
  fetchActiveLendersForUser,
  checkStatusAll,
  determineLenderHandling,
} from './wecredit';
export type { WeCreditOptions } from './wecredit';

export {
  authService,
  AuthResponseCodes,
  AuthErrorCodes,
  getDeviceFingerprint,
  fetchUserIp,
  buildDefaultHeaders,
  buildAuthHeaders,
} from './auth-service';
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
} from './auth-service';

