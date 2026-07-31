import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { WEB_SEO_ROUTES } from '@/lib/seo/static-page-seo';
import PageStructuredData from '@/components/seo/page-structured-data';
import React, { Suspense } from 'react';
import GoldLoanPageContent from '@/components/gold-loan/gold-loan-page-content';
import { PageLoader } from '@/components/shared/page-loader';

export const metadata: Metadata = buildPageMetadata('/gold-loan/');

const GoldLoanPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <>
        {/* sr-only H1 for SEO; the form modal renders its own heading */}
        <h1 className="sr-only">Gold Loan Options in India</h1>
        <PageStructuredData path={WEB_SEO_ROUTES.GOLD_LOAN} breadcrumb product />
        <GoldLoanPageContent />
      </>
    </Suspense>
  );
};

export default GoldLoanPage;
