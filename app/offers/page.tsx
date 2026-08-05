/**
 * Offers Screen Page
 * Displays loan offers with eligibility message and simplified layout.
 * Now a Server Component that handles initial authentication check.
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OffersView } from '@/components/offers';
import { PageLoader } from '@/components/shared/page-loader';
import { STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';
import {
  buildPathWithQuery,
  type AppRouterSearchParams,
  serializeAppRouterSearchParams,
} from '@/lib/utils/path-with-query';

interface PageProps {
  searchParams: Promise<AppRouterSearchParams>;
}

// Transactional, auth-gated page — keep it out of the index.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

/**
 * Offers Page Server Component
 */
const OffersPage = async ({ searchParams }: PageProps) => {
  const cookieStore = await cookies();
  const resolvedSearchParams = await searchParams;
  const preAuth = resolvedSearchParams.pre_auth;
  const token = cookieStore.get(STORAGE_AUTH_TOKEN)?.value ?? preAuth;
  if (!token) {
    const queryString = serializeAppRouterSearchParams(resolvedSearchParams);
    redirect(buildPathWithQuery('/personal-loan', queryString));
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <OffersView />
    </Suspense>
  );
};

export default OffersPage;
