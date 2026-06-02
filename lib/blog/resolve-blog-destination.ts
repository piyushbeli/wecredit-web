import {
  fetchBlogRoutesFromSheet,
  normalizeBlogSourcePath,
  SHEET_REVALIDATE_SECONDS,
} from '@/lib/sitemap/fetch-blog-routes-from-sheet';

/** Fallback when pathname is not in the sheet (matches /blogs redirect target). */
const BLOG_HOME_DESTINATION = 'https://blog.wecredit.co.in/';

type BlogRouteCache = {
  map: Map<string, string>;
  expiresAt: number;
};

let routeCache: BlogRouteCache | null = null;

const buildRouteMap = async (): Promise<Map<string, string>> => {
  const routes = await fetchBlogRoutesFromSheet();
  const map = new Map<string, string>();

  for (const route of routes) {
    const source = normalizeBlogSourcePath(route.source);
    if (source && route.destination) {
      map.set(source, route.destination);
    }
  }

  return map;
};

const getCachedRouteMap = async (): Promise<Map<string, string>> => {
  const now = Date.now();

  if (routeCache && routeCache.expiresAt > now) {
    return routeCache.map;
  }

  const map = await buildRouteMap();
  routeCache = {
    map,
    expiresAt: now + SHEET_REVALIDATE_SECONDS * 1000,
  };

  return map;
};

/**
 * Resolves the external blog URL for an on-site /blog path.
 * Uses a TTL cache so middleware does not fetch the sheet on every request.
 */
export const getBlogDestination = async (pathname: string): Promise<string> => {
  const normalizedPath = normalizeBlogSourcePath(pathname);
  const map = await getCachedRouteMap();
  return map.get(normalizedPath) ?? BLOG_HOME_DESTINATION;
};
