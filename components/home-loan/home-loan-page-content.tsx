'use client';

/**
 * Client wrapper for the home loan page.
 * Opens the form in a fullscreen modal overlay; background shows when modal is closed.
 */

import { useCallback } from 'react';
import HomeLoanFormModal from './home-loan-form-modal';
import { useRouter } from 'next/navigation';

const HomeLoanPageContent = (): React.ReactNode => {
  const router = useRouter();

  const handleCloseModal = useCallback(() => {
    router.push('/');
  }, [router]);

  return <HomeLoanFormModal onClose={handleCloseModal} />;
};

export default HomeLoanPageContent;
