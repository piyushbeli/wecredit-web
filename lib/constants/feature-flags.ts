/**
 * Feature Flags Constants
 * Defines all available feature flags and their metadata
 */

/**
 * Default values for all feature flags
 */
export const DEFAULT_FEATURE_FLAGS = {
  enableDebugLogs: false,
  enableOfferMockData: false,
  showPreAuthFlow: true,
  bypassDedupeCheck: false,
  enableBusinessLoanPrefill: false,
} as const;

/**
 * Type for feature flag names
 */
export type FeatureFlagName = keyof typeof DEFAULT_FEATURE_FLAGS;

/**
 * Type for feature flags object
 */
export type FeatureFlags = typeof DEFAULT_FEATURE_FLAGS;

/**
 * Category for grouping feature flags in UI
 */
export type FlagCategory = 'auth' | 'forms' | 'debug' | 'data';

/**
 * Metadata for each feature flag
 */
export interface FeatureFlagMetadata {
  name: FeatureFlagName;
  label: string;
  description: string;
  category: FlagCategory;
  defaultValue: boolean;
}

/**
 * Feature flag metadata for UI display
 */
export const FEATURE_FLAG_METADATA: Record<FeatureFlagName, FeatureFlagMetadata> = {
  enableDebugLogs: {
    name: 'enableDebugLogs',
    label: 'Enable Debug Logs',
    description: 'Show detailed console logs for debugging',
    category: 'debug',
    defaultValue: DEFAULT_FEATURE_FLAGS.enableDebugLogs,
  },
  enableOfferMockData: {
    name: 'enableOfferMockData',
    label: 'Use Mock Offers Data',
    description: 'Use mock data instead of real API for offers',
    category: 'data',
    defaultValue: DEFAULT_FEATURE_FLAGS.enableOfferMockData,
  },
  showPreAuthFlow: {
    name: 'showPreAuthFlow',
    label: 'Enable Pre-Auth Flow',
    description: 'Enable pre-authentication via URL parameters',
    category: 'auth',
    defaultValue: DEFAULT_FEATURE_FLAGS.showPreAuthFlow,
  },
  bypassDedupeCheck: {
    name: 'bypassDedupeCheck',
    label: 'Bypass Dedupe Check',
    description: 'Skip duplicate lead validation for testing',
    category: 'data',
    defaultValue: DEFAULT_FEATURE_FLAGS.bypassDedupeCheck,
  },
  enableBusinessLoanPrefill: {
    name: 'enableBusinessLoanPrefill',
    label: 'Prefill Business Loan Form',
    description: 'Prefill business loan form with test data for testing',
    category: 'forms',
    defaultValue: DEFAULT_FEATURE_FLAGS.enableBusinessLoanPrefill,
  },
};

/**
 * LocalStorage key for feature flags
 */
export const FEATURE_FLAGS_STORAGE_KEY = 'wecredit_feature_flags';

/**
 * Feature flags storage schema version
 */
export const FEATURE_FLAGS_VERSION = 1;

/**
 * Categories for organizing flags in the UI
 */
export const FLAG_CATEGORIES: Record<FlagCategory, { label: string; icon: string }> = {
  auth: {
    label: 'Authentication',
    icon: '🔐',
  },
  forms: {
    label: 'Forms',
    icon: '📝',
  },
  debug: {
    label: 'Debug',
    icon: '🐛',
  },
  data: {
    label: 'Data',
    icon: '💾',
  },
};
