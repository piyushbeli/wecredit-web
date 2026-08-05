import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import React, { Suspense } from 'react';
import EligibilityCheckPageContent from '@/components/eligibility-check/eligibility-check-page-content';
import { PageLoader } from '@/components/shared/page-loader';
import { PageHeading } from '@/components/shared';

export const metadata: Metadata = buildPageMetadata('/bureau-report/');

const EligibilityCheckPage = (): React.ReactNode => {
  return (
    <>
      <PageHeading className="sr-only">Check Credit Score &amp; Loan Eligibility</PageHeading>
      <Suspense fallback={<PageLoader />}>
        <EligibilityCheckPageContent />
      </Suspense>
    </>
  );
};

export default EligibilityCheckPage;
