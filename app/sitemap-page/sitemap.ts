import type { MetadataRoute } from 'next';

import { fetchPagesRoutesFromSheet } from '@/lib/sitemap/fetch-pages-routes-from-sheet';
import {
  buildPathSitemapEntries,
  dedupeSitemapEntries,
  getSiteBaseUrl,
} from '@/lib/sitemap/sitemap-utils';
import { shouldAllowSitemap } from '@/lib/utils/seo-utils';

/** Revalidate pages sitemap every five minutes (matches the sheet cache). */
export const revalidate = 300;

/**
 * Pages sitemap at /sitemap-page.xml.
 * Contains only pages source paths from the "Pages" tab in Google Sheet.
 */
export default async function sitemapPage(): Promise<MetadataRoute.Sitemap> {
  if (!shouldAllowSitemap()) return [];

  const baseUrl = getSiteBaseUrl();
  if (!baseUrl) return [];

  const pageRoutes = await fetchPagesRoutesFromSheet();
  const pagePaths = pageRoutes
    .filter((route) => route.showInSitemap === true)
    .map((route) => route.source);

  return dedupeSitemapEntries(
    buildPathSitemapEntries(baseUrl, pagePaths, {
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  );
}
