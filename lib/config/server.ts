/**
 * Server-Side Configuration
 * Configuration that should only be used in server-side code (API routes, server components)
 * These values are NOT exposed to the client bundle
 */

/** Check if we're in development mode */
const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging';

/** Check if we're in production mode */
const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';

/** Environment flags for server-side code */
export const serverEnv = {
  isDevelopment,
  isProduction,
  isTest: process.env.NEXT_PUBLIC_ENVIRONMENT === 'test',
} as const;
