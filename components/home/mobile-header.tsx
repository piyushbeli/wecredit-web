'use client';

import { useState, useEffect, useCallback, useMemo, JSX } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { getVisibleHeaderLinks } from '@/lib/config/site-navigation';
import { HeaderLogo } from './mobile-header-components/header-logo';
import { UserButton } from './mobile-header-components/user-button';
import { MenuButton } from './mobile-header-components/menu-button';
import { MobileMenuDrawer } from './mobile-header-components/mobile-menu-drawer';
import { DesktopNavLinks } from './mobile-header-components/desktop-nav-links';

/** Scroll threshold in pixels to trigger header style change */
const SCROLL_THRESHOLD = 50;

/** Props for MobileHeader component */
interface MobileHeaderProps {
  siteName: string;
}

/**
 * Mobile-first sticky header with scroll-aware styling and slide-out menu drawer.
 * Transitions from transparent to white background when user scrolls down.
 */
const MobileHeader = ({ siteName }: MobileHeaderProps): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, openAuthModal, logout } = useAuth();
  const visibleHeaderLinks = useMemo(
    () => getVisibleHeaderLinks(isAuthenticated),
    [isAuthenticated]
  );

  /** Only show transparent glass pill on home page */
  const isHomePage = pathname === '/';

  /** Handle scroll events to toggle header style */
  const handleScroll = useCallback((): void => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > SCROLL_THRESHOLD);
  }, []);
 
  /** Show solid header variant when scrolled OR when not on home page */
  const showSolidHeader = isScrolled || !isHomePage || isLargeScreen;
  useEffect(() => {
  const mediaQuery = window.matchMedia('(min-width: 1024px)');

  const handleChange = () => {
    setIsLargeScreen(mediaQuery.matches);
  };

  handleChange(); // initial check
  mediaQuery.addEventListener('change', handleChange);

  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}, []);

  useEffect(() => {
    // Check initial scroll position on mount
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 p-4 lg:p-0 lg:bg-white">
        <div
          className={cn(
            'grid lg:grid-cols-[1fr_auto_1fr] grid-cols-[1fr_1fr] items-center px-4 lg:px-8 py-2 rounded-md wc-header-pill-transition lg:rounded-none xl:px-0 lg:py-3 lg:max-w-7xl lg:mx-auto lg:bg-transparent lg:shadow-none',
            showSolidHeader ? 'wc-header-pill-scrolled' : 'wc-header-pill'
          )}
        >
          <HeaderLogo siteName={siteName} showSolidHeader={showSolidHeader} />

          <DesktopNavLinks headerLinks={visibleHeaderLinks} />

          <div className="flex items-center justify-end gap-2">
            <UserButton
              isAuthenticated={isAuthenticated}
              user={user}
              showSolidHeader={showSolidHeader}
              toggleMenu={toggleMenu}
              openAuthModal={openAuthModal}
            />

            <div className="lg:hidden">
              <MenuButton toggleMenu={toggleMenu} showSolidHeader={showSolidHeader} />
            </div>
          </div>
        </div>
      </header>

      {/* Menu Drawer */}
      <MobileMenuDrawer
        isMenuOpen={isMenuOpen}
        closeMenu={closeMenu}
        siteName={siteName}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
        openAuthModal={openAuthModal}
        headerLinks={visibleHeaderLinks}
      />
    </>
  );
};

export default MobileHeader;

