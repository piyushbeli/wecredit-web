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
        className="group block h-full rounded-xl border border-gray-100 bg-white  shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-200"
      >
        <div className="flex flex-col h-full">
  
  {/* Row: Image + Title */}
  <div className="flex items-center gap-1 px-1 mt-2">
    <motion.div
      className="w-14 h-14 md:w-18 md:h-18 relative flex-shrink-0"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {imagePath ? (
        <Image
          src={imagePath}
          alt={title.replace('\n', ' ')}
          fill
          className="object-contain"
          sizes="48px"
        />
      ) : FallbackIcon ? (
        <div className="w-full h-full rounded-xl bg-linear-to-br from-wc-blue-50 to-wc-blue-100 flex items-center justify-center">
          <FallbackIcon className="w-6 h-6 text-wc-blue-500" strokeWidth={1.5} />
        </div>
      ) : (
        <div className="w-full h-full rounded-xl bg-linear-to-br from-wc-blue-50 to-wc-blue-100" />
      )}
    </motion.div>

    <h3 className="text-sm font-medium leading-tight">
      {title.split('\n').map((line, idx) => (
        <span key={idx}>
          {line}
          {idx < title.split('\n').length - 1 && <br />}
        </span>
      ))}
    </h3>
  </div>

  {/* Description */}
  <p className="text-xs text-gray-500 leading-snug mt-0 mb-4 mx-2">
    {description}
  </p>

</div>
      </Link>
    </motion.div>
  );
};

export default ToolCard;