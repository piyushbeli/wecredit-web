/**
 * Strapi API Client
 * Base fetch wrapper with authentication and error handling
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/** Custom error for Strapi API failures */
export class StrapiError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'StrapiError';
  }
}

/** Options for Strapi fetch requests */
export interface FetchStrapiOptions {
  /** Cache revalidation time in seconds (set to 0 for no cache) */
  revalidate?: number;
  /** Additional query parameters */
  params?: Record<string, string>;
  /** Publication status filter (defaults to 'published') */
  status?: 'published' | 'draft';
}

/**
 * Fetches data from Strapi API
 * @param endpoint - API endpoint (e.g., '/articles')
 * @param options - Fetch options
 * @returns Parsed JSON response
 */
export async function fetchStrapi<T>(
  endpoint: string,
  options: FetchStrapiOptions = {}
): Promise<T> {
  // No FE caching: default revalidate to 0 so Next does not cache Strapi responses.
  const { revalidate = 0, params, status = 'published' } = options;
  const allParams = { ...params, status };
  const url = buildUrl(endpoint, allParams);
  const headers = buildHeaders();
  // console.log('[STRAPI CLIENT URL]', url);
  const response = await fetch(url, {
    headers,
    cache: 'no-store',
    ...(revalidate !== undefined && { next: { revalidate } }),
  });
  if (!response.ok) {
    throw new StrapiError(
      `Strapi API error: ${response.statusText}`,
      response.status,
      endpoint
    );
  }
  return response.json();
}

/**
 * Builds the full URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(`/api${endpoint}`, STRAPI_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
}

/**
 * Builds request headers with authentication
 */
function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }
  return headers;
}

/**
 * Gets the full URL for a Strapi media asset
 */
export function getStrapiMediaUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

