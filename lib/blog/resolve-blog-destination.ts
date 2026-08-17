import { GOOGLE_SHEET_ROUTES } from '@/lib/constants/google-sheet-routes';
import { fetchBlogRoutesFromSheet } from '@/lib/sitemap/fetch-blog-routes-from-sheet';
import { createCachedSheetRouteResolver } from '@/lib/sitemap/create-cached-sheet-route-resolver';
import { BLOG_HOME_DESTINATION } from '@/lib/sitemap/resolve-sheet-destination';

const resolveBlogRoute = createCachedSheetRouteResolver({
  cacheTtlMs: GOOGLE_SHEET_ROUTES.CACHE_TTL_MS,
  fetchRoutes: () => fetchBlogRoutesFromSheet({
    requestTimeoutMs: GOOGLE_SHEET_ROUTES.PROXY_REQUEST_TIMEOUT_MS,
  }),
});

/**
 * Resolves the external blog URL for an on-site path listed on the Blog Pages sheet tab.
 * Uses a TTL cache so middleware does not fetch the sheet on every request.
 */
export const getBlogDestination = async (pathname: string): Promise<string> => {
  return (await resolveBlogRoute(pathname)) ?? BLOG_HOME_DESTINATION;
};

export { BLOG_HOME_DESTINATION };
