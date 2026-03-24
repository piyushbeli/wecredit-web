'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/Footer';

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
  '/calculator/personal-loan',
  '/our-partners/',
  // '/blog/',
  '/offers' // Exclude /offers route
];

/**
 * Wrapper component that conditionally renders Footer based on current route.
 * Returns null for routes listed in FOOTER_EXCLUDED_ROUTES.
 */
const ConditionalFooter = (): React.ReactNode => {
  const pathname = usePathname();

  // Check if current route should hide the footer
  const shouldHideFooter = FOOTER_EXCLUDED_ROUTES.some((route) =>
    pathname?.startsWith(route)
  );

  if (shouldHideFooter) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter;
