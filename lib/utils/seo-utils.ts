/**
 * SEO Utility Functions
 * 
 * CHANGE: Added environment-based detection to prevent staging from being indexed.
 * This prevents search engines from indexing staging.eauctiondekho.com which was
 * competing with the production site.
 */


export function shouldPreventIndexing(): boolean {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase();
  if (environment === "staging") {
    return true;
  }
  
  // Default: Allow indexing (production)
  return false;
}