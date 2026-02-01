'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import GoldLoanFormModal from './gold-loan-form-modal';

const GoldLoanPageContent = (): React.ReactNode => {
  const router = useRouter();

  const handleCloseModal = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <GoldLoanFormModal onClose={handleCloseModal} />
    </div>
  );
};

export default GoldLoanPageContent;
