/**
 * Safe helpers for reading common fields from unknown API response objects.
 * Use these instead of inline type assertions so parsing is consistent and testable.
 */

/** Safe read of message / error / statusMessage from API response. */
export function getResponseMessage(data: unknown): string | undefined {
  if (typeof data !== 'object' || data === null) return undefined;
  const o = data as { message?: string; error?: string; statusMessage?: string };
  return o.message ?? o.error ?? o.statusMessage;
}

/** Safe read of numeric status from API response. */
export function getResponseStatus(data: unknown): number | undefined {
  if (typeof data !== 'object' || data === null) return undefined;
  return (data as { status?: number }).status;
}

/** Safe read of loan_form_status / loanFormStatus (used by loan status APIs). */
export function getLoanFormStatus(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) return undefined;
  const o = data as { loan_form_status?: unknown; loanFormStatus?: unknown };
  return o.loan_form_status ?? o.loanFormStatus;
}
