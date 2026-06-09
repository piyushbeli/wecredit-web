import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import React, { Suspense } from 'react';
import BusinessLoanPageContent from '@/components/business-loan/business-loan-page-content';
import { PageLoader } from '@/components/shared/page-loader';

export const metadata: Metadata = buildPageMetadata('/business-loan/');

const BusinessLoanPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <>
        {/* sr-only H1 for SEO; the form modal renders its own step-aware heading */}
        <h1 className="sr-only">Business Loan Offers for MSMEs</h1>
        <BusinessLoanPageContent />
      </>
    </Suspense>
  );
};

export default BusinessLoanPage;
