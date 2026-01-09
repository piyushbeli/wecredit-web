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

export { fetchActiveLenders } from './wecredit';
export type { WeCreditOptions } from './wecredit';

