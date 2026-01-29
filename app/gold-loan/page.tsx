import React, { Suspense } from 'react';
import GoldLoanPageContent from '@/components/gold-loan/gold-loan-page-content';

const GoldLoanPage = (): React.ReactNode => {
  return (
    <Suspense fallback={null}>
      <GoldLoanPageContent />
    </Suspense>
  );
};

export default GoldLoanPage;
