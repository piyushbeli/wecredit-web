import type { Metadata } from 'next';
import { STATIC_PAGE_SEO, WEB_SEO_ROUTES } from './static-page-seo';
import { buildAbsoluteSiteUrl, OG_IMAGE_URL } from './site-metadata';

/**
 * Builds Next.js Metadata for a given canonical path.
 * Uses NEXT_PUBLIC_WEBSITE_BASE_URL (same env var used by robots.ts and sitemap-utils.ts).
 * Falls back to the production domain if the env var is not set.
 *
 * @param path - Trailing-slash path matching the entry in STATIC_PAGE_SEO (e.g. '/about-us/')
 */
export function buildPageMetadata(path: string): Metadata {
  const entry = STATIC_PAGE_SEO[path as WEB_SEO_ROUTES];

  if (!entry) {
    return {};
  }

  const pageUrl = buildAbsoluteSiteUrl(path);

  return {
    title: entry.title,
    description: entry.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: pageUrl,
      siteName: 'WeCredit',
      type: 'website',
      images: [
        {
          url: OG_IMAGE_URL,
          alt: 'WeCredit',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.title,
      description: entry.description,
      images: [OG_IMAGE_URL],
    },
  };
}
