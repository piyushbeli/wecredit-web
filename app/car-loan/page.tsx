import React, { Suspense } from 'react';
import CarLoanPageContent from '@/components/car-loan/car-loan-page-content';
import { PageLoader } from '@/components/shared/page-loader';

const CarLoanPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <CarLoanPageContent />
    </Suspense>
  );
};

export default CarLoanPage;
