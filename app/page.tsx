import { HomePage } from '@/components/home';
import { fetchActiveLenders } from '@/lib/api/wecredit';
import { filterActiveLenders } from '@/lib/utils/lenders';

export const dynamic = 'force-static';
export const revalidate = 300; // 5 minutes

/**
 * WeCredit Home page with hero carousel, stats, and product sections
 * Fetches lender data server-side for ISR caching
 */
const Home = async (): Promise<React.ReactNode> => {
  const lendersResponse = await fetchActiveLenders();
  const activeLenders = filterActiveLenders(lendersResponse);

  return <HomePage activeLenders={activeLenders} />;
};

export default Home;
