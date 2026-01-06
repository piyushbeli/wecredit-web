import React from 'react';
import HeroCarousel from './hero-carousel';
import StatsSection from './stats-section';
import ProductsSection from './products-section';

/**
 * Main home page component that composes all sections
 * Uses continuous gradient from blue to white across hero and stats
 */
const HomePage = (): React.ReactNode => {
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
    </div>
  );
};

export default HomePage;

