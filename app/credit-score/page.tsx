import { redirect } from 'next/navigation';
import { CREDIT_SCORE_PATH } from '@/lib/constants/credit-report-routes';

/**
 * Legacy route — credit score UI now lives under /bureau-report/credit-score/.
 */
const LegacyCreditScorePage = (): never => {
  redirect(CREDIT_SCORE_PATH);
};

export default LegacyCreditScorePage;
