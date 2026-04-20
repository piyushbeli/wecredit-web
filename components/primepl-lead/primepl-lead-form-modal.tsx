'use client';

/**
 * Fullscreen modal for the Primepl lead form.
 * Same flow as other loan modals: status check → form | success, plus post-OTP event.
 */

import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { useLoanModalState } from '@/hooks/use-loan-modal-state';
import { fetchPrimeplLeadStatus } from '@/lib/api/primepl-lead-service';
import { PRIMEPL_LEAD_SUBMIT_SUCCESS_EVENT } from '@/lib/constants/events';
import { SuccessScreen } from '@/components/shared';
import { LoadingScreen } from '../shared/loading-screen';
import PrimeplLeadForm from './primepl-lead-form';

interface PrimeplLeadFormModalProps {
  onClose: () => void;
}

async function checkPrimeplLeadStatus(
  phoneNumber: string,
  signal: AbortSignal
): Promise<boolean> {
  const result = await fetchPrimeplLeadStatus(phoneNumber, signal);
  return result.hasExistingLead;
}

const PrimeplLeadFormModal = ({ onClose }: PrimeplLeadFormModalProps): React.ReactNode => {
  const { isAuthenticated, user } = useAuth();
  useBodyScrollLock(true);

  const isReady = isAuthenticated && !!user?.phoneNumber;
  const { state, transitionToSuccess } = useLoanModalState({
    checkStatus: checkPrimeplLeadStatus,
    loadingMessage: 'Checking your status...',
    loadingSubtext: 'Please wait while we fetch your details.',
    isReady,
    phoneNumber: user?.phoneNumber,
  });

  useEffect(() => {
    const handler = (): void => transitionToSuccess();
    window.addEventListener(PRIMEPL_LEAD_SUBMIT_SUCCESS_EVENT, handler);
    return () => window.removeEventListener(PRIMEPL_LEAD_SUBMIT_SUCCESS_EVENT, handler);
  }, [transitionToSuccess]);

  const renderContent = (): React.ReactNode => {
    switch (state) {
      case 'loading':
        return <LoadingScreen />;

      case 'success':
        return (
          <SuccessScreen
            title="THANK YOU FOR YOUR REQUEST!"
            description="We'll get in touch with you shortly to guide you through the next steps."
            ctaLabel="Continue to Homepage"
            onCtaClick={onClose}
            variant="sticky"
            primaryIcon={<CheckCircle2 className="w-14 h-14 text-green-500 mb-6" />}
          />
        );

      case 'form':
        return <PrimeplLeadForm isModal onSuccess={transitionToSuccess} />;

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

export default PrimeplLeadFormModal;
