'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CarLoanFormModal from './car-loan-form-modal';

const CarLoanPageContent = (): React.ReactNode => {
  const router = useRouter();

  const handleCloseModal = useCallback(() => {
    router.push('/');
  }, [router]);

  return <CarLoanFormModal onClose={handleCloseModal} />;
};

export default CarLoanPageContent;
