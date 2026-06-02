'use client';

import { usePathname } from 'next/navigation';
import MobileHeader from '@/components/home/mobile-header';
import { useIsMobilePlatform } from '@/hooks/use-is-mobile-platform';
import type { NavigationLink } from '@/types/navigation';

/** Routes where MobileHeader should NOT be displayed */
const HEADER_EXCLUDED_ROUTES = ['/offers/', '/offers/status/', '/our-partners/', '/business-loan/', '/gold-loan/', '/car-loan/',
  '/home-loan/', '/primepl-lead/', '/business-loan/'
];

interface ConditionalMobileHeaderProps {
  headerLinks: NavigationLink[];
  siteName: string;
}

/**
 * Wrapper component that conditionally renders MobileHeader based on current route.
 * Returns null for routes listed in HEADER_EXCLUDED_ROUTES, or when the session
 * URL includes `?platform=mobile` (e.g. opened from a mobile app webview).
 */
const ConditionalMobileHeader = (props: ConditionalMobileHeaderProps) => {
  const pathname = usePathname();
  const isMobilePlatform = useIsMobilePlatform();

  // Check if current route should hide the header
  const shouldHideHeader = HEADER_EXCLUDED_ROUTES.includes(pathname);

  if (isMobilePlatform || shouldHideHeader) {
    return null;
  }

  return <MobileHeader {...props} />;
};

export default ConditionalMobileHeader;
