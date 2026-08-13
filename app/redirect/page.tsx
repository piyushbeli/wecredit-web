import { Suspense } from 'react';
import { PageLoader } from '@/components/shared/page-loader';
import LntRedirectClient from './lnt-redirect-client';

/**
 * LNT redirect entry — Suspense required for useSearchParams in the client page.
 */
const LntRedirectPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <LntRedirectClient />
    </Suspense>
  );
};

export default LntRedirectPage;
