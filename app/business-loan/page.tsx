import React, { Suspense } from 'react';
import BusinessLoanPageContent from '@/components/business-loan/business-loan-page-content';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { PageLoader } from '@/components/shared/page-loader';

const BusinessLoanPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <BusinessLoanPageContent />
    </Suspense>
  );
};

export default BusinessLoanPage;
