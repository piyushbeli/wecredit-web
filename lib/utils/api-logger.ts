/**
 * API Logger Utility
 * Provides structured logging for API calls on both server and client
 * Keeps logging logic isolated and reusable
 */

/** Environment check (works on both server and client) */
const ENV = process.env.NEXT_PUBLIC_ENVIRONMENT;

const isProduction = ENV === 'production';
const isStaging = ENV === 'staging';
const isDevelopment = ENV === 'development';

/** Request metadata for logging */
interface ApiRequestMetadata {
  endpoint: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  mobile?: string;
  hasAuthorization?: boolean;
}

/** Response metadata for logging */
interface ApiResponseMetadata {
  statusCode: number;
  duration: number;
  dataSize?: number;
}

/** Error metadata for logging */
interface ApiErrorMetadata {
  error: Error;
  duration: number;
  statusCode?: number;
}

/**
 * Sanitize mobile number - show only last 4 digits
 */
function sanitizeMobile(mobile?: string): string | undefined {
  if (!mobile) return undefined;
  if (mobile.length <= 4) return '****';
  return `****${mobile.slice(-4)}`;
}

/**
 * Sanitize authorization token - show only first 4 and last 4 characters
 */
function sanitizeAuthorization(authorization?: string): string | undefined {
  if (!authorization) return undefined;
  if (authorization.length <= 8) return '****';

  const token = authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : authorization;

  return `Bearer ${token.slice(0, 4)}...${token.slice(-4)}`;
}

/**
 * Sanitize headers for logging
 */
function sanitizeHeaders(
  headers?: Record<string, string>
): Record<string, string> | undefined {
  if (!headers) return undefined;

  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === 'authorization') {
      sanitized[key] = sanitizeAuthorization(value) || '[REDACTED]';
    } else if (key.toLowerCase() === 'mobile') {
      sanitized[key] = sanitizeMobile(value) || '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Log API request
 */
function logRequest(metadata: ApiRequestMetadata): void {
  /** Disable request logs in production */
  if (isProduction) return;

  console.group(`🌐 [API] ${metadata.endpoint}`);
  console.log('📡 REQUEST');
  console.log('→ Method:', metadata.method);
  console.log('→ URL:', metadata.url);

  if (metadata.headers) {
    console.log('→ Headers:', sanitizeHeaders(metadata.headers));
  }

  if (metadata.body) {
    console.log('→ Body:', metadata.body);
  }

  if (metadata.mobile) {
    console.log('→ Mobile:', sanitizeMobile(metadata.mobile));
  }

  if (metadata.hasAuthorization !== undefined) {
    console.log('→ Has Authorization:', metadata.hasAuthorization);
  }

  console.groupEnd();
}

/**
 * Log API success response
 */
function logSuccess(endpoint: string, metadata: ApiResponseMetadata): void {
  /** Disable success logs in production */
  if (isProduction) return;

  const statusEmoji =
    metadata.statusCode >= 200 && metadata.statusCode < 300 ? '✅' : '⚠️';

  console.group(`🌐 [API] ${endpoint}`);
  console.log('📩 RESPONSE');
  console.log(
    `← STATUS: ${statusEmoji} ${metadata.statusCode} (${metadata.duration}ms)`
  );

  if (metadata.dataSize) {
    console.log(`← DATA SIZE: ${metadata.dataSize} bytes`);
  }

  console.groupEnd();
}

/**
 * Log API error
 */
function logError(endpoint: string, metadata: ApiErrorMetadata): void {
  if (isProduction) {
    const logData = {
      type: 'api_error',
      endpoint,
      timestamp: new Date().toISOString(),
      error: {
        message: metadata.error.message,
        stack: metadata.error.stack,
        statusCode: metadata.statusCode,
        duration: metadata.duration,
      },
    };

    console.error(JSON.stringify(logData));
  } else {
    console.group(`🌐 [API] ${endpoint}`);
    console.error('❌ ERROR');
    console.error(`← STATUS: ${metadata.statusCode || 'N/A'}`);
    console.error(`← DURATION: ${metadata.duration}ms`);
    console.error(`← MESSAGE: ${metadata.error.message}`);

    if (metadata.error.stack) {
      console.error(`← STACK: ${metadata.error.stack}`);
    }

    console.groupEnd();
  }
}

/**
 * Wrap an API call with logging
 * This is the main hook for logging API calls
 */
export async function withApiLogging<T>(
  endpoint: string,
  requestFn: () => Promise<Response>,
  options: {
    method?: string;
    url: string;
    headers?: Record<string, string>;
    body?: unknown;
    mobile?: string;
    hasAuthorization?: boolean;
  }
): Promise<T> {
  const startTime = Date.now();
  const method = options.method || 'POST';

  logRequest({
    endpoint,
    method,
    url: options.url,
    headers: options.headers,
    body: options.body,
    mobile: options.mobile,
    hasAuthorization: options.hasAuthorization,
  });

  try {
    const response = await requestFn();
    const duration = Date.now() - startTime;

    if (!response.ok) {
      let errorMessage = `API returned ${response.status}`;

      try {
        const errorBody = await response.json();

        if (errorBody?.error) {
          errorMessage = errorBody.error;
        } else if (errorBody?.message) {
          errorMessage = errorBody.message;
        } else if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        }
      } catch {
        /** ignore body parsing error */
      }

      const error = new Error(errorMessage);

      throw Object.assign(error, { status: response.status });
    }

    const data = (await response.json()) as T;

    const dataSize = JSON.stringify(data).length;

    logSuccess(endpoint, {
      statusCode: response.status,
      duration,
      dataSize,
    });

    return data;
  } catch (error) {
    const duration = Date.now() - startTime;

    const apiError = error instanceof Error ? error : new Error(String(error));

    const statusCode =
      error instanceof Error && 'status' in error
        ? (error as { status?: number }).status
        : undefined;

    logError(endpoint, {
      error: apiError,
      duration,
      statusCode,
    });

    throw error;
  }
}