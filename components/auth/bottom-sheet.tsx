'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Props for BottomSheet component */
interface BottomSheetProps {
  /** Content to render inside the bottom sheet */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Bottom sheet component with slide-up animation
 * Used for login/auth forms
 */
const BottomSheet = ({ children, className }: BottomSheetProps): React.ReactNode => {
  return (
    <motion.div
      className={cn(
        'bg-white rounded-t-3xl -mt-6 relative z-10 min-h-[60vh] shadow-2xl',
        className
      )}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        delay: 0.2,
      }}
    >
      {/* Drag Indicator */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </div>

      {/* Content */}
      <div className="px-6 pb-8">{children}</div>
    </motion.div>
  );
};

export default BottomSheet;

