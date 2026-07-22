import type { Metadata } from 'next';
import { CreditReportPage } from '@/components/credit-report';

export const metadata: Metadata = {
  title: 'Your Credit Report | WeCredit',
  description: 'View your Equifax credit score, factors, summary, and personalized loan offers.',
  robots: {
    index: false,
    follow: false,
  },
};

const BureauCreditScorePage = (): React.ReactNode => {
  return <CreditReportPage />;
};

export default BureauCreditScorePage;
