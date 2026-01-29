'use client';

/**
 * Client wrapper for the car loan page.
 * Opens the form in a fullscreen modal overlay; background shows when modal is closed.
 */

import { useCallback, useState } from 'react';
import { ActionButton } from '@/components/shared';
import CarLoanFormModal from './car-loan-form-modal';

const CarLoanPageContent = (): React.ReactNode => {
  const [isOpen, setIsOpen] = useState(true);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <div className="min-h-screen bg-gray-50">
      {!isOpen && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Car Loan</h1>
          <p className="text-gray-600 text-center mb-6">
            Apply for a car loan to get the best offers from our partner lenders.
          </p>
          <ActionButton onClick={openModal} className="min-w-[200px]">
            Apply for Car Loan
          </ActionButton>
        </div>
      )}

      <CarLoanFormModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default CarLoanPageContent;
