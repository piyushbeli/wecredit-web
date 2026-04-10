import React, { Suspense } from 'react';
import PrimeplLeadPageContent from '@/components/primepl-lead/primepl-lead-page-content';
import { PageLoader } from '@/components/shared/page-loader';

const PrimeplLeadPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <PrimeplLeadPageContent />
    </Suspense>
  );
};

export default PrimeplLeadPage;
