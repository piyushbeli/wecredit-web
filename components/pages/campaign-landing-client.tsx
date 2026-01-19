'use client';

/**
 * Campaign Landing Client
 * Handles the interactive landing UI and auto-opening of the LeadFormModal
 */

import { useEffect } from 'react';
import { useModal } from '@/hooks/use-modal';
import LeadFormModal from '@/components/forms/lead-form-modal';
import { ActionButton } from '@/components/shared';

interface CampaignLandingClientProps {
  lenderName: string;
  partnerCode: string;
}

export const CampaignLandingClient = ({
  lenderName,
  partnerCode,
}: CampaignLandingClientProps) => {
  const { isOpen: isFormOpen, openModal: openForm, closeModal: closeForm } = useModal();

  const lenderInitial = lenderName?.charAt(0).toUpperCase() || 'L';
  const displayLenderName = lenderName || 'Lender';

  // Auto-open form on mount
  useEffect(() => {
    if (lenderName) {
      openForm();
    }
  }, [lenderName, openForm]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Placeholder UI while modal is opening or if closed */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-blue-600">
              {lenderInitial}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Loan Application
          </h1>
          <p className="text-gray-600">
            Apply for a personal loan from{' '}
            <span className="font-semibold capitalize text-blue-600">{displayLenderName}</span>
          </p>
        </div>

        <ActionButton
          type="button"
          onClick={openForm}
          fullWidth
          className="h-14 text-base font-medium"
        >
          Check Eligibility
        </ActionButton>

        <p className="mt-6 text-sm text-gray-400">
          Takes less than 2 minutes to get an offer
        </p>
      </div>

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        lenderName={lenderName}
        partnerCode={partnerCode}
      />
    </div>
  );
};
