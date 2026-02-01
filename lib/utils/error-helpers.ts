/**
 * Shared error helpers for async/API error handling.
 * Use these so abort vs real errors are handled consistently (see docs/ERROR_HANDLING.md).
 */

/**
 * Returns true when the error is from an aborted request (e.g. AbortController.abort()).
 * Do not update UI state or show toasts for aborted requests; the new request owns the UI.
 */
export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

/**
 * Returns a safe, user-facing message from an unknown error.
 * Use for logging or fallback toast messages.
 */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string') return error;
  return fallback;
}
