import { GOOGLE_SHEET_ROUTES } from '@/lib/constants/google-sheet-routes';
import { fetchBlogRoutesFromSheet } from '@/lib/sitemap/fetch-blog-routes-from-sheet';
import { fetchLoanRoutesFromSheet } from '@/lib/sitemap/fetch-loan-routes-from-sheet';
import { fetchPagesRoutesFromSheet } from '@/lib/sitemap/fetch-pages-routes-from-sheet';
import type { SheetRouteMapping } from '@/lib/sitemap/fetch-sheet-routes';
import { normalizeSheetSourcePath } from '@/lib/sitemap/fetch-sheet-routes';

/** Merges Pages + Blog + Loan tab rows into one map; Loan tab wins on duplicate sources. */
export async function fetchProxySheetRoutes(): Promise<SheetRouteMapping[]> {
  const requestOptions = {
    requestTimeoutMs: GOOGLE_SHEET_ROUTES.PROXY_REQUEST_TIMEOUT_MS,
  };
  const [pagesRoutes, blogRoutes, loanRoutes] = await Promise.all([
    fetchPagesRoutesFromSheet(requestOptions),
    fetchBlogRoutesFromSheet(requestOptions),
    fetchLoanRoutesFromSheet(requestOptions),
  ]);
  const routesBySource = new Map<string, SheetRouteMapping>();
  for (const route of pagesRoutes) {
    const source = normalizeSheetSourcePath(route.source);
    if (source && route.destination) {
      routesBySource.set(source, route);
    }
  }
  for (const route of blogRoutes) {
    const source = normalizeSheetSourcePath(route.source);
    if (source && route.destination) {
      routesBySource.set(source, route);
    }
  }
  for (const route of loanRoutes) {
    const source = normalizeSheetSourcePath(route.source);
    if (source && route.destination) {
      routesBySource.set(source, route);
    }
  }
  return Array.from(routesBySource.values());
}
