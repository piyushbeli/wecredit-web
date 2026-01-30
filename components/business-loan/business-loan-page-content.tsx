'use client';

/**
 * Client wrapper for the business loan page.
 * Opens the form in a fullscreen modal overlay; background shows when modal is closed.
 */

import { useCallback, useState } from 'react';
import { ActionButton } from '@/components/shared';
import BusinessLoanFormModal from './business-loan-form-modal';
import { useRouter } from 'next/navigation';

const BusinessLoanPageContent = (): React.ReactNode => {
  const router = useRouter();

  const handleCloseModal = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessLoanFormModal onClose={handleCloseModal} />
    </div>
  );
};

export default BusinessLoanPageContent;
