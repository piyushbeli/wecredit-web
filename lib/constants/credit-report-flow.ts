import type { CreditReportStatus } from '@/types/credit-report';

export const CREDIT_REPORT_FETCH_STEPS = [
  {
    id: 'identity',
    label: 'Identity verified',
    completeAt: ['connecting_bureau', 'generating_score', 'score_ready'] as const satisfies readonly CreditReportStatus[],
    activeAt: ['verifying_identity', 'idle'] as const satisfies readonly CreditReportStatus[],
  },
  {
    id: 'bureau',
    label: 'Connecting to bureau',
    completeAt: ['generating_score', 'score_ready'] as const satisfies readonly CreditReportStatus[],
    activeAt: ['connecting_bureau'] as const satisfies readonly CreditReportStatus[],
  },
  {
    id: 'report',
    label: 'Generating your report',
    completeAt: ['score_ready'] as const satisfies readonly CreditReportStatus[],
    activeAt: ['generating_score'] as const satisfies readonly CreditReportStatus[],
  },
] as const;

export const CREDIT_SCORE_FETCH_COPY = {
  title: 'Fetching your credit score...',
  subtitle: 'Securely connecting to EQUIFAX. This takes a few seconds.',
} as const;

export const FULL_REPORT_PROCESSING_COPY = {
  title: 'Processing your report..',
} as const;

export const CREDIT_REPORT_ERROR_COPY = {
  scoreTitle: 'Something went wrong',
  scoreDescription: 'We could not fetch your credit score. Please try again.',
  fullReportTitle: 'Something went wrong',
  fullReportDescription: 'We could not generate your full credit report. Please try again.',
  retryLabel: 'Retry',
} as const;
