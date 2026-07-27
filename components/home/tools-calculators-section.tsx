import { Calculator, PieChart, Briefcase, Gauge } from 'lucide-react';
import ToolCard, { type ToolCardProps } from './tool-card';
import { IMAGES } from '@/lib/constants/images';

const tools: ToolCardProps[] = [
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
  const visibleTools = tools.filter((tool) => tool.id !== 'business-loan-calculator');

  return (
    <section className="bg-white py-8 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 xl:px-0">
        <h2 className="mb-16 hidden text-center text-3xl font-medium text-gray-700 lg:block">
          Tools & Calculators
        </h2>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-4">
          {visibleTools.map((tool) => (
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
