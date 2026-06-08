/**
 * Determines whether the user must go through the multi-lender lead form.
 *
 * Context: Both check-dedupe (1004 path) and hit-all-lenders can return
 * `isWecreditWebsiteData`. When it is explicitly `false`, the existing
 * record is not from the WeCredit website, so the user must fill the lead
 * form using the multi-lender flow. When it is `true` or absent, we keep
 * the backward-compatible normal flow (proceed to offers / polling).
 *
 * Only explicit `false` triggers the form; `true` and `undefined` are
 * treated identically as "normal flow" to avoid breaking existing users.
 */
export function requiresMultiLenderLeadForm(isWecreditWebsiteData?: boolean): boolean {
  return isWecreditWebsiteData === false;
}
