import { NextResponse } from 'next/server';

import { SITEMAP_CHILD_PATHS } from '@/lib/constants/sitemap-child-paths';
import { buildSitemapIndexXml } from '@/lib/sitemap/build-sitemap-index';
import { getSiteBaseUrl } from '@/lib/sitemap/sitemap-utils';
import { shouldAllowSitemap } from '@/lib/utils/seo-utils';

/** Revalidate parent sitemap index daily */
export const revalidate = 86400;

const xmlResponse = (xml: string): NextResponse => {
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};

/**
 * Parent sitemap index at /sitemap.xml.
 * Links to child sitemaps for static pages and blog posts.
 */
export async function GET(): Promise<NextResponse> {
  if (!shouldAllowSitemap()) {
    return xmlResponse(buildSitemapIndexXml([]));
  }

  const baseUrl = getSiteBaseUrl();
  if (!baseUrl) {
    return xmlResponse(buildSitemapIndexXml([]));
  }

  const childSitemapUrls = [
    `${baseUrl}${SITEMAP_CHILD_PATHS.pages}`,
    `${baseUrl}${SITEMAP_CHILD_PATHS.posts}`,
  ];

  return xmlResponse(buildSitemapIndexXml(childSitemapUrls));
}
