import { CREDIT_REPORT_FETCH_STEPS } from '@/lib/constants/credit-report-flow';
import type {
  CreditReportAccountStatus,
  CreditReportPaymentStatus,
  CreditReportProgressStep,
  CreditReportProgressStepState,
  CreditReportStatus,
  CreditReportView,
} from '@/types/credit-report';

/**
 * Maps flow status to the screen the page should render.
 */
export function getCreditReportView(status: CreditReportStatus): CreditReportView {
  if (status === 'failed') {
    return 'error';
  }
  if (status === 'full_report_ready') {
    return 'full_report';
  }
  if (status === 'generating_full_report') {
    return 'processing';
  }
  if (status === 'score_ready') {
    return 'summary';
  }
  return 'fetching';
}

/**
 * Builds Screen 1 progress steps from the live fetch status.
 */
export function buildCreditScoreProgressSteps(
  status: CreditReportStatus,
  hasFailed: boolean
): readonly CreditReportProgressStep[] {
  return CREDIT_REPORT_FETCH_STEPS.map((step) => {
    const completeAt = step.completeAt as readonly CreditReportStatus[];
    const activeAt = step.activeAt as readonly CreditReportStatus[];
    let state: CreditReportProgressStepState = 'pending';
    if (hasFailed && activeAt.includes(status)) {
      state = 'failed';
    } else if (completeAt.includes(status)) {
      state = 'completed';
    } else if (activeAt.includes(status)) {
      state = 'active';
    }
    return {
      id: step.id,
      label: step.label,
      state,
    };
  });
}

/**
 * Formats ISO date as "28 JUN 2026".
 */
export function formatReportGeneratedDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(date)
    .toUpperCase();
}

/**
 * Formats ISO date as "26 Jun 2026" (desktop report metadata).
 */
export function formatReportGeneratedDateDesktop(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats consumer DOB as "14 Aug 1992".
 */
export function formatConsumerDateOfBirth(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Returns sanctioned amount or credit limit for account table display.
 */
export function getAccountSanctionedAmount(account: {
  readonly sanctionedAmount?: number;
  readonly creditLimit?: number;
}): number | undefined {
  if (account.sanctionedAmount !== undefined) {
    return account.sanctionedAmount;
  }
  return account.creditLimit;
}

/**
 * Account subtitle: type · Limit/Loan amount.
 */
export function formatAccountLimitLabel(params: {
  readonly accountType: string;
  readonly creditLimit?: number;
  readonly sanctionedAmount?: number;
  readonly formatAmount: (amount: number) => string;
}): string {
  if (params.creditLimit !== undefined) {
    return `${params.accountType} · Limit ${params.formatAmount(params.creditLimit)}`;
  }
  if (params.sanctionedAmount !== undefined) {
    return `${params.accountType} · ${params.formatAmount(params.sanctionedAmount)}`;
  }
  return params.accountType;
}

/**
 * Score change label for full report badge, e.g. "↑ 12 pts".
 */
export function formatScoreChangeLabel(change: number): string {
  if (change === 0) {
    return 'No change';
  }
  if (change < 0) {
    return `↓ ${Math.abs(change)} pts`;
  }
  return `↑ ${change} pts`;
}

export interface AccountStatusTone {
  readonly textClassName: string;
}

/**
 * Maps account status to UI tone classes.
 */
export function getAccountStatusTone(status: CreditReportAccountStatus): AccountStatusTone {
  if (status === 'ACTIVE') {
    return { textClassName: 'text-[#1FAF5A]' };
  }
  if (status === 'OVERDUE') {
    return { textClassName: 'text-[#E23B3B]' };
  }
  return { textClassName: 'text-gray-400' };
}

export interface PaymentStatusTone {
  readonly cellClassName: string;
  readonly label: string;
}

/**
 * Maps payment-history cell status to color + legend label.
 */
export function getPaymentStatusTone(status: CreditReportPaymentStatus): PaymentStatusTone {
  if (status === 'ON_TIME') {
    return { cellClassName: 'bg-[#1FAF5A]', label: 'On time' };
  }
  if (status === 'DELAYED') {
    return { cellClassName: 'bg-[#F09A2E]', label: 'Delayed' };
  }
  if (status === 'MISSED') {
    return { cellClassName: 'bg-[#E23B3B]', label: 'Missed' };
  }
  return { cellClassName: 'bg-[#E7ECF3]', label: 'No data' };
}

/**
 * Opens a PDF URL in a new tab.
 */
export function openCreditReportPdf(pdfUrl: string): boolean {
  if (!pdfUrl.trim()) {
    return false;
  }
  const openedWindow = window.open('', '_blank');
  if (!openedWindow) {
    return false;
  }
  openedWindow.opener = null;
  openedWindow.location.href = pdfUrl;
  return true;
}
