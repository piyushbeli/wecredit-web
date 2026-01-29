'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { fetchGoldLoanStatus } from '@/lib/api/gold-loan-service';
import { useLoadingStore } from '@/stores/loading-store';
import { SuccessScreen } from '@/components/shared';
import GoldLoanForm from './gold-loan-form';

interface GoldLoanFormModalProps {
  onClose: () => void;
}

const GoldLoanFormModal = ({ onClose }: GoldLoanFormModalProps): React.ReactNode => {
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
      // Avoid showing the form if a lead already exists for this user.
      showLoading({
        message: 'Checking your gold loan status...',
        subtext: 'Please wait while we fetch your details.',
      });

      try {
        const result = await fetchGoldLoanStatus(user.phoneNumber, controller.signal);
        if (!isMountedRef.current) return;
        if (result.hasExistingLead) {
          setShowSuccess(true);
        }
      } catch (error) {
        // If the status check fails, fall back to the form so users can proceed.
        if (!isMountedRef.current) return;
        setShowSuccess(false);
      } finally {
        hideLoading();
      }
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
          title="THANK YOU FOR SUBMITTING YOUR GOLD LOAN REQUEST!"
          description="We'll get in touch with you shortly to guide you through the next steps."
          ctaLabel="Continue to Homepage"
          onCtaClick={onClose}
          variant="sticky"
          primaryIcon={<CheckCircle2 className="w-14 h-14 text-green-500 mb-6" />}
        />
      ) : (
        <GoldLoanForm onClose={onClose} isModal onSuccess={() => setShowSuccess(true)} />
      )}
    </motion.div>
  );
};

export default GoldLoanFormModal;
