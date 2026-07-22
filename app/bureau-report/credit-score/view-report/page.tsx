import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CreditReportPage } from '@/components/credit-report';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';

export const metadata: Metadata = {
  title: 'Full Credit Report | WeCredit',
  description: 'View your complete Equifax credit report.',
  robots: {
    index: false,
    follow: false,
  },
};

const BureauFullReportPage = async (): Promise<React.ReactNode> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(STORAGE_AUTH_TOKEN)?.value;
  const mobile = cookieStore.get(STORAGE_MOBILE)?.value;
  if (!token || !mobile) {
    redirect('/bureau-report/');
  }
  return <CreditReportPage />;
};

export default BureauFullReportPage;
