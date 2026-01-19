/**
 * Offers Screen Page
 * Displays loan offers with eligibility message and simplified layout.
 * Now a Server Component that handles initial authentication check.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OffersView } from '@/components/offers';
import { STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';

/**
 * Offers Page Server Component
 */
const OffersPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(STORAGE_AUTH_TOKEN)?.value;
  if (!token) {
    redirect('/personal-loan');
  }
  return <OffersView />;
};

export default OffersPage;
