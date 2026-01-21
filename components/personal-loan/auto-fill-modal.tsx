'use client';

/**
 * Auto-Fill Modal Component
 * Displays before the loan form modal to inform users about auto-filling details from credit bureau
 * Shows a 5-second countdown timer and allows users to choose manual entry
 */

import { JSX, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActionButton } from '@/components/shared';
import PrivacyBadge from './privacy-badge';
import CountdownTimer from './countdown-timer';
import CertificationLogos from './certification-logos';
import Image from 'next/image';
import { IMAGES } from '@/lib/constants/images';
import { CertificationsSection } from '../home';
import CertificationsAutoFillSection from '../home/certifications-auto-fill-section';

interface AutoFillModalProps {
  isOpen: boolean;
  onProceed: (fetchDetails: boolean) => void;
  onClose?: () => void;
  disableTimer?: boolean;
}

/** Initial countdown duration in seconds */
const COUNTDOWN_DURATION = 5;

/**
 * Auto-Fill Modal Component
 * Shows countdown timer and allows user to proceed with auto-fill or manual entry
 */
const AutoFillModal = ({ isOpen, onProceed, onClose, disableTimer = false }: AutoFillModalProps): JSX.Element | null => {
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_DURATION);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  // Reset countdown when modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(COUNTDOWN_DURATION);
      setIsClosing(false);
    }
  }, [isOpen]);

  // Countdown timer logic (disabled in debug mode)
  useEffect(() => {
    if (!isOpen || isClosing || disableTimer) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-proceed with fetchDetails=true when countdown ends
          setIsClosing(true);
          setTimeout(() => {
            onProceed(true);
          }, 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isClosing, disableTimer, onProceed]);

  // Handle manual button click
  const handleManualClick = useCallback((): void => {
    if (isClosing) return;
    setIsClosing(true);
    // Proceed with fetchDetails=false for manual entry
    setTimeout(() => {
      onProceed(false);
    }, 100);
  }, [isClosing, onProceed]);

  // Render privacy badge icons
  const privacyIcon = (
    <>
      <div className="w-2.5 h-3 border border-blue-700" />
      <div className="w-[5px] h-2 border border-blue-700" />
    </>
  );

  const securityIcon = (
    <div className="w-3 h-3.5 bg-green-700" />
  );

  // Early return for closed modal
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal Container - slides up from bottom */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-tl-2xl rounded-tr-2xl shadow-[1px_1px_4px_0px_rgba(102,102,102,0.10),-1px_-1px_4px_0px_rgba(102,102,102,0.10)] overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="w-full max-w-sm mx-auto px-4 pt-6 pb-8 flex flex-col items-center">
              {/* Title */}
              <h2 className="text-center text-zinc-800 text-xl font-medium font-['Poppins'] leading-6 mb-2">
                Auto- Filling your details from credit bureau
              </h2>

              {/* Disclaimer */}
              <p className="text-center text-zinc-500 text-xs font-normal font-['Poppins'] leading-4 mb-8">
                We don't put any enquiries in your credit bureau
              </p>

              {/* Circular Progress Indicator with Countdown */}
              <CountdownTimer countdown={countdown} totalDuration={COUNTDOWN_DURATION} />

              {/* Privacy Badges */}
              <div className="flex items-center gap-2 mb-6">
                <PrivacyBadge
                  label="100% Privacy"
                  iconImage={IMAGES.ICONS.THUMB_PRINT}
                  bgColor="bg-blue-700/20"
                  textColor="text-blue-700"
                  borderRadius="rounded-[34px]"
                />
                <PrivacyBadge
                  label="Safe & Secure"
                  iconImage={IMAGES.ICONS.GUARED}
                  bgColor="bg-green-700/20"
                  textColor="text-green-700"
                  borderRadius="rounded-[71px]"
                />
              </div>
              <CertificationsAutoFillSection />
            </div>
            <div className="p-4">
              {/* Add Details Manually Button */}
              <ActionButton
                type="button"
                onClick={handleManualClick}
                fullWidth
                className="h-12 rounded-lg text-white text-lg font-normal"
              >
                Add Details Manually
              </ActionButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AutoFillModal;
