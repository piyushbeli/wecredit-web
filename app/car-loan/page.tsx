import React, { Suspense } from 'react';
import CarLoanPageContent from '@/components/car-loan/car-loan-page-content';

const CarLoanPage = (): React.ReactNode => {
  return (
    <Suspense fallback={null}>
      <CarLoanPageContent />
    </Suspense>
  );
};

export default CarLoanPage;
