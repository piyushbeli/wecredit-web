import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import PrimeplLeadPageContent from '@/components/primepl-lead/primepl-lead-page-content';
import { PageLoader } from '@/components/shared/page-loader';

// Campaign lead-capture page — keep it out of the index.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

const PrimeplLeadPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <PrimeplLeadPageContent />
    </Suspense>
  );
};

export default PrimeplLeadPage;
