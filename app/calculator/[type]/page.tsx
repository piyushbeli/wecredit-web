'use client';

import { useParams } from 'next/navigation';
import EmailCalculator from '@/components/personal-loan/emi-calculator';
import CalculatorPageWrapper from '@/components/shared/calculator-page-wrapper';

const calculatorConfig: Record<string, { displayTitle: string; h1: string }> = {
  'personal-loan': { displayTitle: 'Personal Loan Calculator', h1: 'Personal Loan EMI Calculator' },
  emi: { displayTitle: 'EMI Calculator', h1: 'Loan EMI Calculator' },
  'business-loan': { displayTitle: 'Business Loan Calculator', h1: 'Business Loan EMI Calculator' },
  'credit-score': { displayTitle: 'Check Credit Score', h1: 'Check Credit Score' },
};

const CalculatorPage = (): React.ReactNode => {
  const params = useParams();

  const type = params.type as string;
  const config = calculatorConfig[type];
  const displayTitle = config?.displayTitle ?? 'Calculator';
  const h1 = config?.h1 ?? 'Calculator';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Visually hidden H1 — the calculator component renders a visible <h2> with the display title */}
      <h1 className="sr-only">{h1}</h1>
      <CalculatorPageWrapper>
        <EmailCalculator title={displayTitle} />
      </CalculatorPageWrapper>
    </div>
  );
};

export default CalculatorPage;
