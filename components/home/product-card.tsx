'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

/** Props for ProductCard component */
interface ProductCardProps {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  imagePath?: string;
  index: number;
}

/**
 * Individual product card with icon/image and label
 */
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
        delay: index * 0.1,
      }}
    >
      <Link
        href={href}
        className="wc-product-card flex flex-col items-center gap-3 p-2"
      >
        {/* Icon/Image Container - Large circular background */}
        <motion.div
          className="w-16 h-16 rounded-full bg-wc-blue-100 flex items-center justify-center overflow-hidden"
          whileTap={{ scale: 0.95 }}
        >
          {imagePath ? (
            <Image
              src={imagePath}
              alt={label}
              width={32}
              height={32}
              className="object-contain"
            />
          ) : Icon ? (
            <Icon className="w-7 h-7 text-wc-blue-500" strokeWidth={2} />
          ) : null}
        </motion.div>
        
        {/* Label */}
        <span className="text-xs text-center leading-tight">
          {label}
        </span>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

