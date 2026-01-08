/**
 * Application Configuration
 * Centralized environment-dependent configuration
 */

/** Check if we're in development mode */
const isDevelopment = process.env.NODE_ENV === 'development';

/** Check if we're in production mode */
const isProduction = process.env.NODE_ENV === 'production';

/** WeCredit API Configuration */
export const wecreditConfig = {
  /** Base URL for WeCredit services */
  baseUrl: process.env.NEXT_PUBLIC_WECREDIT_BASE_URL || 'https://wecredit.co.in',
  /** Partner code for API authentication */
  partnerCode: process.env.NEXT_PUBLIC_WECREDIT_PARTNER_CODE || 'WC001',
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

