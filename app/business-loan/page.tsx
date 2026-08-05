import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { WEB_SEO_ROUTES } from '@/lib/seo/static-page-seo';
import PageStructuredData from '@/components/seo/page-structured-data';
import React, { Suspense } from 'react';
import BusinessLoanPageContent from '@/components/business-loan/business-loan-page-content';
import { PageLoader } from '@/components/shared/page-loader';
import { PageHeading } from '@/components/shared';

export const metadata: Metadata = buildPageMetadata('/business-loan/');

const BusinessLoanPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <>
        {/* sr-only H1 for SEO; the form modal renders its own step-aware heading */}
        <PageHeading className="sr-only">Business Loan Offers for MSMEs</PageHeading>
        <PageStructuredData path={WEB_SEO_ROUTES.BUSINESS_LOAN} breadcrumb product />
        <BusinessLoanPageContent />
      </>
    </Suspense>
  );
};

export default BusinessLoanPage;
