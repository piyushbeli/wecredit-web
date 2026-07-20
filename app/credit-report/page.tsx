import { redirect } from 'next/navigation';
import { CREDIT_REPORT_PATH } from '@/lib/constants/credit-report-routes';

/**
 * Legacy route — credit report UI now lives under /bureau-report/credit-report/.
 */
const LegacyCreditReportPage = (): never => {
  redirect(CREDIT_REPORT_PATH);
};

export default LegacyCreditReportPage;
