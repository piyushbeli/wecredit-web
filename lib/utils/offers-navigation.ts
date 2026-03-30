import type { ReadonlyURLSearchParams } from 'next/navigation';

/**
 * Client navigations between `/offers` and `/offers/status` must keep the current query string
 * (partner, UTM, etc.) so affiliate attribution is not dropped mid-session.
 */
export function buildOffersPathWithQuery(
  pathname: '/offers' | '/offers/status',
  searchParams: ReadonlyURLSearchParams | null
): string {
  const qs = searchParams?.toString() ?? '';
  return qs ? `${pathname}?${qs}` : pathname;
}

/**
 * "Explore more" should show all lenders but still keep non-lender tracking params.
 * Removes only lender filter keys from a copy of the current query.
 */
export function buildOffersPathClearingLenderFilter(
  searchParams: ReadonlyURLSearchParams | null
): string {
  const qs = new URLSearchParams(searchParams?.toString() ?? '');
  qs.delete('lenderName');
  qs.delete('lendername');
  const s = qs.toString();
  return s ? `/offers?${s}` : '/offers';
}
