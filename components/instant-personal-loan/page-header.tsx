'use client';

/**
 * Logo-only header for the Instant Personal Loan landing page.
 * Fixed frosted glass pill with scroll-aware logo/pill styling — mirrors MobileHeader.
 */

import { useState, useEffect, useCallback, JSX } from 'react';
import { cn } from '@/lib/utils';
import { SITE_NAME } from '@/lib/config/site-navigation';
import { HeaderLogo } from '@/components/home/mobile-header-components/header-logo';

/** Scroll threshold in pixels to trigger header style change */
const SCROLL_THRESHOLD = 50;

const PageHeader = (): JSX.Element => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const handleScroll = useCallback((): void => {
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  // Solid pill + dark logo when scrolled or on large screens (same as home MobileHeader)
  const showSolidHeader = isScrolled || isLargeScreen;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const handleChange = (): void => {
      setIsLargeScreen(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <header role="banner" className="fixed top-0 left-0 right-0 z-50 p-4">
      <div
        className={cn(
          'flex items-center rounded-xl px-4 py-2.5 wc-header-pill-transition',
          showSolidHeader ? 'wc-header-pill-scrolled' : 'wc-header-pill'
        )}
      >
        <HeaderLogo siteName={SITE_NAME} showSolidHeader={showSolidHeader} />
      </div>
    </header>
  );
};

export default PageHeader;
