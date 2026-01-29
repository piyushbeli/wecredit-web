import React, { Suspense } from 'react';
import HomeLoanPageContent from '@/components/home-loan/home-loan-page-content';

const HomeLoanPage = (): React.ReactNode => {
  return (
    <Suspense fallback={null}>
      <HomeLoanPageContent />
    </Suspense>
  );
};

export default HomeLoanPage;
