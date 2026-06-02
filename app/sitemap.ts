import type { MetadataRoute } from 'next';

import { SITEMAP_PATHS } from '@/lib/constants/sitemap-routes';
import { fetchBlogRoutesFromSheet } from '@/lib/sitemap/fetch-blog-routes-from-sheet';
import {
  buildPathSitemapEntries,
  dedupeSitemapEntries,
  getSiteBaseUrl,
  toSitemapUrl,
} from '@/lib/sitemap/sitemap-utils';
import { shouldAllowSitemap } from '@/lib/utils/seo-utils';

/** Revalidate main sitemap daily */
export const revalidate = 86400;

const buildStaticEntries = (baseUrl: string): MetadataRoute.Sitemap => {
  return SITEMAP_PATHS.map((path) => ({
    url: toSitemapUrl(baseUrl, path),
    lastModified: new Date(),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));
};

/**
 * Main sitemap at /sitemap.xml.
 * Static marketing routes plus blog source paths from Google Sheet.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!shouldAllowSitemap()) return [];

  const baseUrl = getSiteBaseUrl();
  if (!baseUrl) return [];

  const staticEntries = buildStaticEntries(baseUrl);
  const blogRoutes = await fetchBlogRoutesFromSheet();
  const blogPaths = blogRoutes.map((route) => route.source);
  const blogEntries = buildPathSitemapEntries(baseUrl, blogPaths, {
    changeFrequency: 'weekly',
    priority: 0.7,
  });

  return dedupeSitemapEntries([...staticEntries, ...blogEntries]);
}
