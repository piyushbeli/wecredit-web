import type { MetadataRoute } from 'next';

import { fetchBlogRoutesFromSheet } from '@/lib/sitemap/fetch-blog-routes-from-sheet';
import {
  buildPathSitemapEntries,
  dedupeSitemapEntries,
  getSiteBaseUrl,
} from '@/lib/sitemap/sitemap-utils';
import { shouldAllowSitemap } from '@/lib/utils/seo-utils';

/** Revalidate posts sitemap every five minutes (matches the sheet cache). */
export const revalidate = 300;

/**
 * Blog posts sitemap at /sitemap-posts/sitemap.xml.
 * Contains all source paths from the "Blog Pages" tab in Google Sheet.
 */
export default async function sitemapPosts(): Promise<MetadataRoute.Sitemap> {
  if (!shouldAllowSitemap()) return [];

  const baseUrl = getSiteBaseUrl();
  if (!baseUrl) return [];

  const blogRoutes = await fetchBlogRoutesFromSheet();
  const blogPaths = blogRoutes
    .filter((route) => route.showInSitemap === true)
    .map((route) => ({
      path: route.source,
      lastModified: route.modifiedDate,
    }));

  return dedupeSitemapEntries(buildPathSitemapEntries(baseUrl, blogPaths));
}
