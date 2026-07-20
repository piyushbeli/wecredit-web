import { STORAGE_BUREAU_RESPONSE } from '@/lib/constants/api-keys';
import { adaptBureauReport } from '@/lib/utils/credit-report-adapter';
import type { CreditReportDashboard, CreditReportData, CreditReportStatus } from '@/types/credit-report';

const SCORE_PROGRESS_DURATION_MS = 1500;
const FULL_REPORT_PROCESSING_DURATION_MS = 1500;

const SCORE_STATUS_STEPS = [
  'verifying_identity',
  'connecting_bureau',
  'generating_score',
] as const satisfies readonly CreditReportStatus[];

let cachedBureauRaw: string | null = null;
let cachedAdaptedReport: ReturnType<typeof adaptBureauReport> | null = null;

/**
 * Reads + adapts the stored Shape A payload once per distinct sessionStorage value.
 */
function getAdaptedStoredReport(): ReturnType<typeof adaptBureauReport> {
  if (typeof window === 'undefined') {
    throw new Error('No bureau report response is available');
  }
  const raw = sessionStorage.getItem(STORAGE_BUREAU_RESPONSE);
  if (!raw) {
    throw new Error('No bureau report response is available');
  }
  if (cachedAdaptedReport && cachedBureauRaw === raw) {
    return cachedAdaptedReport;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    throw new Error('No bureau report response is available');
  }
  const adapted = adaptBureauReport(parsed);
  cachedBureauRaw = raw;
  cachedAdaptedReport = adapted;
  return adapted;
}

/**
 * Abort-aware delay that keeps report progress states visible.
 */
function waitForProgressDelay(ms: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  return new Promise((resolve, reject) => {
    const timeoutId = globalThis.setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = (): void => {
      globalThis.clearTimeout(timeoutId);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

function assertNotAborted(signal: AbortSignal): void {
  if (signal.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }
}

export async function getCreditReportDashboard(): Promise<CreditReportDashboard> {
  return getAdaptedStoredReport().dashboard;
}

export async function getFullCreditReport(): Promise<CreditReportData> {
  return getAdaptedStoredReport().report;
}

export async function pollCreditScoreStatus(options: {
  readonly onStatus: (status: CreditReportStatus) => void;
  readonly signal: AbortSignal;
}): Promise<CreditReportDashboard> {
  assertNotAborted(options.signal);

  const stepDelayMs = Math.floor(SCORE_PROGRESS_DURATION_MS / SCORE_STATUS_STEPS.length);
  for (const nextStatus of SCORE_STATUS_STEPS) {
    assertNotAborted(options.signal);
    options.onStatus(nextStatus);
    await waitForProgressDelay(stepDelayMs, options.signal);
  }
  const dashboard = await getCreditReportDashboard();
  assertNotAborted(options.signal);
  options.onStatus('score_ready');
  return dashboard;
}

export async function pollFullCreditReportStatus(options: {
  readonly onStatus: (status: CreditReportStatus) => void;
  readonly signal: AbortSignal;
}): Promise<CreditReportData> {
  assertNotAborted(options.signal);
  options.onStatus('generating_full_report');

  await waitForProgressDelay(FULL_REPORT_PROCESSING_DURATION_MS, options.signal);

  const report = await getFullCreditReport();
  assertNotAborted(options.signal);
  options.onStatus('full_report_ready');
  return report;
}
