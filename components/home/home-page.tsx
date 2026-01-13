import React from 'react';
import HeroCarousel from './hero-carousel';
import StatsSection from './stats-section';
import ProductsSection from './products-section';
import TrendingOffersClient from './trending-offers-client';
import ToolsCalculatorsSection from './tools-calculators-section';
import TestimonialsSection from './testimonials-section';
import PartnersSection from './partners-section';
import FaqSection from './faq-section';
import BlogSection from './blog-section';
import DreamsSection from './dreams-section';
import type { ActiveLender } from '@/lib/utils/lenders';

/** Props for HomePage component */
interface HomePageProps {
  /** Generic active lenders fetched client-side (PDF Step 2) */
  activeLenders: ActiveLender[];
  /** Loading state for initial lenders fetch */
  isLoading?: boolean;
}

/**
 * Main home page component that composes all sections
 * Uses continuous gradient from blue to white across hero and stats
 * 
 * Lender Display Flow (PDF Steps 2 & 3):
 * - Client fetches generic lenders (Step 2) - visible in network tab
 * - TrendingOffersClient handles user-specific lenders when logged in (Step 3)
 */
const HomePage = ({ activeLenders, isLoading = false }: HomePageProps): React.ReactNode => {
  return (
    <div className="min-h-screen">
      {/* Gradient wrapper for Hero + Stats for seamless transition */}
      <div className="wc-hero-gradient-wrapper">
        {/* Hero Section with Carousel */}
        <HeroCarousel />
        
        {/* Stats Section - integrated into gradient */}
        <StatsSection />
      </div>
      
      {/* Products Section - on white background */}
      <ProductsSection />

      {/* Tools & Calculators Section */}
      <ToolsCalculatorsSection />

      {/* Trending Offers Section
          - Uses generic lenders as fallback (PDF Step 2) - fetched client-side
          - Fetches user-specific lenders when logged in (PDF Step 3) */}
      <TrendingOffersClient genericLenders={activeLenders} isLoadingGeneric={isLoading} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Our Partners Section */}
      <PartnersSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Blog Section */}
      <BlogSection />

      {/* Dreams Section */}
      <DreamsSection />
    </div>
  );
};

export default HomePage;
