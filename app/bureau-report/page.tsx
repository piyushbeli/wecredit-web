import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import EligibilityCheckPageContent from '@/components/eligibility-check/eligibility-check-page-content';
import { PageLoader } from '@/components/shared/page-loader';

export const metadata: Metadata = {
  title: 'Eligibility Check | WeCredit',
  description:
    'Fill your details to get your credit report. Check your credit eligibility with WeCredit.',
};

const EligibilityCheckPage = (): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoader />}>
      <EligibilityCheckPageContent />
    </Suspense>
  );
};

export default EligibilityCheckPage;
