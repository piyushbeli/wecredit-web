/**
 * Campaign Form Page
 * Server component that handles initial parameters and renders the client-side landing
 */

import { PARTNER_CODE } from '@/lib/constants/api-keys';
import { CampaignLandingClient } from '@/components/pages/campaign-landing-client';
import { Suspense } from 'react';
import { PageLoader } from '@/components/shared/page-loader';

interface PageProps {
  params: Promise<{ lender: string }>;
  searchParams: Promise<{ partner?: string }>;
}

/**
 * Campaign form page server component
 * Extracts parameters and hands off to the client-side landing component
 */
export default async function CampaignFormPage({ params, searchParams }: PageProps) {
  const { lender } = await params;
  const { partner } = await searchParams;
  
  const lenderName = lender || '';
  const partnerCode = partner || PARTNER_CODE;

  return (
    <Suspense fallback={<PageLoader />}>
      <CampaignLandingClient 
        lenderName={lenderName} 
        partnerCode={partnerCode} 
      />
    </Suspense>
  );
}
