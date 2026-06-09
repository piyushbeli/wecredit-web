import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import React, { Suspense } from 'react';
import EligibilityCheckPageContent from '@/components/eligibility-check/eligibility-check-page-content';
import { PageLoader } from '@/components/shared/page-loader';

export const metadata: Metadata = buildPageMetadata('/bureau-report/');

const EligibilityCheckPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <EligibilityCheckPageContent />
    </Suspense>
  );
};

export default EligibilityCheckPage;
