/**
 * Offers Status Screen Page
 * Displays loan status for UTM clicked offers.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OffersStatusView } from '@/components/offers';
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
 * Offers Status Page Server Component
 */
const OffersStatusPage = async ({ searchParams }: PageProps) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(STORAGE_AUTH_TOKEN)?.value;
  const resolvedSearchParams = await searchParams;
  if (!token) {
    const queryString = serializeAppRouterSearchParams(resolvedSearchParams);
    redirect(buildPathWithQuery('/personal-loan', queryString));
  }
  return <OffersStatusView />;
};

export default OffersStatusPage;
