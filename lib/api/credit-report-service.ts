import creditReportMockData from '@/mocks/credit-report.json';
import creditReportFullMockData from '@/mocks/credit-report-full.json';
import { getStoredBureauPdfUrl } from '@/lib/utils/bureau-pdf';
import type {
  CreditReportDashboard,
  CreditReportData,
  CreditReportStatus,
} from '@/types/credit-report';

interface StatusPollStep {
  readonly status: CreditReportStatus;
  readonly delayMs: number;
}

/**
 * Mock score-fetch status sequence.
 * Replace with real `GET /api/v1/credit-report/score-status` polling later.
 */
const MOCK_SCORE_STATUS_SEQUENCE: readonly StatusPollStep[] = [
  { status: 'verifying_identity', delayMs: 900 },
  { status: 'connecting_bureau', delayMs: 1200 },
  { status: 'generating_score', delayMs: 1400 },
  { status: 'score_ready', delayMs: 700 },
];

/**
 * Mock full-report generation sequence.
 * Replace with real `GET /api/v1/credit-report/full-status` polling later.
 */
const MOCK_FULL_REPORT_SEQUENCE: readonly StatusPollStep[] = [
  { status: 'generating_full_report', delayMs: 1800 },
  { status: 'full_report_ready', delayMs: 600 },
];

const DEFAULT_POLL_INTERVAL_MS = 800;

/**
 * Abortable delay used between mock status polls.
 */
function waitForMs(delayMs: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timeoutId = window.setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, delayMs);
    const onAbort = (): void => {
      window.clearTimeout(timeoutId);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * Fetches the credit-report dashboard payload.
 * Currently returns mock JSON; swap for GET /api/v1/credit-report/dashboard later.
 */
export async function getCreditReportDashboard(): Promise<CreditReportDashboard> {
  // TODO: Replace mock with API call, e.g. GET /api/v1/credit-report/dashboard
  return creditReportMockData as CreditReportDashboard;
}

/**
 * Fetches full Equifax credit report details.
 * Currently returns mock JSON; swap for GET /api/v1/credit-report/full later.
 * Uses stored bureau pdfUrl when present so download is not the W3C dummy file.
 */
export async function getFullCreditReport(): Promise<CreditReportData> {
  // TODO: Replace mock with API call, e.g. GET /api/v1/credit-report/full
  const mock = creditReportFullMockData as CreditReportData;
  const storedPdfUrl = getStoredBureauPdfUrl();
  if (!storedPdfUrl) {
    return mock;
  }
  return {
    ...mock,
    pdfUrl: storedPdfUrl,
  };
}

/**
 * Polls score-fetch job status until score_ready (or abort/failure).
 * Mock advances through a fixed sequence; real API should poll until terminal status.
 */
export async function pollCreditScoreStatus(options: {
  readonly onStatus: (status: CreditReportStatus) => void;
  readonly signal: AbortSignal;
}): Promise<CreditReportDashboard> {
  // TODO: Replace mock sequence with:
  // while (!signal.aborted) {
  //   const response = await fetchScoreJobStatus();
  //   options.onStatus(response.status);
  //   if (response.status === 'score_ready') return response.dashboard;
  //   if (response.status === 'failed') throw new Error('Score fetch failed');
  //   await waitForMs(pollIntervalMs, signal);
  // }
  for (const step of MOCK_SCORE_STATUS_SEQUENCE) {
    if (options.signal.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
    options.onStatus(step.status);
    if (step.status === 'score_ready') {
      return getCreditReportDashboard();
    }
    await waitForMs(step.delayMs, options.signal);
  }
  await waitForMs(DEFAULT_POLL_INTERVAL_MS, options.signal);
  throw new Error('Credit score status polling ended without score_ready');
}

/**
 * Polls full-report job status until full_report_ready (or abort/failure).
 */
export async function pollFullCreditReportStatus(options: {
  readonly onStatus: (status: CreditReportStatus) => void;
  readonly signal: AbortSignal;
}): Promise<CreditReportData> {
  // TODO: Replace mock sequence with real full-report job polling.
  for (const step of MOCK_FULL_REPORT_SEQUENCE) {
    if (options.signal.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
    options.onStatus(step.status);
    if (step.status === 'full_report_ready') {
      return getFullCreditReport();
    }
    await waitForMs(step.delayMs, options.signal);
  }
  await waitForMs(DEFAULT_POLL_INTERVAL_MS, options.signal);
  throw new Error('Full report status polling ended without full_report_ready');
}
