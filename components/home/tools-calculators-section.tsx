import { Calculator, PieChart, Briefcase, Gauge } from 'lucide-react';
import ToolCard from './tool-card';
import { IMAGES } from '@/lib/constants/images';
import type { LucideIcon } from 'lucide-react';

interface Tool {
  id: string;
  title: string;
  description: string;
  href: string;
  imagePath?: string;
  fallbackIcon: LucideIcon;
}

const tools: Tool[] = [
  {
    id: 'personal-loan-calculator',
    title: 'Personal Loan calculator',
    description: 'Calculate personal loan EMI',
    href: '/calculator/personal-loan',
    imagePath: IMAGES.TOOLS_AND_CALCULATORS_ILLUSTRATIONS.TC_PERSONAL_LOAN,
    fallbackIcon: Calculator,
  },
  {
    id: 'emi-calculator',
    title: 'EMI calculator',
    description: 'Calculate personal loan EMI',
    href: '/calculator/emi',
    imagePath: IMAGES.TOOLS_AND_CALCULATORS_ILLUSTRATIONS.TC_EMI_CALC,
    fallbackIcon: PieChart,
  },
  {
    id: 'business-loan-calculator',
    title: 'Business Loan calculator',
    description: 'Calculate business loan EMI',
    href: '/calculator/business-loan',
    imagePath: IMAGES.TOOLS_AND_CALCULATORS_ILLUSTRATIONS.TC_BUSINESS_LOAN_CALC,
    fallbackIcon: Briefcase,
  },
  {
    id: 'credit-score-check',
    title: 'Check Credit Score',
    description: 'Check your credit score for free',
    href: '/bureau-report/',
    imagePath: IMAGES.TOOLS_AND_CALCULATORS_ILLUSTRATIONS.TC_CREDIT_SCORE,
    fallbackIcon: Gauge,
  },
];

const ToolsCalculatorsSection = (): React.ReactNode => {
  return (
    <section className="bg-white py-8 lg:py-10">
      <div className="mx-auto max-w-7xl xl:px-0 px-4">
        <h2
          className="text-xl font-semibold text-gray-900 text-center mb-8"
        >
          Tools & Calculators
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              id={tool.id}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              imagePath={tool.imagePath}
              fallbackIcon={tool.fallbackIcon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsCalculatorsSection;
