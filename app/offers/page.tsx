'use client';

/**
 * Offers Screen Page
 * Displays user's loan application statuses and offers
 * Implements check-status-all and hit-all-lenders APIs
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useOffers } from '@/hooks/use-offers';
import { OfferCard } from '@/components/offers/offer-card';
import { STATUS_CODES } from '@/types/wecredit';
import type { WcStatus, LenderOfferStatus } from '@/types/wecredit';
import { cn } from '@/lib/utils';

/**
 * Status filter tabs
 */
const STATUS_FILTERS: Array<{ label: string; value: WcStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Ready', value: 'INITIATED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Reviewing', value: 'UNDER_REVIEW' },
  { label: 'Rejected', value: 'REJECTED' },
];

/**
 * Offers Page Component
 */
export default function OffersPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const {
    offers,
    isLoading,
    error,
    canReHit,
    isReHitting,
    statusCode,
    fetchOffers,
    reHitLenders,
    filterByStatus,
    statusCounts,
  } = useOffers();

  const [selectedFilter, setSelectedFilter] = useState<WcStatus | 'ALL'>('ALL');
  const filteredOffers = filterByStatus(selectedFilter);

  /**
   * Redirect to personal loan page if not authenticated
   */
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/personal-loan');
    }
  }, [isAuthenticated, router]);

  /**
   * Handle offer card click
   */
  const handleOfferClick = (offer: LenderOfferStatus): void => {
    if (offer.utmLink) {
      // Open lender application in new tab
      window.open(offer.utmLink, '_blank');
    } else {
      // Log for debugging - in production, might show a message
      console.log('Offer clicked:', offer.lenderName, offer.wcStatus);
    }
  };

  /**
   * Handle re-hit lenders button click
   */
  const handleReHit = async (): Promise<void> => {
    await reHitLenders();
  };

  // Show loading skeleton on initial load
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <OffersLoadingSkeleton />
      </div>
    );
  }

  // Show error state with retry
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <ErrorState error={error} onRetry={fetchOffers} />
      </div>
    );
  }

  // Determine if we should show empty state
  const showEmptyState = offers.length === 0 && statusCode !== STATUS_CODES.NO_OFFERS_CAN_REHIT;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Your Offers</h1>
              {user?.phoneNumber && (
                <p className="text-xs text-gray-600">
                  {user.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          {offers.length > 0 && (
            <div className="flex gap-4 text-center py-3 bg-blue-50 rounded-xl">
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Total Offers</p>
                <p className="text-lg font-bold text-blue-600">{offers.length}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Ready to Apply</p>
                <p className="text-lg font-bold text-green-600">
                  {statusCounts.INITIATED}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Approved</p>
                <p className="text-lg font-bold text-purple-600">
                  {statusCounts.APPROVED}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        {offers.length > 0 && (
          <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {STATUS_FILTERS.map((filter) => {
                const count = statusCounts[filter.value];
                if (count === 0 && filter.value !== 'ALL') return null;

                return (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                      selectedFilter === filter.value
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                    )}
                  >
                    {filter.label}
                    {count > 0 && (
                      <span className="ml-1.5 text-xs">({count})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Empty State */}
        {showEmptyState && (
          <EmptyState onReHit={canReHit ? handleReHit : undefined} />
        )}

        {/* No Offers with Re-hit Available */}
        {statusCode === STATUS_CODES.NO_OFFERS_CAN_REHIT && (
          <NoOffersReHitState onReHit={handleReHit} isReHitting={isReHitting} />
        )}

        {/* Offers Grid */}
        {filteredOffers.length > 0 && (
          <div className="space-y-4">
            {filteredOffers.map((offer, index) => (
              <OfferCard
                key={`${offer.lenderName}-${index}`}
                offer={offer}
                onClick={() => handleOfferClick(offer)}
              />
            ))}
          </div>
        )}

        {/* Re-hit Button (shown when offers exist and more lenders available) */}
        {offers.length > 0 && canReHit && (
          <div className="mt-6">
            <button
              onClick={handleReHit}
              disabled={isReHitting}
              className={cn(
                'w-full py-4 rounded-xl font-semibold text-base',
                'bg-linear-to-r from-purple-500 to-purple-600',
                'text-white shadow-lg shadow-purple-500/30',
                'hover:from-purple-600 hover:to-purple-700',
                'active:scale-[0.98] transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isReHitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Checking for More Offers...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🔄</span>
                  Check More Lenders
                </span>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              We'll check with more lenders to find you the best offers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Loading Skeleton Component
 */
function OffersLoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
        </div>
        <div className="h-20 bg-gray-100 rounded-xl" />
      </div>

      {/* Offers skeleton */}
      <div className="px-4 py-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden">
            <div className="h-32 bg-gray-200" />
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-16 bg-gray-100 rounded-lg" />
                ))}
              </div>
              <div className="h-12 bg-gray-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Error State Component
 */
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="px-4 py-12 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Unable to Load Offers
      </h2>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

/**
 * Empty State Component
 */
function EmptyState({ onReHit }: { onReHit?: () => void }) {
  return (
    <div className="px-4 py-12 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
        <span className="text-5xl">📋</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        No Offers Yet
      </h2>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        You don't have any loan offers at the moment. Complete your profile to get personalized offers.
      </p>
      {onReHit && (
        <button
          onClick={onReHit}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Check for Offers
        </button>
      )}
    </div>
  );
}

/**
 * No Offers with Re-hit Available State
 */
function NoOffersReHitState({ onReHit, isReHitting }: { onReHit: () => void; isReHitting: boolean }) {
  return (
    <div className="px-4 py-12 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-50 flex items-center justify-center">
        <span className="text-5xl">🔍</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        No Offers Found
      </h2>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        We couldn't find any offers right now, but we can check with more lenders for you.
      </p>
      <button
        onClick={onReHit}
        disabled={isReHitting}
        className={cn(
          'px-8 py-4 rounded-xl font-semibold text-base',
          'bg-linear-to-r from-blue-500 to-blue-600',
          'text-white shadow-lg shadow-blue-500/30',
          'hover:from-blue-600 hover:to-blue-700',
          'active:scale-[0.98] transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isReHitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Checking...
          </span>
        ) : (
          'Check More Lenders'
        )}
      </button>
    </div>
  );
}
