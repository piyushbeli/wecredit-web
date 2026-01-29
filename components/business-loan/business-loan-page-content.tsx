'use client';

/**
 * Client wrapper for the business loan page.
 * Opens the form in a fullscreen modal overlay; background shows when modal is closed.
 */

import { useCallback, useState } from 'react';
import { ActionButton } from '@/components/shared';
import BusinessLoanFormModal from './business-loan-form-modal';

const BusinessLoanPageContent = (): React.ReactNode => {
  const [isOpen, setIsOpen] = useState(true);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background when modal is closed */}
      {!isOpen && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Business Loan</h1>
          <p className="text-gray-600 text-center mb-6">
            Apply for a business loan to get the best offers from our partner lenders.
          </p>
          <ActionButton onClick={openModal} className="min-w-[200px]">
            Apply for Business Loan
          </ActionButton>
        </div>
      )}

      <BusinessLoanFormModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default BusinessLoanPageContent;
