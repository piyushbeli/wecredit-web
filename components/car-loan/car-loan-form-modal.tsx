'use client';

/**
 * Fullscreen modal for the car loan form.
 * Overlays the page like HomeLoanFormModal; use isOpen/onClose to control visibility.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import CarLoanForm from './car-loan-form';

interface CarLoanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CarLoanFormModal = ({ isOpen, onClose }: CarLoanFormModalProps): React.ReactNode => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-white flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <CarLoanForm onClose={onClose} isModal />
      </motion.div>
    </AnimatePresence>
  );
};

export default CarLoanFormModal;
