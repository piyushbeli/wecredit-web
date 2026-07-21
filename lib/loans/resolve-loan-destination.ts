import {
  fetchLoanRoutesFromSheet,
} from '@/lib/sitemap/fetch-loan-routes-from-sheet';
import { GOOGLE_SHEET_ROUTES } from '@/lib/constants/google-sheet-routes';
import { createCachedSheetRouteResolver } from '@/lib/sitemap/create-cached-sheet-route-resolver';

const resolveLoanRoute = createCachedSheetRouteResolver({
  cacheTtlMs: GOOGLE_SHEET_ROUTES.CACHE_TTL_MS,
  fetchRoutes: fetchLoanRoutesFromSheet,
});

/**
 * Resolves the external blog URL for an on-site /loans path.
 * Returns null when the path is not listed in the Google Sheet.
 */
export const getLoanDestination = async (pathname: string): Promise<string | null> => {
  return resolveLoanRoute(pathname);
};
