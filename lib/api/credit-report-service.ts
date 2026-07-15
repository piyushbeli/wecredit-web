import { getStoredBureauResponse } from '@/lib/utils/bureau-pdf';
import { adaptBureauReport } from '@/lib/utils/credit-report-adapter';
import type { CreditReportDashboard, CreditReportData, CreditReportStatus } from '@/types/credit-report';

function getAdaptedStoredReport(): ReturnType<typeof adaptBureauReport> {
  const response = getStoredBureauResponse();
  if (!response) throw new Error('No bureau report response is available');
  return adaptBureauReport(response);
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
  if (options.signal.aborted) throw new DOMException('Aborted', 'AbortError');
  options.onStatus('generating_score');
  const dashboard = await getCreditReportDashboard();
  options.onStatus('score_ready');
  return dashboard;
}

export async function pollFullCreditReportStatus(options: {
  readonly onStatus: (status: CreditReportStatus) => void;
  readonly signal: AbortSignal;
}): Promise<CreditReportData> {
  if (options.signal.aborted) throw new DOMException('Aborted', 'AbortError');
  options.onStatus('generating_full_report');
  const report = await getFullCreditReport();
  options.onStatus('full_report_ready');
  return report;
}
