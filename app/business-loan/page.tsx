import React, { Suspense } from 'react';
import BusinessLoanPageContent from '@/components/business-loan/business-loan-page-content';

const BusinessLoanPage = (): React.ReactNode => {
  return (
    <Suspense fallback={null}>
      <BusinessLoanPageContent />
    </Suspense>
  );
};

export default BusinessLoanPage;
