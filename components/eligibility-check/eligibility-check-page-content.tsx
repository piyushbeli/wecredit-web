'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import EligibilityCheckFormModal from './eligibility-check-form-modal';

const EligibilityCheckPageContent = (): React.ReactNode => {
  const router = useRouter();

  const handleCloseModal = useCallback(() => {
    router.push('/');
  }, [router]);

  return <EligibilityCheckFormModal onClose={handleCloseModal} />;
};

export default EligibilityCheckPageContent;
