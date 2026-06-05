import type { MetadataRoute } from 'next';

/** Canonical site origin without trailing slash */
export const getSiteBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_WEBSITE_BASE_URL?.replace(/\/$/, '') ?? '';
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

interface PathSitemapOptions {
  changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority?: number;
}

/** Builds sitemap entries from relative paths */
export const buildPathSitemapEntries = (
  baseUrl: string,
  paths: string[],
  options?: PathSitemapOptions
): MetadataRoute.Sitemap => {
  const changeFrequency = options?.changeFrequency ?? 'weekly';
  const priority = options?.priority ?? 0.7;

  return paths.map((path) => ({
    url: toSitemapUrl(baseUrl, path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
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
