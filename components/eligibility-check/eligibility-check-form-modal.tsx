'use client';

/**
 * Fullscreen modal for the bureau report / eligibility check form.
 * Uses useLoanModalState for loading → form | success flow, consistent with car/gold loan modals.
 */

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { useLoanModalState } from '@/hooks/use-loan-modal-state';
import {
  checkEligibilityStatus,
  getSavedEligibilityValues,
} from '@/lib/api/eligibility-check-service';
import type { EligibilityCheckFormValues } from './eligibility-check-form.config';
import EligibilityCheckForm from './eligibility-check-form';
import { LoadingScreen } from '../shared/loading-screen';

interface EligibilityCheckFormModalProps {
  onClose: () => void;
  /** Called when bureau submit (or existing status) succeeds — typically navigate to credit score. */
  onSuccess?: () => void;
  onProcessing?: () => void;
}

const EligibilityCheckFormModal = ({
  onClose,
  onSuccess,
  onProcessing,
}: EligibilityCheckFormModalProps): React.ReactNode => {
  const { isAuthenticated, user } = useAuth();
  const [savedValues, setSavedValues] = useState<EligibilityCheckFormValues | null>(null);
  useBodyScrollLock(true);

  const checkBureauReportStatus = useCallback(
    async (phoneNumber: string, signal: AbortSignal): Promise<boolean> => {
      const result = await checkEligibilityStatus(phoneNumber, signal);
      const existingValues = getSavedEligibilityValues(result.data);
      setSavedValues(existingValues);
      return result.showSuccess && !existingValues;
    },
    []
  );

  const isReady = isAuthenticated && !!user?.phoneNumber;
  const { state } = useLoanModalState({
    checkStatus: checkBureauReportStatus,
    loadingMessage: 'Checking your bureau report status...',
    loadingSubtext: 'Please wait while we fetch your details.',
    isReady,
    phoneNumber: user?.phoneNumber,
  });

  useEffect(() => {
    if (state === 'success' && onSuccess) {
      onSuccess();
    }
  }, [state, onSuccess]);

  const renderContent = (): React.ReactNode => {
    switch (state) {
      case 'loading':
        return <LoadingScreen />;

      case 'success':
        return <LoadingScreen />;

      case 'form':
        return (
          <EligibilityCheckForm
            onClose={onClose}
            isModal
            initialValues={savedValues}
            onProcessing={onProcessing}
          />
        );

      default:
        return <LoadingScreen />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {renderContent()}
    </div>
  );
};

export default EligibilityCheckFormModal;
