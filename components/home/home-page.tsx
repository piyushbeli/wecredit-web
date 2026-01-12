import React from 'react';
import HeroCarousel from './hero-carousel';
import StatsSection from './stats-section';
import ProductsSection from './products-section';
import TrendingOffersSection from './trending-offers-section';
import ToolsCalculatorsSection from './tools-calculators-section';
import TestimonialsSection from './testimonials-section';
import PartnersSection from './partners-section';
import FaqSection from './faq-section';
import BlogSection from './blog-section';
import type { ActiveLender } from '@/lib/utils/lenders';

/** Props for HomePage component */
interface HomePageProps {
  activeLenders: ActiveLender[];
}

/**
 * Main home page component that composes all sections
 * Uses continuous gradient from blue to white across hero and stats
 */
const HomePage = ({ activeLenders }: HomePageProps): React.ReactNode => {
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

      {/* Trending Offers Section */}
      <TrendingOffersSection activeLenders={activeLenders} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Our Partners Section */}
      <PartnersSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Blog Section */}
      <BlogSection />
    </div>
  );
};

export default HomePage;
