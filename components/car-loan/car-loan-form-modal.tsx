'use client';

/**
 * Fullscreen modal for the car loan form.
 * Overlays the page like HomeLoanFormModal; use isOpen/onClose to control visibility.
 */

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { fetchCarLoanStatus } from '@/lib/api/car-loan-service';
import { useLoadingStore } from '@/stores/loading-store';
import { SuccessScreen } from '@/components/shared';
import CarLoanForm from './car-loan-form';

interface CarLoanFormModalProps {
  onClose: () => void;
}

const CarLoanFormModal = ({ onClose }: CarLoanFormModalProps): React.ReactNode => {
  const { isAuthenticated, user } = useAuth();
  const { show: showLoading, hide: hideLoading } = useLoadingStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const hasCheckedStatusRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Track unmount to avoid state updates after component unmounts.
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Check loan status once on mount when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user?.phoneNumber || hasCheckedStatusRef.current) return;
    hasCheckedStatusRef.current = true;

    const controller = new AbortController();

    const checkStatus = async (): Promise<void> => {
      // Gate the form with a status check to avoid showing it when a lead exists.
      showLoading({
        message: 'Checking your car loan status...',
        subtext: 'Please wait while we fetch your details.',
      });
      const result = await fetchCarLoanStatus(user.phoneNumber, controller.signal);
      if (!isMountedRef.current) return;
      if (result.hasExistingLead) {
        setShowSuccess(true);
      }
      hideLoading();
    };

    checkStatus();

    return () => {
      controller.abort();
    };
  }, [hideLoading, isAuthenticated, showLoading, user?.phoneNumber]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {showSuccess ? (
        <SuccessScreen
          title="THANK YOU FOR SUBMITTING YOUR CAR LOAN REQUEST!"
          description="We'll get in touch with you shortly to guide you through the next steps."
          ctaLabel="Continue to Homepage"
          onCtaClick={onClose}
          variant="sticky"
          primaryIcon={<CheckCircle2 className="w-14 h-14 text-green-500 mb-6" />}
        />
      ) : (
        <CarLoanForm onClose={onClose} isModal onSuccess={() => setShowSuccess(true)} />
      )}
    </motion.div>
  );
};

export default CarLoanFormModal;
