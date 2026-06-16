'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  href: string;
  imagePath?: string;
  fallbackIcon?: LucideIcon;
  index: number;
}

const ToolCard = ({
  title,
  description,
  href,
  imagePath,
  fallbackIcon: FallbackIcon,
  index,
}: ToolCardProps): React.ReactNode => {
  const displayTitle = title.replace('\n', ' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.08,
      }}
      className="h-full"
    >
      <Link
        href={href}
        className="group block h-full min-h-[148px] rounded-xl border border-gray-100 bg-white p-4 relative overflow-hidden hover:border-gray-200 transition-colors"
      >
        <h3 className="text-sm font-semibold text-gray-900 leading-tight pr-16">
          {displayTitle}
        </h3>
        <p className="text-xs text-gray-500 mt-1 leading-snug pr-14">
          {description}
        </p>

        <div className="absolute bottom-0 right-0 w-[88px] h-[88px] sm:w-[96px] sm:h-[96px]">
          {imagePath ? (
            <Image
              src={imagePath}
              alt={displayTitle}
              fill
              className="object-contain object-bottom-right"
              sizes="96px"
            />
          ) : FallbackIcon ? (
            <div className="w-full h-full flex items-end justify-end pb-1 pr-1">
              <FallbackIcon className="w-10 h-10 text-wc-blue-500" strokeWidth={1.5} />
            </div>
          ) : null}
        </div>
      </Link>
    </motion.div>
  );
};

export default ToolCard;
