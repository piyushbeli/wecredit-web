'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, BriefcaseBusiness, ShoppingCart, CreditCard, Home } from 'lucide-react';
import ProductCard from './product-card';
import { IMAGES } from '@/lib/constants/images';
import type { LucideIcon } from 'lucide-react';

/** Product configuration */
interface Product {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  imagePath?: string;
}

/** Products data matching the design */
const products: Product[] = [
  {
    id: 'personal-loan',
    label: 'Personal\nLoan',
    href: '/personal-loan',
    icon: ShoppingBag,
    imagePath: IMAGES.ICONS.PERSONAL_LOAN,
  },
  {
    id: 'business-loan',
    label: 'Business\nLoan',
    href: '/business-loan',
    icon: BriefcaseBusiness,
    imagePath: IMAGES.ICONS.BUSINESS_LOAN,
  },
  // {
  //   id: 'pl-by-ondc',
  //   label: 'PL By\nONDC',
  //   href: '/pl-by-ondc',
  //   icon: ShoppingCart,
  //   imagePath: IMAGES.ICONS.PL_BY_ONDC,
  // },
  {
    id: 'home-loan',
    label: 'Home\nLoan',
    href: '/home-loan',
    icon: Home,
    imagePath: IMAGES.ICONS.CREDIT_CARD,
  },
  {
    id: 'car-loan',
    label: 'Car\nLoan',
    href: '/car-loan',
    icon: ShoppingBag,
    imagePath: IMAGES.ICONS.CREDIT_CARD,
  },
  {
    id: 'gold-loan',
    label: 'Gold\nLoan',
    href: '/gold-loan',
    icon: BriefcaseBusiness,
    imagePath: IMAGES.ICONS.CREDIT_CARD,
  },
  {
    id: 'credit-cards',
    label: 'Credit\nCards',
    href: '/credit-cards',
    icon: CreditCard,
    imagePath: IMAGES.ICONS.CREDIT_CARD,
  },
];

/**
 * Our Products section with 4-column grid
 */
const ProductsSection = (): React.ReactNode => {
  return (
    <section className="bg-white py-4 px-4">
      {/* Section Title */}
      <motion.h2
        className="text-lg font-medium text-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        Our Products
      </motion.h2>

      {/* Products Grid */}
      <div className="grid grid-cols-3 gap-2 mx-auto">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            id={product.id}
            label={product.label.replace('\n', ' ')}
            href={product.href}
            icon={product.icon}
            imagePath={product.imagePath}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;

