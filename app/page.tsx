import { HomePage } from '@/components/home';
import { CACHE_TIMES } from '@/lib/constants/common';

/** Force dynamic rendering (no caching) for Pure SSR */
export const dynamic = 'force-static';
export const revalidate = CACHE_TIMES.MINUTE_5; // 5 minutes

/**
 * WeCredit Home page with hero carousel, stats, and product sections
 */
const Home = (): React.ReactNode => {
  return <HomePage />;
};

export default Home;

