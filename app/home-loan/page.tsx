import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
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
        <HomeLoanPageContent />
      </>
    </Suspense>
  );
};

export default HomeLoanPage;
