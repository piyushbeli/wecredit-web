'use client';

import { AnimatePresence, motion } from 'framer-motion';
import ActionButton from './action-button';

interface SuccessScreenProps {
  title: string;
  description: string;
  ctaLabel: string;
  onCtaClick: () => void;
  /** Visual element above the message (icon/image cluster). */
  media?: React.ReactNode;
  primaryIcon?: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  /** Layout variant for normal vs sticky CTA footer. */
  variant?: 'centered' | 'sticky';
}

const SuccessScreen = ({
  title,
  description,
  ctaLabel,
  onCtaClick,
  media,
  primaryIcon,
  secondaryIcon,
  variant = 'centered',
}: SuccessScreenProps): React.ReactNode => {
  const resolvedMedia =
    media ||
    (primaryIcon || secondaryIcon ? (
      <div className="flex items-center justify-center gap-3 mb-6">
        {primaryIcon}
        {secondaryIcon}
      </div>
    ) : null);

  if (variant === 'sticky') {
    return (
      <div className="fixed inset-0 bg-white flex flex-col">
        {/* Centered message with optional media */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          {resolvedMedia}
          <div className="space-y-3 max-w-md">
            <h2 className="text-base font-medium text-brand-primary uppercase">
              {title}
            </h2>
            <p className="text-gray-500 text-sm font-normal">{description}</p>
          </div>
        </div>

        {/* Sticky CTA footer to mirror Partner-with-us success layout */}
        <div className="sticky bottom-0 w-full px-4 pb-4 pt-4 bg-white border-t border-gray-200">
          <ActionButton
            onClick={onCtaClick}
            className="w-full h-14 text-base font-medium"
            fullWidth
          >
            {ctaLabel}
          </ActionButton>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col flex-1 min-h-0 items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="flex flex-col items-center text-center max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {resolvedMedia}
          <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3">
            {title}
          </h2>
          <p className="text-sm text-gray-600 mb-8">{description}</p>
          <ActionButton
            type="button"
            onClick={onCtaClick}
            fullWidth
            className="h-14 text-base"
          >
            {ctaLabel}
          </ActionButton>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SuccessScreen;
