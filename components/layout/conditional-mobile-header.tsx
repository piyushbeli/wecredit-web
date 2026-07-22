'use client';

import { usePathname } from 'next/navigation';
import MobileHeader from '@/components/home/mobile-header';
import { useIsMobilePlatform } from '@/hooks/use-is-mobile-platform';
import { cn } from '@/lib/utils';

/** Routes where MobileHeader should NOT be displayed (with or without trailing slash). */
const HEADER_EXCLUDED_ROUTES = [
  '/offers',
  '/our-partners',
  '/business-loan',
  '/gold-loan',
  '/car-loan',
  '/home-loan',
  '/primepl-lead',
  '/instant-personal-loan',
  '/bureau-report',
] as const;

interface ConditionalMobileHeaderProps {
  siteName: string;
}

/**
 * Returns true when the current pathname should not show the global mobile header.
 */
function isHeaderExcludedPath(pathname: string | null): boolean {
  if (!pathname) {
    return false;
  }
  return HEADER_EXCLUDED_ROUTES.some((route) => {
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

/**
 * Wrapper that hides MobileHeader on fullscreen / app-shell routes.
 * Always keeps the same DOM structure on server and client to avoid hydration mismatches
 * when pathname/searchParams resolve differently during SSR vs first client paint.
 */
const ConditionalMobileHeader = (props: ConditionalMobileHeaderProps): React.ReactNode => {
  const pathname = usePathname();
  const isMobilePlatform = useIsMobilePlatform();
  const shouldHideHeader = isHeaderExcludedPath(pathname) || isMobilePlatform;

  return (
    <div
      suppressHydrationWarning
      className={cn(shouldHideHeader && 'hidden')}
      aria-hidden={shouldHideHeader}
    >
      <MobileHeader {...props} />
    </div>
  );
};

export default ConditionalMobileHeader;
