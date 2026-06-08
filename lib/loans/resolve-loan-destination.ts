import {
  fetchLoanRoutesFromSheet,
} from '@/lib/sitemap/fetch-loan-routes-from-sheet';
import { normalizeSheetSourcePath } from '@/lib/sitemap/fetch-sheet-routes';

type LoanRouteCache = {
  map: Map<string, string>;
  expiresAt: number;
};

let routeCache: LoanRouteCache | null = null;

const buildRouteMap = async (): Promise<Map<string, string>> => {
  const routes = await fetchLoanRoutesFromSheet();
  const map = new Map<string, string>();

  for (const route of routes) {
    const source = normalizeSheetSourcePath(route.source);
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
    expiresAt: now + 60 * 1000, // every 1 minute
  };

  return map;
};

/**
 * Resolves the external blog URL for an on-site /loans path.
 * Returns null when the path is not listed in the Google Sheet.
 */
export const getLoanDestination = async (pathname: string): Promise<string | null> => {
  const normalizedPath = normalizeSheetSourcePath(pathname);
  const map = await getCachedRouteMap();
  return map.get(normalizedPath) ?? null;
};
