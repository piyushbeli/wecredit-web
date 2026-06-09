import type { Metadata } from 'next';
import { STATIC_PAGE_SEO, WEB_SEO_ROUTES } from './static-page-seo';

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

  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_BASE_URL?.replace(/\/$/, '') ?? 'https://wecredit.co.in';

  return {
    title: entry.title,
    description: entry.description,
    alternates: {
      canonical: `${baseUrl}${path}`,
    },
  };
}
