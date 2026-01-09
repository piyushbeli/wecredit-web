/**
 * Custom API Exception Classes
 * Provides specific error types for different API failure scenarios
 */

/**
 * Base API exception class
 * All other API exceptions extend from this
 */
export class ApiException extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;

  constructor(message: string, statusCode?: number, code?: string) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Thrown when there is no internet connection
 */
export class NoInternetException extends ApiException {
  constructor(message = 'No internet connection') {
    super(message, undefined, 'NO_INTERNET');
    this.name = 'NoInternetException';
  }
}

/**
 * Thrown when a request times out
 */
export class RequestTimeoutException extends ApiException {
  constructor(message = 'Request timed out') {
    super(message, 408, 'TIMEOUT');
    this.name = 'RequestTimeoutException';
  }
}

/**
 * Thrown when authentication fails (401)
 */
export class UnauthorizedException extends ApiException {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedException';
  }
}

/**
 * Thrown when access is forbidden (403)
 */
export class ForbiddenException extends ApiException {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenException';
  }
}

/**
 * Thrown when a resource is not found (404)
 */
export class NotFoundException extends ApiException {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundException';
  }
}

/**
 * Thrown when the server encounters an error (5xx)
 */
export class ServerException extends ApiException {
  constructor(message = 'Internal server error') {
    super(message, 500, 'SERVER_ERROR');
    this.name = 'ServerException';
  }
}

