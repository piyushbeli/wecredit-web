/**
 * SEO Utilities
 * Functions for generating metadata and structured data
 */

import { Metadata } from 'next';
import { Page, getStrapiMediaUrl } from '@/lib/api/strapi';

const getSiteUrl = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  // Server render or missing origin: fall back to a stable default.
  return process.env.NEXT_PUBLIC_WEBSITE_BASE_URL || '';
};
const SITE_NAME = 'WeCredit';
const DEFAULT_OG_IMAGE = '/og-default.jpg';

/**
 * Generate Next.js Metadata from Page
 */
export function generatePageMetadata(page: Page): Metadata {
  const siteUrl = getSiteUrl();
  const seo = page.seo;
  const title = seo?.metaTitle || page.title;
  const description = seo?.metaDescription || page.metaDescription || page.excerpt || '';
  const canonicalUrl = seo?.canonicalUrl || `${siteUrl}${page.fullPath}`;
  const imageUrl = getStrapiMediaUrl(seo?.metaImage?.url || page.featuredImage?.url) || `${siteUrl}${DEFAULT_OG_IMAGE}`;

  const metadata: Metadata = {
    title,
    description,
    keywords: seo?.keywords?.split(',').map((k) => k.trim()),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(page.author && {
        authors: [page.author.name],
      }),
      ...(page.publishedAt && {
        publishedTime: page.publishedAt,
      }),
      ...(page.updatedAt && {
        modifiedTime: page.updatedAt,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  return metadata;
}

/**
 * Generate JSON-LD structured data
 */
export function generateJsonLd(page: Page): Record<string, unknown> | null {
  const siteUrl = getSiteUrl();
  // If custom JSON-LD is provided, use it
  if (page.seo?.scriptApplicationLdJson) {
    try {
      return typeof page.seo.scriptApplicationLdJson === 'string'
        ? JSON.parse(page.seo.scriptApplicationLdJson)
        : page.seo.scriptApplicationLdJson;
    } catch {
      console.warn('Invalid JSON-LD in page:', page.fullPath);
    }
  }

  // Generate default WebPage JSON-LD
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `${siteUrl}${page.fullPath}`,
    name: page.title,
    description: page.seo?.metaDescription || page.metaDescription || page.excerpt,
  };
}
