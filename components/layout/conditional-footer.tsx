'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import { useIsMobilePlatform } from '@/hooks/use-is-mobile-platform';
import { cn } from '@/lib/utils';

/** Routes where Footer should NOT be displayed (prefix match). */
const FOOTER_EXCLUDED_ROUTES: string[] = [
  '/partner-with-us',
  '/terms-of-service',
  '/privacy-policy',
  '/about-us',
  '/contact-us',
  '/faq',
  '/grievance-redressal',
  '/delete_account',
  '/partner-terms-and-conditions',
  '/calculator/personal-loan',
  '/our-partners',
  '/instant-personal-loan',
  '/login',
  '/otp-confirmation',
  '/offers',
  '/bureau-report',
];

/**
 * Returns true when the current pathname should not show the global footer.
 */
function isFooterExcludedPath(pathname: string | null): boolean {
  if (!pathname) {
    return false;
  }
  return FOOTER_EXCLUDED_ROUTES.some((route) => {
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

/**
 * Wrapper that hides Footer on excluded routes.
 * Keeps a stable DOM wrapper so SSR/client pathname differences do not hydrate-mismatch.
 */
const ConditionalFooter = (): React.ReactNode => {
  const pathname = usePathname();
  const isMobilePlatform = useIsMobilePlatform();
  const shouldHideFooter = isFooterExcludedPath(pathname) || isMobilePlatform;

  return (
    <div
      suppressHydrationWarning
      className={cn(shouldHideFooter && 'hidden')}
      aria-hidden={shouldHideFooter}
    >
      <Footer />
    </div>
  );
};

export default ConditionalFooter;
