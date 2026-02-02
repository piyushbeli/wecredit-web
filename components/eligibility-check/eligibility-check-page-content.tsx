'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import EligibilityCheckFormModal from './eligibility-check-form-modal';

const EligibilityCheckPageContent = (): React.ReactNode => {
  const router = useRouter();

  const handleCloseModal = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <EligibilityCheckFormModal onClose={handleCloseModal} />
    </div>
  );
};

export default EligibilityCheckPageContent;
