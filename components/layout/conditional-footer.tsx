'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import { useIsMobilePlatform } from '@/hooks/use-is-mobile-platform';

/** Routes where Footer should NOT be displayed */
const FOOTER_EXCLUDED_ROUTES: string[] = [
  // Add routes here where footer should always be hidden
  // Example: '/partner-with-us' when showing success state
  '/partner-with-us',
  '/terms-of-service/',
  '/privacy-policy/',
  '/about-us/',
  '/contact-us/',
  '/faq/',
  '/grievance-redressal/',
  '/delete_account/',
  '/partner-terms-and-conditions/',
  '/calculator/personal-loan',
  '/our-partners/',
  '/instant-personal-loan/',
  '/login',
  '/otp-confirmation',
  // '/blog/',
  '/offers' // Exclude /offers route
];

/**
 * Wrapper component that conditionally renders Footer based on current route.
 * Returns null for routes listed in FOOTER_EXCLUDED_ROUTES, or when the session
 * URL includes `?platform=mobile` (e.g. opened from a mobile app webview).
 */
const ConditionalFooter = (): React.ReactNode => {
  const pathname = usePathname();
  const isMobilePlatform = useIsMobilePlatform();

  // Check if current route should hide the footer
  const shouldHideFooter = FOOTER_EXCLUDED_ROUTES.some((route) =>
    pathname?.startsWith(route)
  );

  if (isMobilePlatform || shouldHideFooter) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter;
