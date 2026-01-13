'use client';

import { useEffect, useState } from 'react';
import { HomePage } from '@/components/home';
import { fetchActiveLenders } from '@/lib/api/wecredit';
import { filterActiveLenders } from '@/lib/utils/lenders';
import type { ActiveLender } from '@/lib/utils/lenders';

/**
 * WeCredit Home page with hero carousel, stats, and product sections
 * 
 * PDF Flow Implementation:
 * - Step 2: Generic lenders fetched client-side (visible in network tab)
 * - Step 3: User-specific lenders fetched in TrendingOffersClient (client-side)
 */
const Home = (): React.ReactNode => {
  const [activeLenders, setActiveLenders] = useState<ActiveLender[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * PDF Step 2: Fetch generic active lenders client-side (no mobile header)
     * This makes the API call visible in the browser's network tab
     */
    const fetchLenders = async (): Promise<void> => {
      try {
        console.info('[Home] Fetching generic active lenders...');
        const lendersResponse = await fetchActiveLenders();
        const filteredLenders = filterActiveLenders(lendersResponse);
        setActiveLenders(filteredLenders);
        console.info('[Home] Generic lenders fetched:', filteredLenders.length);
      } catch (error) {
        console.error('[Home] Failed to fetch generic lenders:', error);
        setActiveLenders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLenders();
  }, []);

  return <HomePage activeLenders={activeLenders} isLoading={isLoading} />;
};

export default Home;
