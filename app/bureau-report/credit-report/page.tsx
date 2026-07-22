import { redirect } from 'next/navigation';
import { CREDIT_SCORE_PATH } from '@/lib/constants/credit-report-routes';

const BureauCreditReportPage = (): never => {
  redirect(CREDIT_SCORE_PATH);
};

export default BureauCreditReportPage;
