'use client';

import type { ReactNode } from 'react';
import type { ScoreFactorItem } from '@/types/credit-report';
import {
  getHideOnMobileClassName,
  getScoreFactorToneClasses,
} from '@/lib/utils/credit-report-formatters';
import { CreditReportCard } from './credit-report-card';

interface ScoreFactorsCardProps {
  readonly factors: readonly ScoreFactorItem[];
}

/**
 * Lists score factors that affect the bureau rating.
 */
export function ScoreFactorsCard({ factors }: ScoreFactorsCardProps): ReactNode {
  if (factors.length === 0) {
    return null;
  }

  return (
    <CreditReportCard className="h-full">
      <h2 className="text-base font-bold text-[#1F2937]">What&apos;s affecting your score</h2>
      <div className="mt-4 flex flex-col gap-4">
        {factors.map((factor) => {
          const tone = getScoreFactorToneClasses(factor.rating);
          const progressWidth = Math.min(100, Math.max(0, factor.progress));
          return (
            <div key={factor.key} className={getHideOnMobileClassName(factor.hideOnMobile)}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-[#374151]">{factor.label}</p>
                <p className={`text-sm font-semibold ${tone.textClassName}`}>
                  {factor.displayValue}
                </p>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E8ECF2]">
                <div
                  className={`h-full rounded-full ${tone.barClassName}`}
                  style={{ width: `${progressWidth}%` }}
                  role="progressbar"
                  aria-valuenow={factor.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={factor.label}
                />
              </div>
            </div>
          );
        })}
      </div>
    </CreditReportCard>
  );
}
