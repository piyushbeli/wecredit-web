'use client';

import { RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';
import type { CreditScoreInfo } from '@/types/credit-report';
import {
  formatLastUpdatedLabel,
  formatMonthlyChangeLabel,
  getMonthlyChangeClassName,
} from '@/lib/utils/credit-report-formatters';
import { CreditReportCard } from './credit-report-card';
import { CreditScoreGauge } from './credit-score-gauge';

interface CreditScoreCardProps {
  readonly creditScore: CreditScoreInfo;
  readonly onRefresh?: () => void;
}

/**
 * Equifax score card with gauge and meta row.
 */
export function CreditScoreCard({ creditScore, onRefresh }: CreditScoreCardProps): ReactNode {
  const changeLabel = formatMonthlyChangeLabel(
    creditScore.monthlyChange,
    creditScore.changeType
  );
  const changeClassName = getMonthlyChangeClassName(creditScore.changeType);

  return (
    <CreditReportCard className="h-full">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E23B3B]" aria-hidden />
          {creditScore.bureau} SCORE
        </p>
        {creditScore.canRefresh ? (
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh credit score"
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary lg:hidden"
          >
            <RefreshCw className="h-4 w-4 " aria-hidden />
            Refresh
          </button>
        ) : null}
      </div>
      <div className="mt-3">
        <CreditScoreGauge
          score={creditScore.score}
          minimumScore={creditScore.minimumScore}
          maximumScore={creditScore.maximumScore}
          rating={creditScore.rating}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
        <span className="text-gray-500">
          Range {creditScore.minimumScore}–{creditScore.maximumScore}
        </span>
        <span className={`font-semibold ${changeClassName}`}>
          {changeLabel}
          <span className="hidden lg:inline"> this month</span>
        </span>
      </div>
      <p className="mt-3 text-center text-xs text-gray-400">
        {formatLastUpdatedLabel(creditScore.lastUpdatedAt)}
      </p>
    </CreditReportCard>
  );
}
