import { useSearchParams } from 'next/navigation';

/**
 * True when the URL contains `?platform=mobile` (e.g. mobile app webview).
 */
export const useIsMobilePlatform = (): boolean => {
  const searchParams = useSearchParams();
  const platformParam = searchParams?.get('platform');

  if (!platformParam) {
    return false;
  }

  return platformParam.trim().toLowerCase() === 'mobile';
};
