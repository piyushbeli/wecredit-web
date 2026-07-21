import {
  fetchBlogRoutesFromSheet,
} from '@/lib/sitemap/fetch-blog-routes-from-sheet';
import { GOOGLE_SHEET_ROUTES } from '@/lib/constants/google-sheet-routes';
import { createCachedSheetRouteResolver } from '@/lib/sitemap/create-cached-sheet-route-resolver';

/** Fallback when pathname is not in the sheet (matches /blogs redirect target). */
const BLOG_HOME_DESTINATION = 'https://blog.wecredit.co.in/';

const resolveBlogRoute = createCachedSheetRouteResolver({
  cacheTtlMs: GOOGLE_SHEET_ROUTES.CACHE_TTL_MS,
  fetchRoutes: fetchBlogRoutesFromSheet,
});

/**
 * Resolves the external blog URL for an on-site /blog path.
 * Uses a TTL cache so middleware does not fetch the sheet on every request.
 */
export const getBlogDestination = async (pathname: string): Promise<string> => {
  return (await resolveBlogRoute(pathname)) ?? BLOG_HOME_DESTINATION;
};
