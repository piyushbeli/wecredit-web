'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_CREDIT_SCORE_FETCH_PENDING } from '@/lib/constants/api-keys';
import { CREDIT_REPORT_PATH } from '@/lib/constants/credit-report-routes';
import EligibilityCheckFormModal from './eligibility-check-form-modal';

const EligibilityCheckPageContent = (): React.ReactNode => {
  const router = useRouter();

  const handleCloseModal = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleSuccess = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_CREDIT_SCORE_FETCH_PENDING, '1');
    }
    router.replace(CREDIT_REPORT_PATH);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <EligibilityCheckFormModal onClose={handleCloseModal} onSuccess={handleSuccess} />
    </div>
  );
};

export default EligibilityCheckPageContent;
