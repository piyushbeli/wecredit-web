'use client';

/**
 * MoneyView Form Modal
 * Fullscreen modal wrapper for the MoneyView loan application form
 * Handles scroll lock and viewport height for iOS Safari
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { useAppHeight } from '@/hooks/use-app-height';

import MoneyViewForm from './moneyview-form';

interface MoneyViewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (leadId: string) => void;
}

const MoneyViewFormModal = ({ isOpen, onClose, onSuccess }: MoneyViewFormModalProps) => {
  // Lock body scroll when modal is open
  useBodyScrollLock(isOpen);

  // Use visual viewport height for iOS Safari toolbar handling
  const appHeightStyle = useAppHeight();

  const modalStyle: React.CSSProperties = {
    ...appHeightStyle,
    height: 'calc(var(--app-height, 1vh) * 100)',
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden"
        style={modalStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Back button overlay - positioned at top left */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 left-3 z-10 p-2 text-gray-700 hover:text-gray-900 bg-white/80 rounded-full shadow-sm"
          aria-label="Close"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Scrollable form container */}
        <div className="flex-1 overflow-y-auto">
          <MoneyViewForm onSuccess={onSuccess} onClose={onClose} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MoneyViewFormModal;
