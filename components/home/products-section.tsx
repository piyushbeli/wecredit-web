'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, BriefcaseBusiness, CreditCard, Home } from 'lucide-react';
import ProductCard from './product-card';
import { IMAGES } from '@/lib/constants/images';
import type { LucideIcon } from 'lucide-react';

interface Product {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  imagePath?: string;
}

const products: Product[] = [
  {
    id: 'personal-loan',
    label: 'Personal Loan',
    href: '/personal-loan',
    icon: ShoppingBag,
    imagePath: IMAGES.ICONS.PERSONAL_LOAN,
  },
  {
    id: 'business-loan',
    label: 'Business Loan',
    href: '/business-loan',
    icon: BriefcaseBusiness,
    imagePath: IMAGES.ICONS.BUSINESS_LOAN,
  },
  {
    id: 'car-loan',
    label: 'Car Loan',
    href: '/car-loan',
    icon: ShoppingBag,
    imagePath: IMAGES.LOAN_ICONS.CAR_LOAN,
  },
  {
    id: 'credit-cards',
    label: 'Credit Cards',
    href: '/credit-cards',
    icon: CreditCard,
    imagePath: IMAGES.ICONS.CREDIT_CARD,
  },
  {
    id: 'home-loan',
    label: 'Home Loan',
    href: '/home-loan',
    icon: Home,
    imagePath: IMAGES.LOAN_ICONS.HOME_LOAN,
  },
  {
    id: 'gold-loan',
    label: 'Gold Loan',
    href: '/gold-loan',
    icon: BriefcaseBusiness,
    imagePath: IMAGES.LOAN_ICONS.GOLD_LOAN,
  },
];

const ProductsSection = (): React.ReactNode => {
  return (
    <section className="bg-white py-8 lg:py-10">
      <div className="mx-auto max-w-7xl xl:px-0 px-8">
        <motion.h2
          className="text-xl font-semibold text-gray-900 text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Our Products
        </motion.h2>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              label={product.label}
              href={product.href}
              icon={product.icon}
              imagePath={product.imagePath}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
