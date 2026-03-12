/**
 * Feature Flag Store
 * Manages feature flags with localStorage persistence
 */

import { create } from 'zustand';
import {
  DEFAULT_FEATURE_FLAGS,
  FEATURE_FLAGS_STORAGE_KEY,
  FEATURE_FLAGS_VERSION,
  type FeatureFlags,
  type FeatureFlagName,
} from '@/lib/constants/feature-flags';

/**
 * Storage schema for feature flags
 */
interface FeatureFlagsStorage {
  version: number;
  flags: FeatureFlags;
  updatedAt: string;
}

/**
 * Feature flag store state
 */
interface FeatureFlagState {
  flags: FeatureFlags;
  isDevMode: boolean;
  isPanelOpen: boolean;
  
  // Actions
  setFlag: (name: FeatureFlagName, value: boolean) => void;
  setFlags: (flags: Partial<FeatureFlags>) => void;
  resetFlags: () => void;
  togglePanel: () => void;
  setDevMode: (isDevMode: boolean) => void;
  getFlag: (name: FeatureFlagName) => boolean;
  exportFlags: () => string;
  importFlags: (jsonString: string) => boolean;
}

/**
 * Load feature flags from localStorage
 */
const loadFlagsFromStorage = (): FeatureFlags => {
  if (typeof window === 'undefined') {
    return DEFAULT_FEATURE_FLAGS;
  }

  try {
    const stored = localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_FEATURE_FLAGS;
    }

    const data: FeatureFlagsStorage = JSON.parse(stored);
    
    // Check version compatibility
    if (data.version !== FEATURE_FLAGS_VERSION) {
      console.warn('[FeatureFlags] Version mismatch, using defaults');
      return DEFAULT_FEATURE_FLAGS;
    }

    // Merge with defaults to handle new flags
    return {
      ...DEFAULT_FEATURE_FLAGS,
      ...data.flags,
    };
  } catch (error) {
    return DEFAULT_FEATURE_FLAGS;
  }
};

/**
 * Save feature flags to localStorage
 */
const saveFlagsToStorage = (flags: FeatureFlags): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const data: FeatureFlagsStorage = {
      version: FEATURE_FLAGS_VERSION,
      flags,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, JSON.stringify(data));
    
    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: FEATURE_FLAGS_STORAGE_KEY,
        newValue: JSON.stringify(data),
      })
    );
  } catch (error) {
  }
};

/**
 * Feature flag store
 */
export const useFeatureFlagStore = create<FeatureFlagState>((set, get) => ({
  flags: loadFlagsFromStorage(),
  isDevMode: false,
  isPanelOpen: false,

  /**
   * Set a single feature flag
   */
  setFlag: (name: FeatureFlagName, value: boolean): void => {
    set((state) => {
      const newFlags = {
        ...state.flags,
        [name]: value,
      };
      
      saveFlagsToStorage(newFlags);
      
      return { flags: newFlags };
    });
  },

  /**
   * Set multiple feature flags at once
   */
  setFlags: (newFlags: Partial<FeatureFlags>): void => {
    set((state) => {
      const updatedFlags = {
        ...state.flags,
        ...newFlags,
      };
      
      saveFlagsToStorage(updatedFlags);
      
      return { flags: updatedFlags };
    });
  },

  /**
   * Reset all flags to defaults
   */
  resetFlags: (): void => {
    set({ flags: DEFAULT_FEATURE_FLAGS });
    saveFlagsToStorage(DEFAULT_FEATURE_FLAGS);
  },

  /**
   * Toggle dev panel visibility
   */
  togglePanel: (): void => {
    set((state) => ({ isPanelOpen: !state.isPanelOpen }));
  },

  /**
   * Set development mode status
   */
  setDevMode: (isDevMode: boolean): void => {
    set({ isDevMode });
  },

  /**
   * Get a single feature flag value
   */
  getFlag: (name: FeatureFlagName): boolean => {
    const state = get();
    
    // In production, always return default value (usually false)
    if (!state.isDevMode) {
      return DEFAULT_FEATURE_FLAGS[name];
    }
    
    return state.flags[name];
  },

  /**
   * Export flags as JSON string
   */
  exportFlags: (): string => {
    const state = get();
    const data: FeatureFlagsStorage = {
      version: FEATURE_FLAGS_VERSION,
      flags: state.flags,
      updatedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  /**
   * Import flags from JSON string
   */
  importFlags: (jsonString: string): boolean => {
    try {
      const data: FeatureFlagsStorage = JSON.parse(jsonString);
      
      // Validate version
      if (data.version !== FEATURE_FLAGS_VERSION) {
        return false;
      }
      
      // Merge with defaults to ensure all flags exist
      const importedFlags = {
        ...DEFAULT_FEATURE_FLAGS,
        ...data.flags,
      };
      
      set({ flags: importedFlags });
      saveFlagsToStorage(importedFlags);
      
      return true;
    } catch (error) {
      return false;
    }
  },
}));

/**
 * Sync feature flags across tabs
 */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === FEATURE_FLAGS_STORAGE_KEY && event.newValue) {
      try {
        const data: FeatureFlagsStorage = JSON.parse(event.newValue);
        useFeatureFlagStore.setState({ flags: data.flags });
      } catch (error) {
      }
    }
  });
}
