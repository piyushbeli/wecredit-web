/**
 * Deployment-time feature switches derived from `NEXT_PUBLIC_ENVIRONMENT`.
 * Values are inlined at `next build` — set env vars before build (see Dockerfile.staging),
 * not only at container runtime.
 *
 * Use this for staging/production gates; dev-panel flags live in `@/stores/feature-flag-store`.
 */
export const deploymentFeatures = {
  /** Auto hit all lenders — staging builds only. */
  disableAutoHitAllLenders: process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging',
} as const;
