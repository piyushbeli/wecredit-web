import creditReportMockData from '@/mocks/credit-report.json';
import type { CreditReportDashboard } from '@/types/credit-report';

/**
 * Fetches the credit-report dashboard payload.
 * Currently returns mock JSON; swap for GET /api/v1/credit-report/dashboard later.
 */
export async function getCreditReportDashboard(): Promise<CreditReportDashboard> {
  // TODO: Replace mock with API call, e.g. GET /api/v1/credit-report/dashboard
  return creditReportMockData as CreditReportDashboard;
}
