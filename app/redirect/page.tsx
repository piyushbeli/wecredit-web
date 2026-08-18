import { Suspense } from 'react';
import { PageLoader } from '@/components/shared/page-loader';
import LenderRedirectClient from './lender-redirect-client';

/**
 * Lender redirect entry — Suspense required for useSearchParams in the client page.
 * Expects `phone` and `lenderName` query params.
 */
const LenderRedirectPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <LenderRedirectClient />
    </Suspense>
  );
};

export default LenderRedirectPage;
