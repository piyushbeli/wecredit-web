import type { MetadataRoute } from 'next';

import { fetchLoanRoutesFromSheet } from '@/lib/sitemap/fetch-loan-routes-from-sheet';
import {
  buildPathSitemapEntries,
  dedupeSitemapEntries,
  getSiteBaseUrl,
} from '@/lib/sitemap/sitemap-utils';
import { shouldAllowSitemap } from '@/lib/utils/seo-utils';

/** Revalidate loans sitemap every minute (matches posts sitemap cadence) */
export const revalidate = 60;

/**
 * Loan pages sitemap at /sitemap-loans/sitemap.xml.
 * Contains only loan source paths from the "Loan Pages" tab in Google Sheet.
 */
export default async function sitemapLoans(): Promise<MetadataRoute.Sitemap> {
  if (!shouldAllowSitemap()) return [];

  const baseUrl = getSiteBaseUrl();
  if (!baseUrl) return [];

  const loanRoutes = await fetchLoanRoutesFromSheet();
  const loanPaths = loanRoutes.map((route) => route.source);

  return dedupeSitemapEntries(
    buildPathSitemapEntries(baseUrl, loanPaths, {
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  );
}
