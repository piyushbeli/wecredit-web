'use client';

/**
 * Client wrapper for the Primepl lead page.
 * Opens the form in a fullscreen modal overlay; background shows when modal is closed.
 */

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PrimeplLeadFormModal from './primepl-lead-form-modal';

const PrimeplLeadPageContent = (): React.ReactNode => {
  const router = useRouter();

  const handleCloseModal = useCallback(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PrimeplLeadFormModal onClose={handleCloseModal} />
    </div>
  );
};

export default PrimeplLeadPageContent;
