/**
 * Server-Side Configuration
 * Configuration that should only be used in server-side code (API routes, server components)
 * These values are NOT exposed to the client bundle
 */

/** Check if we're in development mode */
const isDevelopment = process.env.NODE_ENV === 'development';

/** Check if we're in production mode */
const isProduction = process.env.NODE_ENV === 'production';

/** Environment flags for server-side code */
export const serverEnv = {
  isDevelopment,
  isProduction,
  isTest: process.env.NODE_ENV === 'test',
} as const;
