'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoadingStore } from '@/stores/loading-store';
import { Loader2 } from 'lucide-react';

/**
 * Global loading screen component
 * Controlled by useLoadingStore to show a full-screen overlay with a spinner and messages.
 */
export const LoadingScreen: React.FC = () => {
  const { isVisible, message, subtext } = useLoadingStore();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-primary px-6 text-center text-white"
        >
          {/* Spinner Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-6"
          >
            <Loader2 className="h-12 w-12 animate-spin text-white/80" />
          </motion.div>

          {/* Primary Message */}
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-2 text-xl font-medium"
          >
            {message}
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-white/90 text-sm md:text-base max-w-xs md:max-w-md"
          >
            {subtext}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
