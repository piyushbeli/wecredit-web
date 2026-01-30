'use client';

/**
 * Fullscreen modal for the business loan form.
 * Overlays the page like LeadFormModal; use isOpen/onClose to control visibility.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import BusinessLoanForm from './business-loan-form';
import { useLoadingStore } from '@/stores/loading-store';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useRef, useState } from 'react';
import { fetchCarLoanStatus } from '@/lib/api/car-loan-service';
import { fetchBusinessLoanStatus } from '@/lib/api/business-loan-service';
import { CheckCircle2 } from 'lucide-react';
import SuccessScreen from '../shared/success-screen';

interface BusinessLoanFormModalProps {
  onClose: () => void;
}

const BusinessLoanFormModal = ({ onClose }: BusinessLoanFormModalProps): React.ReactNode => {
  const { show: showLoading, hide: hideLoading } = useLoadingStore();
  const { isAuthenticated, user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  // Check loan status when user is authenticated (runs on mount and when auth/phone change)
  useEffect(() => {
    if (!isAuthenticated || !user?.phoneNumber) return;

    const controller = new AbortController();

    const checkStatus = async (): Promise<void> => {
      // Gate the form with a status check to avoid showing it when a lead exists.
      showLoading({
        message: 'Checking your business loan status...',
        subtext: 'Please wait while we fetch your details.',
      });

      try {
        const result = await fetchBusinessLoanStatus(user.phoneNumber, controller.signal);
        

        if (result.hasExistingLead) {
          setShowSuccess(true);
        }
      } catch (error) {
        // Log error for debugging while allowing users to proceed with the form
        console.error('Failed to check business loan status:', error);

        // Fall back to showing the form so users can still submit their request
        setShowSuccess(false);
      } finally {
        // Ensure loading state is always cleaned up
          hideLoading();
      
      }
    };

    checkStatus();

    return () => {
      // Cleanup: abort ongoing request and hide loading if still shown
      controller.abort();
      hideLoading();
    };
  }, [hideLoading, isAuthenticated, showLoading, user?.phoneNumber]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-white flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >

        {showSuccess ? (
        <SuccessScreen
          title="THANK YOU FOR SUBMITTING YOUR BUSINESS LOAN REQUEST!"
          description="We'll get in touch with you shortly to guide you through the next steps."
          ctaLabel="Continue to Homepage"
          onCtaClick={onClose}
          variant="sticky"
          primaryIcon={<CheckCircle2 className="w-14 h-14 text-green-500 mb-6" />}
        />
      ) :
        <BusinessLoanForm onClose={onClose} isModal onSuccess={() => setShowSuccess(true)} />
      }
      </motion.div>
    </AnimatePresence>
  );
};

export default BusinessLoanFormModal;
