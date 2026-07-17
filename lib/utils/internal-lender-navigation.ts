export const LENDER_SOURCE_PARAM = 'source';
export const TRENDING_OFFERS_SOURCE = 'trending-offers';
export const TRENDING_OFFERS_RETURN_PATH = '/personal-loan';

export const buildInternalLenderNavigationHref = (lenderName: string): string => {
  const encodedLender = encodeURIComponent(lenderName.trim() || 'unknown');
  return `/personal-loan/lender/${encodedLender}?${LENDER_SOURCE_PARAM}=${TRENDING_OFFERS_SOURCE}`;
};

export const isTrendingOffersLenderSource = (
  searchParams: Pick<URLSearchParams, 'get'>
): boolean => {
  return searchParams.get(LENDER_SOURCE_PARAM) === TRENDING_OFFERS_SOURCE;
};
