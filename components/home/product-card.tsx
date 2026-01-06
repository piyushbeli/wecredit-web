'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

/** Props for ProductCard component */
interface ProductCardProps {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  index: number;
}

/**
 * Individual product card with icon and label
 */
const ProductCard = ({ label, href, icon: Icon, index }: ProductCardProps): JSX.Element => {
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
        {/* Icon Container - Large circular background */}
        <motion.div
          className="w-16 h-16 rounded-full bg-wc-blue-100 flex items-center justify-center"
          whileTap={{ scale: 0.95 }}
        >
          <Icon className="w-7 h-7 text-wc-blue-500" strokeWidth={2} />
        </motion.div>
        
        {/* Label */}
        <span className="text-xs text-gray-700 text-center leading-tight font-medium">
          {label}
        </span>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

