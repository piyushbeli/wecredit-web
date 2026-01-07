'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

/** Props for ToolCard component */
interface ToolCardProps {
  /** Unique identifier for the tool */
  id: string;
  /** Title displayed on the card (supports line breaks with \n) */
  title: string;
  /** Description text below the title */
  description: string;
  /** Navigation link when card is clicked */
  href: string;
  /** Optional image path for the tool illustration */
  imagePath?: string;
  /** Fallback icon when no image is provided */
  fallbackIcon?: LucideIcon;
  /** Animation delay index for staggered animations */
  index: number;
}

/**
 * Tool card component for Tools & Calculators section
 * Displays a clickable card with title, description, and illustration
 */
const ToolCard = ({
  title,
  description,
  href,
  imagePath,
  fallbackIcon: FallbackIcon,
  index,
}: ToolCardProps): React.ReactNode => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      }}
      className="h-full"
    >
      <Link
        href={href}
        className="group block h-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-200"
      >
        <div className="flex flex-col h-full">
          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">
              {title.split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h3>
            <p className="text-xs text-gray-500 leading-snug">
              {description}
            </p>
          </div>

          {/* Image/Icon Container */}
          <div className="flex justify-end mt-3">
            <motion.div
              className="w-16 h-16 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {imagePath ? (
                <Image
                  src={imagePath}
                  alt={title.replace('\n', ' ')}
                  fill
                  className="object-contain"
                />
              ) : FallbackIcon ? (
                <div className="w-full h-full rounded-xl bg-linear-to-br from-wc-blue-50 to-wc-blue-100 flex items-center justify-center">
                  <FallbackIcon className="w-8 h-8 text-wc-blue-500" strokeWidth={1.5} />
                </div>
              ) : (
                <div className="w-full h-full rounded-xl bg-linear-to-br from-wc-blue-50 to-wc-blue-100" />
              )}
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ToolCard;

