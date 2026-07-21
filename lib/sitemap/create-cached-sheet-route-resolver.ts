import type { SheetRouteMapping } from '@/lib/sitemap/fetch-sheet-routes';
import { normalizeSheetSourcePath } from '@/lib/sitemap/fetch-sheet-routes';

interface CachedSheetRouteResolverOptions {
  cacheTtlMs: number;
  fetchRoutes: () => Promise<SheetRouteMapping[]>;
}

interface RouteCache {
  expiresAt: number;
  map: Map<string, string>;
}

export const createCachedSheetRouteResolver = ({
  cacheTtlMs,
  fetchRoutes,
}: CachedSheetRouteResolverOptions): ((pathname: string) => Promise<string | null>) => {
  let routeCache: RouteCache | null = null;
  let refreshPromise: Promise<Map<string, string>> | null = null;

  const refreshRouteMap = (): Promise<Map<string, string>> => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = fetchRoutes()
      .then((routes) => {
        // An empty response commonly means the upstream sheet timed out; retain known routes.
        if (routes.length === 0 && routeCache) {
          routeCache.expiresAt = Date.now() + cacheTtlMs;
          return routeCache.map;
        }

        const map = new Map<string, string>();

        for (const route of routes) {
          const source = normalizeSheetSourcePath(route.source);
          if (source && route.destination) {
            map.set(source, route.destination);
          }
        }

        routeCache = {
          map,
          expiresAt: Date.now() + cacheTtlMs,
        };
        return map;
      })
      .finally(() => {
        refreshPromise = null;
      });

    return refreshPromise;
  };

  const getRouteMap = async (): Promise<Map<string, string>> => {
    if (routeCache && routeCache.expiresAt > Date.now()) {
      return routeCache.map;
    }

    if (routeCache) {
      void refreshRouteMap().catch(() => undefined);
      return routeCache.map;
    }

    return refreshRouteMap();
  };

  return async (pathname: string): Promise<string | null> => {
    const map = await getRouteMap();
    return map.get(normalizeSheetSourcePath(pathname)) ?? null;
  };
};
