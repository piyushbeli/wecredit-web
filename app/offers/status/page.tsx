/**
 * Offers Status Screen Page
 * Displays loan status for UTM clicked offers.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OffersStatusView } from '@/components/offers';
import { STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';

/**
 * Offers Status Page Server Component
 */
const OffersStatusPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(STORAGE_AUTH_TOKEN)?.value;
  if (!token) {
    redirect('/personal-loan');
  }
  return <OffersStatusView />;
};

export default OffersStatusPage;
