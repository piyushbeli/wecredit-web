/**
 * Server-Side Configuration
 * Configuration that should only be used in server-side code (API routes, server components)
 * These values are NOT exposed to the client bundle
 */

/** Check if we're in development mode */
const isDevelopment = process.env.NODE_ENV === 'development';

/** Check if we're in production mode */
const isProduction = process.env.NODE_ENV === 'production';

/** UAT URL for local development */
const UAT_BASE_URL = 'https://wecredit.co.in';

/**
 * Resolve base URL:
 * - Development: UAT domain (https://wecredit.co.in)
 * - Production: WECREDIT_BASE_URL env variable (same as frontend domain)
 */
const resolvedBaseUrl = isDevelopment
  ? UAT_BASE_URL
  : process.env.WECREDIT_BASE_URL;

/**
 * WeCredit Server Configuration
 * Contains sensitive configuration that should never be exposed to the client
 */
export const wecreditServerConfig = {
  /** External WeCredit API base URL (server-only) */
  baseUrl: resolvedBaseUrl,

  /** Full gateway URL for the external API */
  gatewayUrl: `${resolvedBaseUrl}/api/public`,

  /** Partner code for API authentication */
  partnerCode: 'WC001',

  /** Development-only headers (stripped in production) */
  devHeaders: (isDevelopment
    ? { 'X-Agent-Host': 'gateway-uat' }
    : {}) as Record<string, string>,

  /** Allowed endpoint identifiers (whitelist for security) */
  allowedEndpoints: [
    'active-lenders',
    // Add more endpoints as the API grows:
    // 'lender-details',
    // 'apply-loan',
    // 'check-eligibility',
  ] as const,
} as const;

/** Type for allowed WeCredit endpoints */
export type AllowedWeCreditEndpoint = typeof wecreditServerConfig.allowedEndpoints[number];

/**
 * Validates if an endpoint is allowed
 */
export function isAllowedEndpoint(endpoint: string): endpoint is AllowedWeCreditEndpoint {
  return wecreditServerConfig.allowedEndpoints.includes(endpoint as AllowedWeCreditEndpoint);
}

/** Environment flags for server-side code */
export const serverEnv = {
  isDevelopment,
  isProduction,
  isTest: process.env.NODE_ENV === 'test',
} as const;


