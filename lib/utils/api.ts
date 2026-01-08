/**
 * Simple API Utility
 * Clean, reusable fetch wrapper with customizable headers
 */

/** API error with status and URL context */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public url: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Request options */
export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Makes an HTTP request and returns parsed JSON
 */
async function request<T>(
  method: string,
  url: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const { headers = {}, timeout = 30000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new ApiError(errorText || `HTTP ${response.status}`, response.status, url);
    }

    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError('Request timeout', 408, url);
    }

    throw new ApiError(
      err instanceof Error ? err.message : 'Network error',
      0,
      url
    );
  }
}

/** Simple API utility object */
export const api = {
  /** GET request */
  get: <T>(url: string, options?: RequestOptions): Promise<T> =>
    request<T>('GET', url, undefined, options),

  /** POST request */
  post: <T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>('POST', url, body, options),

  /** PUT request */
  put: <T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>('PUT', url, body, options),

  /** PATCH request */
  patch: <T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>('PATCH', url, body, options),

  /** DELETE request */
  delete: <T>(url: string, options?: RequestOptions): Promise<T> =>
    request<T>('DELETE', url, undefined, options),
};

