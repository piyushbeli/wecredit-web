/**
 * Deployment-time feature switches derived from `NEXT_PUBLIC_ENVIRONMENT`.
 * Values are inlined at `next build` — set env vars before build (see Dockerfile.staging),
 * not only at container runtime.
 *
 * Use this for staging/production gates; dev-panel flags live in `@/stores/feature-flag-store`.
 */
export const deploymentFeatures = {
  /**
   * New PL (hit-all-lenders / auto-flow). Staging-only until production rollout —
   * flip this condition when widening the rollout.
   */
  // enableNewPL: process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging',
  enableNewPL: true
} as const;
