/**
 * Application Configuration
 * Centralized environment-dependent configuration
 */

/** Check if we're in development mode (NODE_ENV is set automatically by Next.js) */
const isDevelopment = process.env.NODE_ENV === 'development';

/** Check if we're in production mode */
const isProduction = process.env.NODE_ENV === 'production';

/**
 * WeCredit Base URL from env variable
 * - Set NEXT_PUBLIC_WECREDIT_BASE_URL to test against external API (e.g., https://wecredit.co.in)
 * - Leave empty or unset to use local proxy route (/api/public) - recommended for production
 */
const wecreditBaseUrl = process.env.NEXT_PUBLIC_WECREDIT_BASE_URL || '';

/** WeCredit API Configuration (Client-safe) */
export const wecreditConfig = {
  /** Base URL: from env variable, defaults to empty (uses local proxy) */
  baseUrl: wecreditBaseUrl,
  /** Partner code for API authentication */
  partnerCode: 'WC001',
  /** Development-only headers (stripped in production) */
  devHeaders: (isDevelopment
    ? { 'X-Agent-Host': 'gateway-uat' }
    : {}) as Record<string, string>,
} as const;

/** Strapi API Configuration */
export const strapiConfig = {
  /** Strapi base URL */
  url: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
  /** Strapi API token for authentication */
  token: process.env.STRAPI_API_TOKEN,
} as const;

/** Environment flags */
export const env = {
  isDevelopment,
  isProduction,
  isTest: process.env.NODE_ENV === 'test',
} as const;

/** Re-export server config for API routes */
export { wecreditServerConfig, isAllowedEndpoint } from './server';

