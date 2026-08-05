import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { WEB_SEO_ROUTES } from '@/lib/seo/static-page-seo';
import PageStructuredData from '@/components/seo/page-structured-data';
import React, { Suspense } from 'react';
import CarLoanPageContent from '@/components/car-loan/car-loan-page-content';
import { PageLoader } from '@/components/shared/page-loader';
import { PageHeading } from '@/components/shared';

export const metadata: Metadata = buildPageMetadata('/car-loan/');

const CarLoanPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <>
        {/* sr-only H1 for SEO; the form modal renders its own heading */}
        <PageHeading className="sr-only">Car Loan Offers for New &amp; Used Cars</PageHeading>
        <PageStructuredData path={WEB_SEO_ROUTES.CAR_LOAN} breadcrumb product />
        <CarLoanPageContent />
      </>
    </Suspense>
  );
};

export default CarLoanPage;
