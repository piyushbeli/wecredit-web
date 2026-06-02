import { fetchStrapi, getStrapiMediaUrl } from '@/lib/strapi/client';
import type { StrapiMedia } from '@/types/strapi';

export type CmsQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | CmsQueryValue[]
  | { [key: string]: CmsQueryValue };

export interface CmsQueryOptions {
  [key: string]: CmsQueryValue;
}

/**
 * Recursively flattens a nested query object into Strapi-compatible key/value pairs.
 * This keeps API callers readable while still producing the URL query syntax Strapi expects.
 */
const flattenQuery = (
  input: CmsQueryValue,
  keyPath: string,
  output: Record<string, string>
): void => {
  if (input === null || input === undefined) {
    return;
  }

  if (Array.isArray(input)) {
    input.forEach((value, index) => {
      flattenQuery(value, `${keyPath}[${index}]`, output);
    });
    return;
  }

  if (typeof input === 'object') {
    Object.entries(input).forEach(([key, value]) => {
      const nextKeyPath = keyPath ? `${keyPath}[${key}]` : key;
      flattenQuery(value, nextKeyPath, output);
    });
    return;
  }

  output[keyPath] = String(input);
};

const normalizeQueryOptions = (options: CmsQueryOptions = {}): Record<string, string> => {
  const params: Record<string, string> = {};

  Object.entries(options).forEach(([key, value]) => {
    flattenQuery(value, key, params);
  });

  return params;
};

export const fetchFromCms = async <T>(
  collection: string,
  options: CmsQueryOptions = {}
): Promise<T> => {
  const params = normalizeQueryOptions(options);
  return fetchStrapi<T>(`/${collection}`, { params });
};

/**
 * Returns a URL for a specific Strapi image format when available, with a safe fallback
 * to the original image URL.
 */
export const getOptimizedImageUrl = (
  media?: StrapiMedia | null,
  size: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
): string => {
  if (!media) {
    return '';
  }

  const optimizedUrl = media.formats?.[size]?.url || media.url;
  return getStrapiMediaUrl(optimizedUrl);
};

export { getStrapiMediaUrl };
