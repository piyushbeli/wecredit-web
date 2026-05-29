'use client';

import { useParams } from 'next/navigation';
import EmailCalculator from '@/components/personal-loan/emi-calculator';
import CalculatorPageWrapper from '@/components/shared/calculator-page-wrapper';

const calculatorConfig: Record<string, string> = {
  'personal-loan': 'Personal Loan Calculator',
  emi: 'EMI Calculator',
  'business-loan': 'Business Loan Calculator',
  'credit-score': 'Check Credit Score',
};

const CalculatorPage = (): React.ReactNode => {
  const params = useParams();

  const type = params.type as string;
  const title = calculatorConfig[type] || 'Calculator';

  return (
    <div className="max-w-4xl mx-auto">
      <CalculatorPageWrapper>
        <EmailCalculator title={title} />
      </CalculatorPageWrapper>
    </div>
  );
};

export default CalculatorPage;
