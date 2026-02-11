'use client';

/**
 * Fullscreen modal for the home loan form.
 * Overlays the page like BusinessLoanFormModal; use isOpen/onClose to control visibility.
 */

import { useEffect } from 'react';
import { CheckCircle2, Home } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { useLoanModalState } from '@/hooks/use-loan-modal-state';
import { fetchHomeLoanStatus } from '@/lib/api/home-loan-service';
import { SuccessScreen } from '@/components/shared';
import HomeLoanForm from './home-loan-form';
import { LoadingScreen } from '../shared/loading-screen';
import { HOME_LOAN_SUBMIT_SUCCESS_EVENT } from '@/lib/constants/events';

interface HomeLoanFormModalProps {
  onClose: () => void;
}

/** Adapter: hook expects (phone, signal) => Promise<boolean>; service returns { hasExistingLead }. */
async function checkHomeLoanStatus(
  phoneNumber: string,
  signal: AbortSignal
): Promise<boolean> {
  const result = await fetchHomeLoanStatus(phoneNumber, signal);
  return result.hasExistingLead;
}

const HomeLoanFormModal = ({ onClose }: HomeLoanFormModalProps): React.ReactNode => {
  const { isAuthenticated, user } = useAuth();
  useBodyScrollLock(true);

  const isReady = isAuthenticated && !!user?.phoneNumber;
  const { state, transitionToSuccess } = useLoanModalState({
    checkStatus: checkHomeLoanStatus,
    loadingMessage: 'Checking your home loan status...',
    loadingSubtext: 'Please wait while we fetch your details.',
    isReady,
    phoneNumber: user?.phoneNumber,
  });

  // After guest OTP verification, usePostLogin submits and dispatches this event.
  useEffect(() => {
    const handler = (): void => transitionToSuccess();
    window.addEventListener(HOME_LOAN_SUBMIT_SUCCESS_EVENT, handler);
    return () => window.removeEventListener(HOME_LOAN_SUBMIT_SUCCESS_EVENT, handler);
  }, [transitionToSuccess]);

  const renderContent = (): React.ReactNode => {
    switch (state) {
      case 'loading':
        return <LoadingScreen />;

      case 'success':
        return (
          <SuccessScreen
            title="THANK YOU FOR SUBMITTING YOUR HOME LOAN REQUEST!"
            description="We'll get in touch with you shortly to guide you through the next steps."
            ctaLabel="Continue to Homepage"
            onCtaClick={onClose}
            variant="sticky"
            primaryIcon={
              <div className="rounded-full bg-blue-50 p-4">
                <Home className="w-12 h-12 text-blue-600" />
              </div>
            }
            secondaryIcon={<CheckCircle2 className="w-10 h-10 text-green-500" />}
          />
        );

      case 'form':
        return (
          <HomeLoanForm
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

export default HomeLoanFormModal;
