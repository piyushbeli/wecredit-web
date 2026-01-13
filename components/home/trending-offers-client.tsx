'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { fetchActiveLendersForUser } from '@/lib/api/wecredit';
import { filterActiveLenders } from '@/lib/utils/lenders';
import { useFilteredActiveLenders } from '@/hooks/use-filtered-active-lenders';
import type { ActiveLender } from '@/lib/utils/lenders';
import TrendingOffersSection from './trending-offers-section';
import TrendingOffersSkeleton from './trending-offers-skeleton';

/**
 * Client wrapper for TrendingOffersSection
 * 
 * Implements PDF Steps 2 & 3:
 * - Step 2: Fetches generic lenders (client-side) when user is NOT logged in
 * - Step 3: Fetches user-specific lenders (client-side) when user IS logged in
 * 
 * Completely independent component - handles all lender fetching internally
 */
const TrendingOffersClient = (): React.ReactNode => {
  const { isAuthenticated, user } = useAuthStore();
  
  // PDF Step 2: Fetch generic lenders (always fetched as fallback)
  const { activeLenders: genericLenders, isLoading: isLoadingGeneric } = useFilteredActiveLenders();
  
  // PDF Step 3: Fetch user-specific lenders when logged in
  const [userLenders, setUserLenders] = useState<ActiveLender[] | null>(null);
  const [isLoadingUserLenders, setIsLoadingUserLenders] = useState(false);
  const hasFetchedForUser = useRef<string | null>(null);

  /**
   * PDF Step 3: Fetch user-specific lenders when user logs in
   * Only fetches once per user session (prevents duplicate calls)
   */
  useEffect(() => {
    const fetchUserLenders = async (): Promise<void> => {
      // User not logged in - use generic lenders
      if (!isAuthenticated || !user?.phoneNumber) {
        setUserLenders(null);
        hasFetchedForUser.current = null;
        return;
      }

      // Already fetched for this user - skip
      if (hasFetchedForUser.current === user.phoneNumber) {
        return;
      }

      setIsLoadingUserLenders(true);
      
      try {
        const response = await fetchActiveLendersForUser(user.phoneNumber);
        const filteredLenders = filterActiveLenders(response);
        setUserLenders(filteredLenders);
        hasFetchedForUser.current = user.phoneNumber;
      } catch (error) {
        // Fall back to generic lenders on error
        setUserLenders(null);
      } finally {
        setIsLoadingUserLenders(false);
      }
    };

    fetchUserLenders();
  }, [isAuthenticated, user?.phoneNumber]);

  // Determine which lenders to display
  // Priority: User-specific lenders (if logged in and fetched) > Generic lenders
  const displayLenders = isAuthenticated && userLenders !== null
    ? userLenders
    : genericLenders;

  // Show loading state if either generic or user-specific lenders are loading
  const isAnyLoading = isLoadingGeneric || (isLoadingUserLenders && isAuthenticated);

  // Show skeleton when loading and no lenders available
  if (displayLenders.length === 0 && isAnyLoading) {
    return <TrendingOffersSkeleton />;
  }

  return (
    <div className="relative">
      {/* Subtle loading indicator when fetching lenders */}
      {isAnyLoading && (
        <div className="absolute top-2 right-4 z-10">
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full shadow-sm">
            <span className="w-3 h-3 border-2 border-wc-blue-500/30 border-t-wc-blue-500 rounded-full animate-spin" />
            <span>{isLoadingUserLenders && isAuthenticated ? 'Personalizing...' : 'Loading...'}</span>
          </div>
        </div>
      )}
      <TrendingOffersSection activeLenders={displayLenders} />
    </div>
  );
};

export default TrendingOffersClient;
