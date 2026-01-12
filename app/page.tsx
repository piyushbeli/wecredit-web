import { HomePage } from '@/components/home';
import { REVALIDATE } from '@/lib/config/cache';

/** Force dynamic rendering (no caching) for Pure SSR */
export const dynamic = 'force-static';
export const revalidate = REVALIDATE.HOME;

/**
 * WeCredit Home page with hero carousel, stats, and product sections
 */
const Home = (): React.ReactNode => {
  return <HomePage />;
};

export default Home;

