import type { LenderOfferStatus } from '@/types/wecredit';

/**
 * Buckets derived from check-status-all lenders for explore, carousel/status, and unmatched UI.
 * Logic is centralized here so views and selectors stay thin.
 */
export type CategorizedOffers = {
  explore: LenderOfferStatus[];
  recentlyClicked: LenderOfferStatus[];
  unmatched: LenderOfferStatus[];
};

/**
 * Treat missing `lenderStatus` as active (true) for backward compatibility with older API payloads.
 */
export const isLenderStatusActive = (offer: LenderOfferStatus): boolean =>
  offer.lenderStatus !== false;

/**
 * Split offers by lenderStatus + wcStatus per product rules.
 * REJECTED always goes to unmatched (even when the lender row is still "active").
 * Offers that belong in no bucket are omitted (e.g. DISBURSED when active, or stray statuses when inactive).
 */
export const categorizeOffers = (
  offers: LenderOfferStatus[] | null | undefined
): CategorizedOffers => {
  const explore: LenderOfferStatus[] = [];
  const recentlyClicked: LenderOfferStatus[] = [];
  const unmatched: LenderOfferStatus[] = [];

  if (!offers?.length) {
    return { explore, recentlyClicked, unmatched };
  }

  for (const offer of offers) {
    // Product rule: rejected applications never appear in explore or recently-clicked carousels.
    if (offer.wcStatus === 'REJECTED') {
      unmatched.push(offer);
      continue;
    }

    if (isLenderStatusActive(offer)) {
      if (offer.wcStatus === 'INITIATED') {
        explore.push(offer);
        continue;
      }
      if (offer.wcStatus === 'DISBURSED') {
        // Intentionally excluded from all UI surfaces
        continue;
      }
      recentlyClicked.push(offer);
      continue;
    }

    if (offer.wcStatus === 'NOT_PROCESSED') {
      unmatched.push(offer);
    }
  }

  console.log('[categorizeOffers] explore', explore);
  console.log('[categorizeOffers] recentlyClicked', recentlyClicked);
  console.log('[categorizeOffers] unmatched', unmatched);

  return { explore, recentlyClicked, unmatched };
};
