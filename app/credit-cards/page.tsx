import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { Suspense } from 'react';
import CreditCardsPageContent from '@/components/credit-cards/credit-cards-page-content';
import { PageLoader } from '@/components/shared/page-loader';

export const metadata: Metadata = {
  ...buildPageMetadata('/credit-cards/'),
  robots: { index: false },
};

const CreditCardsPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <CreditCardsPageContent />
    </Suspense>
  );
};

export default CreditCardsPage;
