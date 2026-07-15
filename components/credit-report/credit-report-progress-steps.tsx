'use client';

import { Check, Loader2, X } from 'lucide-react';
import type { ReactNode } from 'react';
import type { CreditReportProgressStep } from '@/types/credit-report';
import { cn } from '@/lib/utils';

interface CreditReportProgressStepsProps {
  readonly steps: readonly CreditReportProgressStep[];
}

function ProgressStepIcon({ state }: { readonly state: CreditReportProgressStep['state'] }): ReactNode {
  if (state === 'completed') {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1FAF5A]" aria-hidden>
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      </span>
    );
  }
  if (state === 'active') {
    return (
      <span className="flex h-6 w-6 items-center justify-center" aria-hidden>
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
      </span>
    );
  }
  if (state === 'failed') {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E23B3B]" aria-hidden>
        <X className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span
      className="h-6 w-6 rounded-full border-2 border-[#D1D5DB] bg-transparent"
      aria-hidden
    />
  );
}

/**
 * Vertical progress checklist for Screen 1 (score fetch).
 */
export function CreditReportProgressSteps({
  steps,
}: CreditReportProgressStepsProps): ReactNode {
  return (
    <ul className="mx-auto w-full max-w-xs space-y-4" aria-label="Credit score fetch progress">
      {steps.map((step) => {
        const isMuted = step.state === 'pending';
        const isFailed = step.state === 'failed';
        return (
          <li key={step.id} className="flex items-center gap-3">
            <ProgressStepIcon state={step.state} />
            <span
              className={cn(
                'text-sm font-medium',
                isMuted && 'text-gray-400',
                isFailed && 'text-[#E23B3B]',
                !isMuted && !isFailed && 'text-[#1F2937]'
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
