/**
 * API Handler Utility
 * Class-based API handler with logging, timeouts, and custom exceptions
 */

import { environment } from '@/lib/config';
import {
  ApiException,
  NoInternetException,
  RequestTimeoutException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ServerException,
} from '@/lib/api/api-exceptions';
import {
  TIMEOUT_DEVELOPMENT,
  TIMEOUT_PRODUCTION,
  STORAGE_AUTH_TOKEN,
  STORAGE_MOBILE,
} from '@/lib/constants/api-keys';

/** Default timeout based on environment */
const DEFAULT_TIMEOUT = environment.isDevelopment ? TIMEOUT_DEVELOPMENT : TIMEOUT_PRODUCTION;

/** Request options interface */
export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

/** POST request options */
export interface PostOptions extends RequestOptions {
  isBearer?: boolean;
  sendMobileInHeader?: boolean;
}

/** GET request options */
export interface GetOptions extends RequestOptions {
  isBearer?: boolean;
  noHeader?: boolean;
  noBase?: boolean;
}

/** API response wrapper */
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

/**
 * Get auth token from localStorage (client-side only)
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_AUTH_TOKEN);
}

/**
 * Get mobile number from localStorage (client-side only)
 */
function getMobile(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_MOBILE);
}

/**
 * Set auth token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_AUTH_TOKEN, token);
  }
}

/**
 * Set mobile in localStorage
 */
export function setMobile(mobile: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_MOBILE, mobile);
  }
}

/**
 * Clear auth data from localStorage
 */
export function clearAuthData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_AUTH_TOKEN);
    localStorage.removeItem(STORAGE_MOBILE);
  }
}

/**
 * Build default headers for requests
 */
function buildDefaultHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

/**
 * Log API request/response in development mode
 */
function logApiCall(
  method: string,
  url: string,
  requestBody: unknown,
  response: Response,
  responseBody: unknown,
  duration: number
): void {
  if (!environment.isDevelopment) return;
  const statusEmoji = response.ok ? '✅' : response.status >= 500 ? '💥' : '⚠️';
  console.group(`🌐 API CALL: ${method} ${url}`);
  console.log('📡 REQUEST');
  console.log('→ METHOD:', method);
  console.log('→ URL:', url);
  if (requestBody) console.log('→ BODY:', requestBody);
  console.log('');
  console.log('📩 RESPONSE');
  console.log(`← STATUS: ${statusEmoji} ${response.status} (${duration}ms)`);
  // console.log('← BODY:', responseBody);
  console.groupEnd();
}

/**
 * Handle HTTP errors and throw appropriate exceptions
 */
function handleHttpError(status: number, message?: string): never {
  switch (status) {
    case 401:
      throw new UnauthorizedException(message);
    case 403:
      throw new ForbiddenException(message);
    case 404:
      throw new NotFoundException(message);
    case 500:
    case 502:
    case 503:
    case 504:
      throw new ServerException(message);
    default:
      throw new ApiException(message || 'Request failed', status);
  }
}

/**
 * Execute fetch request with timeout and error handling
 */
async function execute<T>(
  method: string,
  url: string,
  requestBody: unknown,
  requestFn: () => Promise<Response>,
  timeout: number = DEFAULT_TIMEOUT
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const startTime = performance.now();
  try {
    const response = await requestFn();
    const duration = Math.round(performance.now() - startTime);
    clearTimeout(timeoutId);
    let data: T;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = (await response.text()) as unknown as T;
    }
    logApiCall(method, url, requestBody, response, data, duration);
    if (!response.ok) {
      const errorMessage = typeof data === 'object' && data !== null && 'message' in data
        ? (data as { message: string }).message
        : 'Request failed';
      handleHttpError(response.status, errorMessage);
    }
    return { data, status: response.status };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiException) {
      throw error;
    }
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new NoInternetException();
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new RequestTimeoutException();
    }
    throw new ApiException(`Unexpected error: ${error}`);
  }
}

/**
 * API Handler class with static methods for making HTTP requests
 */
export class ApiHandler {
  /**
   * POST request
   */
  static async post<T = unknown>(
    url: string,
    body?: unknown,
    options: PostOptions = {}
  ): Promise<ApiResponse<T>> {
    const { headers: customHeaders, timeout } = options;
    const headers: Record<string, string> = {
      ...buildDefaultHeaders(),
      ...customHeaders,
    };
    return execute<T>(
      'POST',
      url,
      body,
      () => fetch(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      }),
      timeout
    );
  }

  /**
   * GET request
   */
  static async get<T = unknown>(
    url: string,
    options: GetOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      headers: customHeaders,
      timeout,
      isBearer = false,
      noHeader = false,
    } = options;
    const token = getAuthToken();
    const mobile = getMobile();
    const headers: Record<string, string> = noHeader
      ? {}
      : {
          ...buildDefaultHeaders(),
          ...(token && {
            Authorization: isBearer ? `Bearer ${token}` : `Basic ${token}`,
          }),
          ...(mobile && { mobile }),
          ...customHeaders,
        };
    return execute<T>(
      'GET',
      url,
      undefined,
      () => fetch(url, {
        method: 'GET',
        headers,
      }),
      timeout
    );
  }

  /**
   * POST request with authentication token
   */
  static async postWithToken<T = unknown>(
    url: string,
    body: unknown,
    options: PostOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      headers: customHeaders,
      timeout,
      isBearer = false,
      sendMobileInHeader = false,
    } = options;
    const token = getAuthToken();
    const mobile = getMobile();
    const headers: Record<string, string> = {
      ...buildDefaultHeaders(),
      ...(token && {
        Authorization: isBearer ? `Bearer ${token}` : `Basic ${token}`,
      }),
      ...(sendMobileInHeader && mobile && { mobile }),
      ...customHeaders,
    };
    return execute<T>(
      'POST',
      url,
      body,
      () => fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      }),
      timeout
    );
  }

  /**
   * POST request with Bearer token
   */
  static async postWithBearerToken<T = unknown>(
    url: string,
    body: unknown,
    options: Omit<PostOptions, 'isBearer'> = {}
  ): Promise<ApiResponse<T>> {
    return this.postWithToken<T>(url, body, { ...options, isBearer: true });
  }

  /**
   * PUT request
   */
  static async put<T = unknown>(
    url: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { headers: customHeaders, timeout } = options;
    const headers: Record<string, string> = {
      ...buildDefaultHeaders(),
      ...customHeaders,
    };
    return execute<T>(
      'PUT',
      url,
      body,
      () => fetch(url, {
        method: 'PUT',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      }),
      timeout
    );
  }

  /**
   * PATCH request
   */
  static async patch<T = unknown>(
    url: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { headers: customHeaders, timeout } = options;
    const headers: Record<string, string> = {
      ...buildDefaultHeaders(),
      ...customHeaders,
    };
    return execute<T>(
      'PATCH',
      url,
      body,
      () => fetch(url, {
        method: 'PATCH',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      }),
      timeout
    );
  }

  /**
   * DELETE request
   */
  static async delete<T = unknown>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { headers: customHeaders, timeout } = options;
    const headers: Record<string, string> = {
      ...buildDefaultHeaders(),
      ...customHeaders,
    };
    return execute<T>(
      'DELETE',
      url,
      undefined,
      () => fetch(url, {
        method: 'DELETE',
        headers,
      }),
      timeout
    );
  }

  /**
   * Simple fetch without authentication - returns data directly or null on error
   */
  static async fetch<T = unknown>(url: string): Promise<T | null> {
    try {
      const response = await this.get<T>(url, { noHeader: true });
      return response.data;
    } catch {
      return null;
    }
  }
}

/**
 * Legacy api object for backward compatibility
 * @deprecated Use ApiHandler class methods instead
 */
export const api = {
  get: <T>(url: string, options?: RequestOptions): Promise<T> =>
    ApiHandler.get<T>(url, options).then(res => res.data),
  post: <T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    ApiHandler.post<T>(url, body, options).then(res => res.data),
  put: <T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    ApiHandler.put<T>(url, body, options).then(res => res.data),
  patch: <T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    ApiHandler.patch<T>(url, body, options).then(res => res.data),
  delete: <T>(url: string, options?: RequestOptions): Promise<T> =>
    ApiHandler.delete<T>(url, options).then(res => res.data),
};

/** Re-export ApiError as alias for backward compatibility */
export { ApiException as ApiError } from '@/lib/api/api-exceptions';
