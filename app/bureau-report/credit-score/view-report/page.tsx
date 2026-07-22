import type { Metadata } from 'next';
import { CreditReportPage } from '@/components/credit-report';

export const metadata: Metadata = {
  title: 'Full Credit Report | WeCredit',
  description: 'View your complete Equifax credit report.',
  robots: {
    index: false,
    follow: false,
  },
};

const BureauFullReportPage = (): React.ReactNode => {
  return <CreditReportPage />;
};

export default BureauFullReportPage;
