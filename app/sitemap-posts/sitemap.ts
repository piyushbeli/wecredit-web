import type { MetadataRoute } from 'next';

import { fetchBlogRoutesFromSheet } from '@/lib/sitemap/fetch-blog-routes-from-sheet';
import {
  buildPathSitemapEntries,
  dedupeSitemapEntries,
  getSiteBaseUrl,
} from '@/lib/sitemap/sitemap-utils';
import { shouldAllowSitemap } from '@/lib/utils/seo-utils';

/** Revalidate posts sitemap daily */
export const revalidate = 86400;

/**
 * Blog posts sitemap at /sitemap-posts/sitemap.xml.
 * Contains only blog source paths from Google Sheet.
 */
export default async function sitemapPosts(): Promise<MetadataRoute.Sitemap> {
  if (!shouldAllowSitemap()) return [];

  const baseUrl = getSiteBaseUrl();
  if (!baseUrl) return [];

  const blogRoutes = await fetchBlogRoutesFromSheet();
  const blogPaths = blogRoutes.map((route) => route.source);

  return dedupeSitemapEntries(
    buildPathSitemapEntries(baseUrl, blogPaths, {
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  );
}
