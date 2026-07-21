'use client';

/**
 * Fullscreen modal for the bureau report / eligibility check form.
 * Uses useLoanModalState for loading → form | success flow, consistent with car/gold loan modals.
 */

import { useCallback, useState } from 'react';
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
import { CreditReportPage } from '../credit-report';
import { isUsableBureauReportResponse } from '@/lib/utils/credit-report-adapter';
import type { EligibilityCheckFormModalProps } from './eligibility-check-form-modal.types';

const EligibilityCheckFormModal = ({
  onClose,
  onSuccess,
  onProcessing,
}: EligibilityCheckFormModalProps): React.ReactNode => {
  const { isAuthenticated, user } = useAuth();
  const [savedValues, setSavedValues] = useState<EligibilityCheckFormValues | null>(null);
  const [bureauResponse, setBureauResponse] = useState<unknown | null>(null);
  useBodyScrollLock(true);

  const checkBureauReportStatus = useCallback(
    async (phoneNumber: string, signal: AbortSignal): Promise<boolean> => {
      const result = await checkEligibilityStatus(phoneNumber, signal);
      const existingValues = getSavedEligibilityValues(result.data);
      setSavedValues(existingValues);
      const hasReport = result.showSuccess && isUsableBureauReportResponse(result.data);
      setBureauResponse(hasReport ? result.data : null);
      return hasReport;
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

  const renderContent = (): React.ReactNode => {
    switch (state) {
      case 'loading':
        return <LoadingScreen />;

      case 'success':
        if (bureauResponse) {
          return (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <CreditReportPage bureauResponse={bureauResponse} />
            </div>
          );
        }
        return (
          <EligibilityCheckForm
            onClose={onClose}
            isModal
            initialValues={savedValues}
            onProcessing={onProcessing ?? onSuccess}
          />
        );

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
