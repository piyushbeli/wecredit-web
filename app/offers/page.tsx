'use client';

/**
 * Offers Screen Page
 * Simplified design matching screenshot mockup
 * Displays loan offers with eligibility message and simplified layout
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useOffers } from '@/hooks/use-offers';
import { OfferCard } from '@/components/offers/offer-card';
import { OffersHero } from '@/components/offers/offers-hero';
import type { LenderOfferStatus } from '@/types/wecredit';

/**
 * Offers Page Component
 */
export default function OffersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { offers, isLoading, error, fetchOffers } = useOffers();

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
      window.open(offer.utmLink, '_blank');
    }
  };

  /**
   * Handle check loan status button click
   */
  const handleCheckStatus = (): void => {
    // Navigate to loan status page or open status modal
    // This can be implemented based on your requirements
    console.log('Check loan status clicked');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <OffersLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorState error={error} onRetry={fetchOffers} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Simplified Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Go back"
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
            <h1 className="text-xl font-semibold text-gray-900">Loan offers</h1>
          </div>
        </div>
      </header>

      {/* Hero Section with Eligibility Message */}
      <OffersHero eligibleAmount="₹1,00,000" offerCount={offers.length} />

      {/* Offers List */}
      <div className="px-4 py-4 pb-28">
        {offers.length > 0 ? (
          <div className="space-y-4">
            {offers.map((offer, index) => (
              <OfferCard
                key={`${offer.lenderName}-${index}`}
                offer={offer}
                onClick={() => handleOfferClick(offer)}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Fixed Bottom CTA - Check Loan Status */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-10">
        <button
          onClick={handleCheckStatus}
          className="w-full py-4 bg-blue-600 text-white font-semibold text-base rounded-full hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-500/30"
        >
          Check your Loan Status
        </button>
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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="h-6 bg-gray-200 rounded w-32" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="bg-white px-4 py-6">
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-3" />
          <div className="h-5 bg-gray-200 rounded w-64 mx-auto" />
        </div>
      </div>

      {/* Offers skeleton */}
      <div className="px-4 py-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
              </div>
              <div className="w-20 h-20 bg-gray-200 rounded-full" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-4" />
            <div className="h-12 bg-gray-200 rounded-xl" />
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
function EmptyState() {
  return (
    <div className="px-4 py-12 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
        <span className="text-5xl">📋</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        No Offers Available
      </h2>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        We couldn't find any loan offers at the moment. Please check back later or complete your profile.
      </p>
    </div>
  );
}
