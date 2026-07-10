/**
 * Prime PL Success Overlay
 * Terminal "thank you" overlay shown over LeadFormModal after a Prime PL lead is created.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { ActionButton } from '@/components/shared';

interface PrimePlSuccessOverlayProps {
  isVisible: boolean;
  onContinue: () => void;
}

const PrimePlSuccessOverlay = ({ isVisible, onContinue }: PrimePlSuccessOverlayProps) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        className="absolute inset-0 bg-white z-100 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900">Thank you</h3>
            <p className="text-gray-600 mt-2">Our team will contact you shortly.</p>
            <ActionButton
              type="button"
              className="mt-8 min-w-[200px]"
              onClick={onContinue}
            >
              Continue
            </ActionButton>
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default PrimePlSuccessOverlay;
