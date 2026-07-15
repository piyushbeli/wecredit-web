'use client';

import type { ReactNode } from 'react';
import { CREDIT_SCORE_FETCH_COPY } from '@/lib/constants/credit-report-flow';
import type { CreditReportProgressStep } from '@/types/credit-report';
import { CreditReportLoader } from './credit-report-loader';
import { CreditReportProgressSteps } from './credit-report-progress-steps';
import { EquifaxFetchBadge } from './equifax-fetch-badge';

interface FetchingCreditScoreProps {
  readonly steps: readonly CreditReportProgressStep[];
  readonly title?: string;
  readonly subtitle?: string;
}

/**
 * Screen 1 — score fetch progress (mobile full-bleed; desktop centered card).
 */
export function FetchingCreditScore({
  steps,
  title = CREDIT_SCORE_FETCH_COPY.title,
  subtitle = CREDIT_SCORE_FETCH_COPY.subtitle,
}: FetchingCreditScoreProps): ReactNode {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-10 lg:min-h-[calc(100vh-5rem)] lg:px-6">
      <div className="w-full max-w-md text-center lg:rounded-2xl lg:border lg:border-black/[0.04] lg:bg-white lg:px-10 lg:py-12 lg:shadow-[0_12px_40px_rgba(16,24,40,0.08)]">
        <div className="lg:hidden">
          <CreditReportLoader label="Fetching credit score" />
        </div>
        <div className="hidden lg:block">
          <EquifaxFetchBadge />
        </div>
        <h2 className="mt-8 text-xl font-bold tracking-tight text-[#1F2937] sm:text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">{subtitle}</p>
        <div className="mt-10 w-full">
          <CreditReportProgressSteps steps={steps} />
        </div>
      </div>
    </div>
  );
}
