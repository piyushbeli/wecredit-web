'use client';

import type { ReactNode } from 'react';
import { useIsMobilePlatform } from '@/hooks/use-is-mobile-platform';
import { BackToHomeButton } from './back-to-home-button';
import PageBanner from './page-banner';
import PageHeader from './page-header';

export type FooterLinkPageBanner = {
  title: string;
  iconImage: string;
  iconAlt?: string;
};

type FooterLinkPageWrapperProps = {
  children: ReactNode;
  /** When set, renders the standard PageBanner below the back button */
  banner?: FooterLinkPageBanner;
  /** Sticky back + title header (e.g. Our Partners). Use instead of banner on that route. */
  pageHeaderTitle?: string;
  /** Extra classes on the outer container (e.g. About Us uses lg:-mt-10) */
  className?: string;
  contentClassName?: string;
};

/**
 * Shared layout for footer-linked static pages opened in web or mobile app webview.
 * Hides back navigation and top offset when `?platform=mobile` (app provides its own chrome).
 */
export const FooterLinkPageWrapper = ({
  children,
  banner,
  pageHeaderTitle,
  className = '',
  contentClassName = '',
}: FooterLinkPageWrapperProps): ReactNode => {
  const isMobilePlatform = useIsMobilePlatform();
  const usesPageHeader = Boolean(pageHeaderTitle);
  // Routes with PageHeader exclude the site mobile header — no extra top offset needed
  const topPadding = !isMobilePlatform && !usesPageHeader ? 'pt-18' : '';
  const desktopTopPadding = usesPageHeader ? '' : 'md:pt-28';

  return (
    <div
      className={`w-full ${topPadding} ${desktopTopPadding} pb-8 md:pb-12 ${className}`.trim()}
    >
      {usesPageHeader && pageHeaderTitle && (
        <PageHeader title={pageHeaderTitle} />
      )}

      {!isMobilePlatform && (
        <div className="mx-4 mt-4 sm:hidden">
          <BackToHomeButton />
        </div>
      )}

      {banner && (
        <div className="my-4 mx-4 flex justify-center">
          <PageBanner
            title={banner.title}
            iconImage={banner.iconImage}
            iconAlt={banner.iconAlt}
          />
        </div>
      )}

      {contentClassName ? (
        <div className={contentClassName}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
};
