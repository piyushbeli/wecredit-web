/**
 * Strapi API Client
 * Enhanced fetch wrapper with authentication, filtering, and caching
 */

import type { 
  StrapiResponse, 
  Page, 
  PageSummary, 
  PageBase,
  Author, 
  Breadcrumb,
  SidebarWidget,
  CategoryWidget,
  FormWidgetWidget,
  FormWidgetComponent,
} from '@/types/strapi';
import {
  startApiLog,
  completeApiLog,
  errorApiLog,
} from '@/lib/utils/debug-logger';

// Re-export types for convenience
export type { 
  StrapiResponse, 
  Page, 
  PageSummary, 
  PageBase,
  Author, 
  Breadcrumb,
  SidebarWidget,
  CategoryWidget,
  FormWidgetWidget,
  FormWidgetComponent,
};

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export interface FetchOptions {
  populate?: string | Record<string, unknown>;
  fields?: string[];
  filters?: Record<string, unknown>;
  sort?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  status?: 'published' | 'draft';
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Generic fetch function for Strapi API
 */
export async function fetchFromStrapi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    populate,
    fields,
    filters,
    sort,
    pagination,
    status = 'published',
    revalidate = 60,
    tags,
  } = options;

  const params = new URLSearchParams();

  // Handle populate
  if (populate) {
    if (typeof populate === 'string') {
      params.append('populate', populate);
    } else {
      // Flatten populate object for Strapi v5
      const flatPopulate = flattenObject(populate, 'populate');
      Object.entries(flatPopulate).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }
  }

  // Handle fields
  if (fields) {
    fields.forEach((field, i) => params.append(`fields[${i}]`, field));
  }

  // Handle filters
  if (filters) {
    const flatFilters = flattenObject(filters, 'filters');
    Object.entries(flatFilters).forEach(([key, value]) => {
      params.append(key, String(value));
    });
  }

  // Handle sort
  if (sort) {
    sort.forEach((s, i) => params.append(`sort[${i}]`, s));
  }

  // Handle pagination
  if (pagination) {
    if (pagination.page) params.append('pagination[page]', String(pagination.page));
    if (pagination.pageSize) params.append('pagination[pageSize]', String(pagination.pageSize));
  }

  // Publication status (Strapi v5)
  params.append('status', status);

  const url = `${STRAPI_URL}/api/${endpoint}?${params.toString()}`;
  // console.log('[STRAPI URL]', url);

  // Start debug logging
  const startTime = Date.now();
  const logId = startApiLog(endpoint, url, {
    filters,
    populate,
    sort,
    pagination,
    fields,
    revalidate,
    tags,
    hasAuth: Boolean(STRAPI_TOKEN),
  });

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      next: {
        revalidate: revalidate === false ? undefined : revalidate,
        tags,
      },
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(`Strapi API error [${response.status}]: ${errorText}`);
      errorApiLog(logId, error, duration, response.status);
      throw error;
    }

    const data = await response.json();
    const dataSize = JSON.stringify(data).length;

    // Complete debug logging
    completeApiLog(logId, response.status, duration, dataSize);

    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    errorApiLog(logId, error as Error, duration);
    throw error;
  }
}

/**
 * Flatten nested object for URL params
 */
function flattenObject(
  obj: Record<string, unknown>,
  prefix: string = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}[${key}]` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object') {
          Object.assign(result, flattenObject(item as Record<string, unknown>, `${newKey}[${index}]`));
        } else {
          result[`${newKey}[${index}]`] = String(item);
        }
      });
    } else {
      result[newKey] = String(value);
    }
  }

  return result;
}

/**
 * Get full Strapi media URL
 */
export function getStrapiMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${url}`;
}

/**
 * Get optimized image URL with format selection
 */
export function getOptimizedImageUrl(
  media: { url: string; formats?: Record<string, { url: string }> } | undefined | null,
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' = 'medium'
): string {
  if (!media) return '';

  if (size === 'original' || !media.formats) {
    return getStrapiMediaUrl(media.url);
  }

  const format = media.formats[size];
  return getStrapiMediaUrl(format?.url || media.url);
}

