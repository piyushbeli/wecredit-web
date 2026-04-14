/**
 * Offers Screen Page
 * Displays loan offers with eligibility message and simplified layout.
 * Now a Server Component that handles initial authentication check.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OffersView } from '@/components/offers';
import { STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';
import {
  buildPathWithQuery,
  type AppRouterSearchParams,
  serializeAppRouterSearchParams,
} from '@/lib/utils/path-with-query';

interface PageProps {
  searchParams: Promise<AppRouterSearchParams>;
}

/**
 * Offers Page Server Component
 */
const OffersPage = async ({ searchParams }: PageProps) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(STORAGE_AUTH_TOKEN)?.value;
  const resolvedSearchParams = await searchParams;
  if (!token) {
    const queryString = serializeAppRouterSearchParams(resolvedSearchParams);
    redirect(buildPathWithQuery('/personal-loan', queryString));
  }
  return <OffersView />;
};

export default OffersPage;
