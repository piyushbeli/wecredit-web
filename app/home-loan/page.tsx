import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { WEB_SEO_ROUTES } from '@/lib/seo/static-page-seo';
import PageStructuredData from '@/components/seo/page-structured-data';
import React, { Suspense } from 'react';
import HomeLoanPageContent from '@/components/home-loan/home-loan-page-content';
import { PageLoader } from '@/components/shared/page-loader';

export const metadata: Metadata = buildPageMetadata('/home-loan/');

const HomeLoanPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <>
        {/* sr-only H1 for SEO; the form modal renders its own heading */}
        <h1 className="sr-only">Home Loan Offers & EMI Planning</h1>
        <PageStructuredData path={WEB_SEO_ROUTES.HOME_LOAN} breadcrumb product />
        <HomeLoanPageContent />
      </>
    </Suspense>
  );
};

export default HomeLoanPage;
