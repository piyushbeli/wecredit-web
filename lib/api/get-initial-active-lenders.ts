/**
 * Server-side fetch of generic active lenders for the initial (SSR) paint of
 * the trending-offers section. Rendering these on the server puts lender
 * content in the initial HTML (crawlable) before client-side personalization.
 *
 * Uses ISR caching so the loan pages stay cacheable rather than fully dynamic.
 */

import { fetchActiveLenders } from './wecredit';
import { filterActiveLenders, type ActiveLender } from '@/lib/utils/lenders';

/** Cache the generic lender list for five minutes (matches other WeCredit caches). */
const SSR_LENDERS_REVALIDATE_SECONDS = 300;

export async function getInitialActiveLenders(): Promise<ActiveLender[]> {
  const response = await fetchActiveLenders({
    revalidateSeconds: SSR_LENDERS_REVALIDATE_SECONDS,
  });
  return filterActiveLenders(response);
}
