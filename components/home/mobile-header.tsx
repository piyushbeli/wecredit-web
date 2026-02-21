'use client';

import { useState, useEffect, useCallback, JSX } from 'react';
import { usePathname } from 'next/navigation';
import type { GlobalLink, StrapiMedia } from '@/types/strapi';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { useAuthCookies } from '@/hooks/use-auth-cookies';
import { HeaderLogo } from './mobile-header-components/header-logo';
import { UserButton } from './mobile-header-components/user-button';
import { MenuButton } from './mobile-header-components/menu-button';
import { MobileMenuDrawer } from './mobile-header-components/mobile-menu-drawer';
import { px } from 'framer-motion';

/** Scroll threshold in pixels to trigger header style change */
const SCROLL_THRESHOLD = 50;

/** Props for MobileHeader component */
interface MobileHeaderProps {
  headerLinks: GlobalLink[];
  logo: StrapiMedia | null;
  siteName: string;
}

/**
 * Mobile-first sticky header with scroll-aware styling and slide-out menu drawer.
 * Transitions from transparent to white background when user scrolls down.
 */
const MobileHeader = ({ headerLinks, logo, siteName }: MobileHeaderProps): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, openAuthModal, logout } = useAuth();

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
<header className="fixed top-0 left-0 right-0 z-50 p-4 lg:p-0">
          <div
          className={cn(
            'flex items-center justify-between px-4 py-2 rounded-md wc-header-pill-transition lg:rounded-[0]',
            showSolidHeader ? 'wc-header-pill-scrolled' : 'wc-header-pill'
          )}
        >
          {/* Logo - switches between light and dark variants based on header state */}
          <HeaderLogo siteName={siteName} showSolidHeader={showSolidHeader} />

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Login/User Button */}
            <UserButton
              isAuthenticated={isAuthenticated}
              user={user}
              showSolidHeader={showSolidHeader}
              toggleMenu={toggleMenu}
              openAuthModal={openAuthModal}
            />

            {/* Hamburger Menu Button */}
            <MenuButton toggleMenu={toggleMenu} showSolidHeader={showSolidHeader} />
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
        headerLinks={headerLinks}
      />
    </>
  );
};

export default MobileHeader;

