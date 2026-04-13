'use client';

import { usePathname } from 'next/navigation';
import MobileHeader from '@/components/home/mobile-header';
import type { GlobalLink, StrapiMedia } from '@/types/strapi';

/** Routes where MobileHeader should NOT be displayed */
const HEADER_EXCLUDED_ROUTES = ['/offers/', '/offers/status/', '/our-partners/', '/business-loan/', '/gold-loan/', '/car-loan/',
  '/home-loan/', '/primepl-lead/', '/business-loan/'
];

interface ConditionalMobileHeaderProps {
  headerLinks: GlobalLink[];
  logo: StrapiMedia | null;
  siteName: string;
}

/**
 * Wrapper component that conditionally renders MobileHeader based on current route.
 * Returns null for routes listed in HEADER_EXCLUDED_ROUTES.
 */
const ConditionalMobileHeader = (props: ConditionalMobileHeaderProps) => {
  const pathname = usePathname();

  // Check if current route should hide the header
  const shouldHideHeader = HEADER_EXCLUDED_ROUTES.includes(pathname);
  
  if (shouldHideHeader) {
    return null;
  }

  return <MobileHeader {...props} />;
};

export default ConditionalMobileHeader;
