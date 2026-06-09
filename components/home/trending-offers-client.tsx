'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { fetchActiveLendersForUser } from '@/lib/api/wecredit';
import { filterActiveLenders } from '@/lib/utils/lenders';
import { useFilteredActiveLenders } from '@/hooks/use-filtered-active-lenders';
import type { ActiveLender } from '@/lib/utils/lenders';
import TrendingOffersSection from './trending-offers-section';
import TrendingOffersSkeleton from './trending-offers-skeleton';
import { useAuthCookies } from '@/hooks/use-auth-cookies';

/**
 * Client wrapper for TrendingOffersSection
 * 
 * Implements PDF Steps 2 & 3:
 * - Step 2: Fetches generic lenders (client-side) when user is NOT logged in
 * - Step 3: Fetches user-specific lenders (client-side) when user IS logged in
 * 
 * Completely independent component - handles all lender fetching internally
 */
const TrendingOffersClient = ({ heading = 'Trending Offers' }: { heading?: string }): React.ReactNode => {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // PDF Step 3: Fetch user-specific lenders when logged in
  const [userLenders, setUserLenders] = useState<ActiveLender[] | null>(null);
  const [isLoadingUserLenders, setIsLoadingUserLenders] = useState(false);
  const hasFetchedForUser = useRef<string | null>(null);

  // Directly check cookies for auth state to avoid hydration delays/multiple re-renders
  // causing double API calls
  const { mobile: mobileCookie, token: tokenCookie, hasAuthCookies } = useAuthCookies();

  // PDF Step 2: Fetch generic lenders (always fetched as fallback)
  // Only fetch generic if we don't have auth cookies (meaning user isn't logged in)
  // If they are logged in, we'll fetch personalized offers immediately
  const { activeLenders: genericLenders, isLoading: isLoadingGeneric } = useFilteredActiveLenders({
    fetchOnMount: !hasAuthCookies,
  });

  /**
   * PDF Step 3: Fetch user-specific lenders when user logs in
   * Only fetches once per user session (prevents duplicate calls)
   */
  useEffect(() => {
    // Ensure initial render matches server output to avoid hydration mismatch.
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const fetchUserLenders = async (): Promise<void> => {
      // Prioritize cookie data for faster/more stable check
      const currentMobile = mobileCookie || user?.phoneNumber;
      const isUserAuthenticated = !!((tokenCookie && mobileCookie) || (isAuthenticated && user?.phoneNumber));

      // User not logged in - use generic lenders
      if (!isUserAuthenticated || !currentMobile) {
        setUserLenders(null);
        hasFetchedForUser.current = null;
        return;
      }

      // Already fetched for this user - skip
      if (hasFetchedForUser.current === currentMobile) {
        return;
      }

      setIsLoadingUserLenders(true);

      try {
        const response = await fetchActiveLendersForUser(currentMobile);
        const filteredLenders = filterActiveLenders(response);
        setUserLenders(filteredLenders);
        hasFetchedForUser.current = currentMobile;
      } catch (error) {
        // Fall back to generic lenders on error
        setUserLenders(null);
      } finally {
        setIsLoadingUserLenders(false);
      }
    };

    fetchUserLenders();
    // We intentionally depend on the cookie values + store values to be reactive
    // but the hasFetchedForUser ref prevents duplicate calls for the same mobile
  }, [mobileCookie, tokenCookie, isAuthenticated, user?.phoneNumber]);

  // Determine which lenders to display
  // Priority: User-specific lenders (if logged in and fetched) > Generic lenders
  const displayLenders = (hasAuthCookies || isAuthenticated) && userLenders !== null
    ? userLenders
    : genericLenders;

  // Show loading state if either generic or user-specific lenders are loading
  const isAnyLoading = isLoadingGeneric || (isLoadingUserLenders && (hasAuthCookies || isAuthenticated));

  const showSkeleton =
    !isHydrated || (displayLenders.length === 0 && isAnyLoading);

  // Single stable root keyed by route so back/forward never reuses an Embla instance
  // from a different page (home vs personal-loan both mount this component).
  return (
    <div key={pathname} className="relative">
      {showSkeleton ? (
        <TrendingOffersSkeleton />
      ) : (
        <>
          {/* Subtle loading indicator when fetching lenders */}
          {isAnyLoading && (
            <div className="absolute top-2 right-4 z-10">
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full shadow-sm">
                <span className="w-3 h-3 border-2 border-wc-blue-500/30 border-t-wc-blue-500 rounded-full animate-spin" />
                <span>{(isLoadingUserLenders && (hasAuthCookies || isAuthenticated)) ? 'Personalizing...' : 'Loading...'}</span>
              </div>
            </div>
          )}
          <TrendingOffersSection activeLenders={displayLenders} heading={heading} />
        </>
      )}
    </div>
  );
};

export default TrendingOffersClient;
