export type AppRouterSearchParams = Record<string, string | string[] | undefined>;

/**
 * Builds a URL path while preserving an existing query string.
 * Keeps one code path for redirect/navigation targets that should retain URL params.
 */
export const buildPathWithQuery = (pathname: string, queryString: string): string => {
  const sanitizedQuery = queryString.trim();
  return sanitizedQuery ? `${pathname}?${sanitizedQuery}` : pathname;
};

/**
 * Serializes Next App Router page `searchParams` object into a query string.
 * Handles repeated query params by appending each value in string arrays.
 */
export const serializeAppRouterSearchParams = (searchParams: AppRouterSearchParams): string => {
  const queryParams = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      queryParams.append(key, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => queryParams.append(key, entry));
    }
  });

  return queryParams.toString();
};
