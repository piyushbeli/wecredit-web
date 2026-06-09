import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import React, { Suspense } from 'react';
import CarLoanPageContent from '@/components/car-loan/car-loan-page-content';
import { PageLoader } from '@/components/shared/page-loader';

export const metadata: Metadata = buildPageMetadata('/car-loan/');

const CarLoanPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <>
        {/* sr-only H1 for SEO; the form modal renders its own heading */}
        <h1 className="sr-only">Car Loan Offers for New & Used Cars</h1>
        <CarLoanPageContent />
      </>
    </Suspense>
  );
};

export default CarLoanPage;
