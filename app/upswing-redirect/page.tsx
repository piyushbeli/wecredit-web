import { Suspense } from 'react';
import { PageLoader } from '@/components/shared/page-loader';
import UpswingRedirectClient from './upswing-redirect-client';

/**
 * Upswing redirect entry — Suspense required for useSearchParams in the client page.
 */
const UpswingRedirectPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <UpswingRedirectClient />
    </Suspense>
  );
};

export default UpswingRedirectPage;
