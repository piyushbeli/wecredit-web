
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { STATIC_PAGE_SEO, WEB_SEO_ROUTES } from '@/lib/seo/static-page-seo';
import PageStructuredData from '@/components/seo/page-structured-data';
import { HomePage } from '@/components/home';

export const metadata: Metadata = buildPageMetadata('/');

/**
 * WeCredit Home page with hero carousel, stats, and product sections
 * 
 * PDF Flow Implementation:
 * - Step 2: Generic lenders fetched in TrendingOffersClient (client-side)
 * - Step 3: User-specific lenders fetched in TrendingOffersClient (client-side)
 */
const Home = (): React.ReactNode => {
  return (
    <>
      {/* Keyword-targeted page H1 (visually hidden; hero uses h2s) */}
      <h1 className="sr-only">{STATIC_PAGE_SEO[WEB_SEO_ROUTES.HOME].h1}</h1>
      <PageStructuredData path={WEB_SEO_ROUTES.HOME} faq breadcrumb />
      <HomePage />
    </>
  );
};

export default Home;
