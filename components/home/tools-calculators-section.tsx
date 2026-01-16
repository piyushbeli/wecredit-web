'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calculator, PieChart, Briefcase, Gauge, ArrowRight } from 'lucide-react';
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
    href: '/calculators/personal-loan',
    imagePath: IMAGES.ILLUSTRATIONS.PERSONAL_LOAN,
    fallbackIcon: Calculator,
  },
  {
    id: 'emi-calculator',
    title: 'EMI\ncalculator',
    description: 'Calculate personal loan EMI',
    href: '/calculators/emi',
    imagePath: IMAGES.ILLUSTRATIONS.EMI_CALC,
    fallbackIcon: PieChart,
  },
  {
    id: 'business-loan-calculator',
    title: 'Business Loan\ncalculator',
    description: 'Calculate personal loan EMI',
    href: '/calculators/business-loan',
    imagePath: IMAGES.ILLUSTRATIONS.BUSINESS_LOAN_CALC,
    fallbackIcon: Briefcase,
  },
  {
    id: 'credit-score-check',
    title: 'Check Credit\nScore',
    description: 'Check personal loan EMI',
    href: '/credit-score',
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
    <section className="bg-white py-4 px-4">
      <div className="mx-auto">
        {/* Section Title */}
        <motion.h2
          className="text-lg font-semibold text-gray-900 text-center mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Tools & Calculators
        </motion.h2>

        {/* Tools Grid - 2x2 layout */}
        <div className="grid grid-cols-2 gap-3">
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

        {/* Explore All Link */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Link
            href="/calculators"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-wc-blue-500 hover:text-wc-blue-600 transition-colors group"
          >
            Explore All Calculators
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsCalculatorsSection;

