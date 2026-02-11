'use client';

/**
 * Fullscreen modal for the bureau report / eligibility check form.
 * Uses useLoanModalState for loading → form | success flow, consistent with car/gold loan modals.
 */

import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { useLoanModalState } from '@/hooks/use-loan-modal-state';
import { checkEligibilityStatus } from '@/lib/api/eligibility-check-service';
import { SuccessScreen } from '@/components/shared';
import EligibilityCheckForm from './eligibility-check-form';
import { LoadingScreen } from '../shared/loading-screen';

interface EligibilityCheckFormModalProps {
  onClose: () => void;
}

/** Adapter: hook expects (phone, signal) => Promise<boolean>; service returns { showSuccess }. */
async function checkBureauReportStatus(
  phoneNumber: string,
  signal: AbortSignal
): Promise<boolean> {
  const result = await checkEligibilityStatus(phoneNumber, signal);
  return result.showSuccess;
}

const EligibilityCheckFormModal = ({
  onClose,
}: EligibilityCheckFormModalProps): React.ReactNode => {
  const { isAuthenticated, user } = useAuth();
  useBodyScrollLock(true);

  const isReady = isAuthenticated && !!user?.phoneNumber;
  const { state, transitionToSuccess } = useLoanModalState({
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
        return (
          <SuccessScreen
            title="Your details have been successfully submitted."
            description="We're processing your request."
            ctaLabel="Continue to Homepage"
            onCtaClick={onClose}
            variant="sticky"
            primaryIcon={<CheckCircle2 className="w-14 h-14 text-green-500 mb-6" />}
          />
        );

      case 'form':
        return (
          <EligibilityCheckForm
            onClose={onClose}
            isModal
            onSuccess={transitionToSuccess}
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
