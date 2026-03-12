'use client';

import { motion } from 'framer-motion';
import { Calculator, PieChart, Briefcase, Gauge } from 'lucide-react';
import ToolCard from './tool-card';
import { IMAGES } from '@/lib/constants/images';
import type { LucideIcon } from 'lucide-react';

/** Tool configuration interface */
interface Tool {
  id: string;
  title: string;
  description: string;
  href: string;
  imagePath?: string;
  fallbackIcon: LucideIcon;
}

/** Tools data matching the design */
const tools: Tool[] = [
  {
    id: 'personal-loan-calculator',
    title: 'Personal Loan\ncalculator',
    description: 'Calculate personal loan EMI',
    href: '/calculator/personal-loan',
    imagePath: IMAGES.ILLUSTRATIONS.PERSONAL_LOAN,
    fallbackIcon: Calculator,
  },
  {
    id: 'emi-calculator',
    title: 'EMI\ncalculator',
    description: 'Calculate personal loan EMI',
    href: '/calculator/emi',
    imagePath: IMAGES.ILLUSTRATIONS.EMI_CALC,
    fallbackIcon: PieChart,
  },
  {
    id: 'business-loan-calculator',
    title: 'Business Loan\ncalculator',
    description: 'Calculate business loan EMI',
    href: '/calculator/business-loan',
    imagePath: IMAGES.ILLUSTRATIONS.BUSINESS_LOAN_CALC,
    fallbackIcon: Briefcase,
  },
  {
    id: 'credit-score-check',
    title: 'Check Credit\nScore',
    description: 'Check personal loan EMI',
    href: '/bureau-report/',
    imagePath: IMAGES.ILLUSTRATIONS.CREDIT_SCORE,
    fallbackIcon: Gauge,
  },
];

/**
 * Tools & Calculators section component
 * Displays a 2x2 grid of tool cards with an explore link
 */
const ToolsCalculatorsSection = (): React.ReactNode => {
  return (
    <section className="bg-white py-4 px-4 md:py-0">
      <div className="mx-auto max-w-3xl md:my-8 lg:my-12">
        {/* Section Title */}
        <motion.h2
          className="text-lg font-medium md:text-[18px] text-center mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Tools & Calculators
        </motion.h2>

        {/* Tools Grid - 2x2 layout */}
        {/* Tools Grid */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
  {tools.map((tool, index) => (
    <ToolCard
      key={tool.id}
      id={tool.id}
      title={tool.title}
      description={tool.description}
      href={tool.href}
      imagePath={tool.imagePath}
      fallbackIcon={tool.fallbackIcon}
      index={index}
    />
  ))}
</div>

      </div>
    </section>
  );
};

export default ToolsCalculatorsSection;

