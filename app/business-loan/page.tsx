import React, { Suspense } from 'react';
import BusinessLoanForm from '@/components/business-loan/business-loan-form';

const BusinessLoanPage = (): React.ReactNode => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={null}>
        <BusinessLoanForm />
      </Suspense>
    </div>
  );
};

export default BusinessLoanPage;
