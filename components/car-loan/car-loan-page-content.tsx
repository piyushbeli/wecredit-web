'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CarLoanFormModal from './car-loan-form-modal';

const CarLoanPageContent = (): React.ReactNode => {
  const router = useRouter();

  const handleCloseModal = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CarLoanFormModal onClose={handleCloseModal} />
    </div>
  );

};

export default CarLoanPageContent;
