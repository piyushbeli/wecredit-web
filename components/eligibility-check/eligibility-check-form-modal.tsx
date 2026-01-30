'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { checkEligibilityStatus } from '@/lib/api/eligibility-check-service';
import { useLoadingStore } from '@/stores/loading-store';
import { SuccessScreen } from '@/components/shared';
import EligibilityCheckForm from './eligibility-check-form';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';

interface EligibilityCheckFormModalProps {
  onClose: () => void;
}

const EligibilityCheckFormModal = ({
  onClose,
}: EligibilityCheckFormModalProps): React.ReactNode => {
  const { isAuthenticated, user } = useAuth();
  const { show: showLoading, hide: hideLoading } = useLoadingStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const isMountedRef = useRef(true);

  useBodyScrollLock(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Check bureau status when user is authenticated (runs on mount and when auth/phone change)
  useEffect(() => {
    if (!isAuthenticated || !user?.phoneNumber) return;

    const controller = new AbortController();

    const runCheck = async (): Promise<void> => {
      showLoading({
        message: 'Checking your eligibility status...',
        subtext: 'Please wait while we fetch your details.',
      });

      try {
        const result = await checkEligibilityStatus(
          user.phoneNumber,
          controller.signal
        );
        if (!isMountedRef.current) return;
        if (result.showSuccess) {
          setShowSuccess(true);
        }
      } catch {
        if (isMountedRef.current) {
          setShowSuccess(false);
        }
      } finally {
        hideLoading();
      }
    };

    runCheck();

    return () => {
      controller.abort();
    };
  }, [hideLoading, isAuthenticated, showLoading, user?.phoneNumber]);

  const handleSuccess = (): void => {
    if (isMountedRef.current) {
      setShowSuccess(true);
    }
  };

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
          title="Your details have been successfully submitted."
          description="We're processing your request."
          ctaLabel="Continue to Homepage"
          onCtaClick={onClose}
          variant="sticky"
          primaryIcon={<CheckCircle2 className="w-14 h-14 text-green-500 mb-6" />}
        />
      ) : (
        <EligibilityCheckForm
          onClose={onClose}
          isModal
          onSuccess={handleSuccess}
        />
      )}
    </motion.div>
  );
};

export default EligibilityCheckFormModal;
