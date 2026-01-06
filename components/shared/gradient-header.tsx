'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Props for GradientHeader component */
interface GradientHeaderProps {
  /** Header variant - logo-only for simple pages, with-menu for home */
  variant?: 'logo-only' | 'with-menu';
  /** Optional callback when menu button is clicked */
  onMenuClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Height of the header section */
  height?: 'short' | 'medium' | 'tall';
}

/** Height class mapping */
const heightClasses = {
  short: 'min-h-[200px]',
  medium: 'min-h-[300px]',
  tall: 'min-h-[40vh]',
};

/**
 * Reusable gradient header component with WeCredit logo
 * Can be used across pages with different variants
 */
const GradientHeader = ({
  variant = 'logo-only',
  onMenuClick,
  className,
  height = 'tall',
}: GradientHeaderProps): React.ReactNode => {
  return (
    <header
      className={cn(
        'wc-hero-gradient-wrapper relative flex flex-col',
        heightClasses[height],
        className
      )}
    >
      {/* Top Bar - only visible for with-menu variant */}
      {variant === 'with-menu' && (
        <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="WeCredit"
                width={120}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <motion.button
              type="button"
              onClick={onMenuClick}
              className="p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Open menu"
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      )}

      {/* Centered Logo - for logo-only variant */}
      {variant === 'logo-only' && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/images/logo.png"
              alt="WeCredit"
              width={200}
              height={56}
              className="h-14 w-auto"
              priority
            />
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default GradientHeader;

