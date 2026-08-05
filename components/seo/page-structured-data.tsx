/**
 * Server component that emits page-level JSON-LD for a canonical route.
 *
 * Reads copy from STATIC_PAGE_SEO so structured data stays in sync with the
 * page's title/description/h1. Renders only the blocks requested via flags.
 */

import JsonLd from './JsonLd';
import { STANDARD_FAQS } from '@/lib/constants/faqs';
import { STATIC_PAGE_SEO, type WEB_SEO_ROUTES } from '@/lib/seo/static-page-seo';
import { buildAbsoluteSiteUrl } from '@/lib/seo/site-metadata';
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildLoanProductJsonLd,
} from '@/lib/seo/structured-data';

interface PageStructuredDataProps {
  /** Canonical trailing-slash path, matching a STATIC_PAGE_SEO key. */
  path: WEB_SEO_ROUTES;
  /** Emit FAQPage schema from the shared FAQ set. */
  faq?: boolean;
  /** Emit a Home → current-page BreadcrumbList. */
  breadcrumb?: boolean;
  /** Emit LoanOrCredit product schema for loan landing pages. */
  product?: boolean;
}

const PageStructuredData = ({
  path,
  faq = false,
  breadcrumb = false,
  product = false,
}: PageStructuredDataProps): React.ReactNode => {
  const entry = STATIC_PAGE_SEO[path];
  if (!entry) return null;

  const pageUrl = buildAbsoluteSiteUrl(path);

  return (
    <>
      {faq && <JsonLd data={buildFaqPageJsonLd(STANDARD_FAQS)} />}
      {breadcrumb && (
        <JsonLd
          data={buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: entry.h1, path },
          ])}
        />
      )}
      {product && (
        <JsonLd
          data={buildLoanProductJsonLd({
            name: entry.h1,
            description: entry.description,
            url: pageUrl,
          })}
        />
      )}
    </>
  );
};

export default PageStructuredData;
