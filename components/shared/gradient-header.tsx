'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/constants/images';

/** Props for GradientHeader component */
interface GradientHeaderProps {
  /** Header variant - logo-only for simple pages, with-menu for home, with-illustration for auth screens */
  variant?: 'logo-only' | 'with-menu' | 'with-illustration';
  /** Whether the header is a phone number header */
  isPhoneNumberHeader?: boolean;
  /** Optional callback when menu button is clicked */
  onMenuClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
  /** Height of the header section */
  height?: 'short' | 'medium' | 'tall' | 'half' | 'threeQuarter' | 'sixtyFive';
  /** Illustration image path for with-illustration variant */
  illustration?: string;
  /** Alt text for illustration image */
  illustrationAlt?: string;
}

/** Height class mapping */
const heightClasses = {
  short: 'min-h-[200px]',
  medium: 'min-h-[300px]',
  tall: 'min-h-[40vh]',
  half: 'h-[50vh]',
  threeQuarter: 'h-[75vh]',
  sixtyFive: 'h-[65vh] h-[65svh] h-[65dvh]',
};

/**
 * Reusable gradient header component with WeCredit logo
 * Can be used across pages with different variants
 */
const GradientHeader = ({
  variant = 'logo-only',
  isPhoneNumberHeader = false,
  onMenuClick,
  className,
  style,
  height = 'tall',
  illustration,
  illustrationAlt = 'Illustration',
}: GradientHeaderProps): React.ReactNode => {
  return (
    <header
      className={cn(
        'relative flex flex-col',
        heightClasses[height],
        className
      )}
      style={style}
    >
      {/* Top Bar - only visible for with-menu variant */}
      {variant === 'with-menu' && (
        <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src={IMAGES.LOGOS.DEFAULT}
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
      {variant === 'logo-only' && !isPhoneNumberHeader && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={IMAGES.LOGOS.DEFAULT}
              alt="WeCredit"
              width={200}
              height={56}
              className="h-14 w-auto"
              priority
            />
          </motion.div>
        </div>
      )}

      {/* Illustration variant - for auth screens */}
      {variant === 'with-illustration' && (
        <>
          {/* Curved bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-[2rem] z-10" />
          {/* Illustration or placeholder */}
          <div className={cn("flex items-center justify-center relative z-0", isPhoneNumberHeader ? 'flex-1 px-4' : 'px-0')}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full "
            >
              {illustration ? (
                <Image
                  src={illustration}
                  alt={illustrationAlt}
                  width={320}
                  height={243}
                  className="w-full h-auto object-contain"
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-[180px] h-[180px] border-2 border-dashed border-white/40 rounded-2xl flex flex-col items-center justify-center text-white/60">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <span className="text-sm font-medium">Add Image</span>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </header>
  );
};

export default GradientHeader;

