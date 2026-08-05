'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * True when the URL contains `?platform=mobile` (e.g. mobile app webview).
 * Reads the query on the client only so callers do not need a Suspense boundary
 * (unlike `useSearchParams()`, which breaks static prerender when unwrapped).
 */
export const useIsMobilePlatform = (): boolean => {
  const pathname = usePathname();
  const [isMobilePlatform, setIsMobilePlatform] = useState(false);

  useEffect(() => {
    const platformParam = new URLSearchParams(window.location.search).get('platform');
    setIsMobilePlatform(platformParam?.trim().toLowerCase() === 'mobile');
  }, [pathname]);

  return isMobilePlatform;
};
