import { HomePage } from '@/components/home';

/** Force dynamic rendering (no caching) for Pure SSR */
export const dynamic = 'force-dynamic';

/**
 * WeCredit Home page with hero carousel, stats, and product sections
 */
const Home = (): JSX.Element => {
  return <HomePage />;
};

export default Home;

