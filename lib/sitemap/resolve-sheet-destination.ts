import { GOOGLE_SHEET_ROUTES } from '@/lib/constants/google-sheet-routes';
import { createCachedSheetRouteResolver } from '@/lib/sitemap/create-cached-sheet-route-resolver';
import { fetchProxySheetRoutes } from '@/lib/sitemap/fetch-proxy-sheet-routes';
import { normalizeSheetSourcePath } from '@/lib/sitemap/fetch-sheet-routes';

/** Fallback when a /blog path is not listed in the sheet (matches /blogs redirect target). */
export const BLOG_HOME_DESTINATION = 'https://blog.wecredit.co.in/';

const resolveSheetRoute = createCachedSheetRouteResolver({
  cacheTtlMs: GOOGLE_SHEET_ROUTES.CACHE_TTL_MS,
  fetchRoutes: fetchProxySheetRoutes,
});

/** Exact lookup across Blog + Loan sheet tabs. Returns null when the path is not listed. */
export async function getSheetDestination(pathname: string): Promise<string | null> {
  return resolveSheetRoute(pathname);
}

/**
 * Lookup-first rewrite target for proxy: sheet hit, else blog-home fallback for unknown /blog paths.
 */
export async function getProxyRewriteDestination(pathname: string): Promise<string | null> {
  const normalizedPath = normalizeSheetSourcePath(pathname);
  const sheetDestination = await getSheetDestination(normalizedPath);
  if (sheetDestination) {
    return sheetDestination;
  }
  if (normalizedPath.startsWith('/blog')) {
    return BLOG_HOME_DESTINATION;
  }
  return null;
}
