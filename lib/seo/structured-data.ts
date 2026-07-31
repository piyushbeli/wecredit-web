/**
 * JSON-LD structured-data builders.
 *
 * Pure functions returning plain objects rendered server-side via
 * `components/seo/JsonLd.tsx`. Keeping the schema here (not inline in pages)
 * avoids duplicating the same objects across routes.
 */

import type { FaqItem } from '@/lib/constants/faqs';
import { BRAND_LOGO_URL, OG_IMAGE_URL, buildAbsoluteSiteUrl } from './site-metadata';

/** Stable production identifier for the organization node. */
const ORGANIZATION_ID = 'https://wecredit.co.in/#organization';

export type BreadcrumbSegment = {
  name: string;
  path: string;
};

export type LoanProductInput = {
  name: string;
  description: string;
  url: string;
};

/**
 * Organization (FinancialService) schema.
 * Approved verbatim; logo/image use the live transparent WeCredit logo.
 */
export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': ORGANIZATION_ID,
    name: 'WeCredit',
    url: 'https://wecredit.co.in/',
    logo: BRAND_LOGO_URL,
    image: BRAND_LOGO_URL,
    description:
      'WeCredit is an online loan and credit marketplace in India, helping users compare personal loans, business loans, home loans, gold loans, car loans and credit cards from multiple lenders and apply online.',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    sameAs: [
      'https://x.com/Wecredit136650',
      'https://www.linkedin.com/company/we-credit',
      'https://www.facebook.com/people/Wecredit/61550321134539/',
      'https://www.youtube.com/@WeCredit',
      'https://www.instagram.com/we_credit/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'care@wecredit.co.in',
      telephone: '+91-9240259585',
      areaServed: 'IN',
    },
  };
}

/**
 * FAQPage schema from the shared FAQ data. Surfaces answers to crawlers even
 * when the accordion is collapsed.
 */
export function buildFaqPageJsonLd(faqs: FaqItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList schema. `path` values are canonical site-relative paths
 * (e.g. '/personal-loan/'); absolute URLs are derived from the site base URL.
 */
export function buildBreadcrumbJsonLd(
  segments: BreadcrumbSegment[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((segment, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: segment.name,
      item: buildAbsoluteSiteUrl(segment.path),
    })),
  };
}

/**
 * LoanOrCredit product schema for loan landing pages, linked to the org node.
 */
export function buildLoanProductJsonLd(
  input: LoanProductInput
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LoanOrCredit',
    name: input.name,
    description: input.description,
    url: input.url,
    image: OG_IMAGE_URL,
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    provider: {
      '@type': 'FinancialService',
      '@id': ORGANIZATION_ID,
      name: 'WeCredit',
    },
  };
}
