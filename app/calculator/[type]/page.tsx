'use client';

import { useRouter, useParams } from 'next/navigation';
import { ActionButton } from '@/components/shared';
import EmailCalculator from "@/components/personal-loan/emi-calculator";
import React from 'react';

const calculatorConfig: Record<string, string> = {
  "personal-loan": "Personal Loan Calculator",
  "emi": "EMI Calculator",
  "business-loan": "Business Loan Calculator",
  "credit-score": "Check Credit Score",
};

const CalculatorPage = (): React.ReactNode => {
  const router = useRouter();
  const params = useParams();

  const type = params.type as string;
  const title = calculatorConfig[type] || "Calculator";

  const handleBackToHome = (): void => {
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-12">
      {/* Back Button */}
      <div className="mb-6">
				<ActionButton
					onClick={handleBackToHome}
					variant="outline"
					className="border-none shadow-none"
					size="sm"
					leftIcon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="size-4"
						>
							<path
								fillRule="evenodd"
								d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
								clipRule="evenodd"
							/>
						</svg>
					}
				>
					Back to Home
				</ActionButton>
			</div>

      {/* Calculator Component */}
      <EmailCalculator title={title} />

    </div>
  );
};

export default CalculatorPage;
