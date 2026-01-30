import React, { Suspense } from 'react';
import HomeLoanPageContent from '@/components/home-loan/home-loan-page-content';
import { PageLoader } from '@/components/shared/page-loader';

const HomeLoanPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <HomeLoanPageContent />
    </Suspense>
  );
};

export default HomeLoanPage;
