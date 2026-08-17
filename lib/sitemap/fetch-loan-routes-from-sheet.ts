import { GOOGLE_SHEET_ROUTES } from '@/lib/constants/google-sheet-routes';

import {
  fetchRoutesFromSheet,
  normalizeSheetSourcePath,
  type SheetRouteMapping,
  type SheetRoutesRequestOptions,
} from '@/lib/sitemap/fetch-sheet-routes';

export type LoanRouteMapping = SheetRouteMapping;

export const normalizeLoanSourcePath = normalizeSheetSourcePath;

/** Loads loan page sitemap rows from the "Loan Pages" Google Sheet tab. */
export async function fetchLoanRoutesFromSheet(
  options: SheetRoutesRequestOptions = {}
): Promise<LoanRouteMapping[]> {
  return fetchRoutesFromSheet({
    gid: GOOGLE_SHEET_ROUTES.LOANS_GID,
    logLabel: 'fetchLoanRoutesFromSheet',
    requestTimeoutMs: options.requestTimeoutMs,
  });
}
