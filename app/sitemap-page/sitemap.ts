import type { MetadataRoute } from 'next';

import { SITEMAP_PATHS } from '@/lib/constants/sitemap-routes';
import {
  getSiteBaseUrl,
  toSitemapUrl,
} from '@/lib/sitemap/sitemap-utils';
import { shouldAllowSitemap } from '@/lib/utils/seo-utils';

/** Revalidate pages sitemap daily */
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
 * Static marketing pages sitemap at /sitemap-page.xml.
 * Linked from the parent sitemap index at /sitemap.xml.
 */
export default async function sitemapPage(): Promise<MetadataRoute.Sitemap> {
  if (!shouldAllowSitemap()) return [];

  const baseUrl = getSiteBaseUrl();
  if (!baseUrl) return [];

  return buildStaticEntries(baseUrl);
}
