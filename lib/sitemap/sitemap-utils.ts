import type { MetadataRoute } from 'next';
import { getWebsiteBaseUrl } from '@/lib/seo/site-metadata';

/** Canonical site origin without trailing slash */
export const getSiteBaseUrl = (): string => {
  return getWebsiteBaseUrl();
};

/**
 * Ensures path has leading and trailing slashes (matches next.config trailingSlash: true).
 */
export const normalizeSitemapPath = (path: string): string => {
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  if (withLeadingSlash === '/') return '/';
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
};

/** Builds absolute sitemap URL with trailing slash (matches trailingSlash: true). */
export const toSitemapUrl = (baseUrl: string, path: string): string => {
  const normalized = normalizeSitemapPath(path);
  if (normalized === '/') return `${baseUrl}/`;
  return `${baseUrl}${normalized}`;
};

export interface PathWithLastModified {
  path: string;
  lastModified?: string | Date;
}

interface PathSitemapOptions {
  changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority?: number;
}

type SitemapPathInput = string | PathWithLastModified;

function formatSitemapDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function resolveSitemapLastModified(value?: string | Date): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatSitemapDateOnly(value);
  }
  if (typeof value === 'string' && value.trim()) {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return formatSitemapDateOnly(parsed);
    }
  }
  return formatSitemapDateOnly(new Date());
}

function isPathWithLastModified(item: SitemapPathInput): item is PathWithLastModified {
  return typeof item !== 'string';
}

/** Builds sitemap entries from relative paths, with optional per-path lastModified. */
export const buildPathSitemapEntries = (
  baseUrl: string,
  paths: SitemapPathInput[],
  options?: PathSitemapOptions
): MetadataRoute.Sitemap => {
  const changeFrequency = options?.changeFrequency ?? 'weekly';
  const priority = options?.priority ?? 0.7;

  return paths.map((item) => {
    const path = isPathWithLastModified(item) ? item.path : item;
    const lastModified = isPathWithLastModified(item)
      ? resolveSitemapLastModified(item.lastModified)
      : formatSitemapDateOnly(new Date());

    return {
      url: toSitemapUrl(baseUrl, path),
      lastModified,
      changeFrequency,
      priority,
    };
  });
};

/** Deduplicates sitemap entries by URL (first occurrence wins). */
export const dedupeSitemapEntries = (
  entries: MetadataRoute.Sitemap
): MetadataRoute.Sitemap => {
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of entries) {
    if (!byUrl.has(entry.url)) {
      byUrl.set(entry.url, entry);
    }
  }
  return Array.from(byUrl.values());
};
