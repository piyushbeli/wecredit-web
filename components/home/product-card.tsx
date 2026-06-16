'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ProductCardProps {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  imagePath?: string;
  index: number;
}

const ProductCard = ({ label, href, icon: Icon, imagePath, index }: ProductCardProps): React.ReactNode => {
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
        className="wc-product-card flex flex-col items-center justify-center gap-3 p-4 h-full rounded-xl  bg-white hover:border-gray-200 transition-colors"
      // with border 
      // className="wc-product-card flex flex-col items-center justify-center gap-3 p-4 h-full rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors"
      >
        <motion.div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-wc-blue-50 flex items-center justify-center"
          whileTap={{ scale: 0.95 }}
        >
          {imagePath ? (
            <Image
              src={imagePath}
              alt={label}
              width={32}
              height={32}
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
            />
          ) : Icon ? (
            <Icon className="w-7 h-7 text-wc-blue-600" strokeWidth={2} />
          ) : null}
        </motion.div>

        <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
          {label}
        </span>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

