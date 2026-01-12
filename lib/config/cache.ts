/**
 * Cache Configuration
 * Centralized revalidation times for ISR (Incremental Static Regeneration)
 */

/** Revalidation times in seconds */
export const REVALIDATE = {
  /** Home page - more dynamic content */
  HOME: 300, // 5 minutes
  /** About Us page */
  ABOUT_US: 3600, // 1 hour
  /** Privacy Policy page */
  PRIVACY_POLICY: 3600, // 1 hour
  /** Terms of Service page */
  TERMS_OF_SERVICE: 3600, // 1 hour
  /** Contact Us page */
  CONTACT_US: 3600, // 1 hour
} as const;

/** Default revalidation time for static pages */
export const DEFAULT_STATIC_REVALIDATE = 3600;
