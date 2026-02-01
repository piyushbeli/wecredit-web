'use client';

/**
 * Fullscreen modal for the car loan form.
 * Overlays the page like HomeLoanFormModal; use isOpen/onClose to control visibility.
 */

import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLoanModalState } from '@/hooks/use-loan-modal-state';
import { fetchCarLoanStatus } from '@/lib/api/car-loan-service';
import { SuccessScreen } from '@/components/shared';
import CarLoanForm from './car-loan-form';
import { LoadingScreen } from '../shared/loading-screen';

interface CarLoanFormModalProps {
  onClose: () => void;
}

/** Adapter: hook expects (phone, signal) => Promise<boolean>; service returns { hasExistingLead }. */
async function checkCarLoanStatus(
  phoneNumber: string,
  signal: AbortSignal
): Promise<boolean> {
  const result = await fetchCarLoanStatus(phoneNumber, signal);
  return result.hasExistingLead;
}

const CarLoanFormModal = ({ onClose }: CarLoanFormModalProps): React.ReactNode => {
  const { isAuthenticated, user } = useAuth();

  const isReady = isAuthenticated && !!user?.phoneNumber;
  const { state, transitionToSuccess } = useLoanModalState({
    checkStatus: checkCarLoanStatus,
    loadingMessage: 'Checking your car loan status...',
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
            title="THANK YOU FOR SUBMITTING YOUR CAR LOAN REQUEST!"
            description="We'll get in touch with you shortly to guide you through the next steps."
            ctaLabel="Continue to Homepage"
            onCtaClick={onClose}
            variant="sticky"
            primaryIcon={<CheckCircle2 className="w-14 h-14 text-green-500 mb-6" />}
          />
        );

      case 'form':
        return (
          <CarLoanForm
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

export default CarLoanFormModal;
