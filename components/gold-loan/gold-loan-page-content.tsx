'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import GoldLoanFormModal from './gold-loan-form-modal';

const GoldLoanPageContent = (): React.ReactNode => {
  const router = useRouter();

  const handleCloseModal = useCallback(() => {
    router.push('/');
  }, [router]);

  return <GoldLoanFormModal onClose={handleCloseModal} />;
};

export default GoldLoanPageContent;
