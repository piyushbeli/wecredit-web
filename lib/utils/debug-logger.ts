/**
 * Debug Logger Utility
 * Captures and stores API call details for debugging in development mode
 */

import { useFeatureFlagStore } from '@/stores/feature-flag-store';

/** Interface for a single debug log entry */
export interface DebugLogEntry {
  id: string;
  timestamp: number;
  endpoint: string;
  method: string;
  url: string;
  status: 'pending' | 'success' | 'error';
  statusCode?: number;
  duration?: number;
  requestDetails: {
    filters?: Record<string, unknown>;
    populate?: string | Record<string, unknown>;
    sort?: string[];
    pagination?: {
      page?: number;
      pageSize?: number;
    };
    fields?: string[];
    revalidate?: number | false;
    tags?: string[];
    hasAuth: boolean;
  };
  responseDetails?: {
    dataSize?: number;
    error?: string;
    errorStack?: string;
  };
}

/**
 * Debug Store Singleton
 * In-memory store for debug logs (development only)
 */
class DebugStore {
  private static instance: DebugStore;
  private logs: DebugLogEntry[] = [];
  private maxLogs: number = 100;
  private isEnabled: boolean;

  private constructor() {
    // Check both NEXT_PUBLIC_ENVIRONMENT and feature flag
    this.isEnabled = this.shouldEnableDebug();
  }

  /**
   * Check if debug should be enabled based on environment and feature flag
   */
  private shouldEnableDebug(): boolean {
    // Always disabled in production
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
      return false;
    }

    // In development, check feature flag if available
    if (typeof window !== 'undefined') {
      try {
        const store = useFeatureFlagStore.getState();
        return store.isDevMode && store.flags.enableDebugLogs;
      } catch {
        // Fallback to environment check if store not available
        return true;
      }
    }

    // Server-side or during initial render
    return true;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): DebugStore {
    if (!DebugStore.instance) {
      DebugStore.instance = new DebugStore();
    }
    return DebugStore.instance;
  }

  /**
   * Check if debug logging is enabled
   * Rechecks the feature flag state
   */
  public isDebugEnabled(): boolean {
    if (typeof window !== 'undefined') {
      try {
        const store = useFeatureFlagStore.getState();
        this.isEnabled = store.isDevMode && store.flags.enableDebugLogs;
      } catch {
        // Keep existing state if store access fails
      }
    }
    return this.isEnabled;
  }

  /**
   * Add a new log entry
   */
  public addLog(entry: DebugLogEntry): void {
    if (!this.isEnabled) return;

    this.logs.unshift(entry); // Add to beginning for newest first

    // Maintain max log count
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  /**
   * Update an existing log entry
   */
  public updateLog(id: string, updates: Partial<DebugLogEntry>): void {
    if (!this.isEnabled) return;

    const logIndex = this.logs.findIndex((log) => log.id === id);
    if (logIndex !== -1) {
      this.logs[logIndex] = { ...this.logs[logIndex], ...updates };
    }
  }

  /**
   * Get all logs
   */
  public getLogs(): DebugLogEntry[] {
    return this.logs;
  }

  /**
   * Get logs with filters
   */
  public getFilteredLogs(filters?: {
    endpoint?: string;
    status?: string;
    fromTimestamp?: number;
  }): DebugLogEntry[] {
    let filtered = this.logs;

    if (filters?.endpoint) {
      filtered = filtered.filter((log) =>
        log.endpoint.toLowerCase().includes(filters.endpoint!.toLowerCase())
      );
    }

    if (filters?.status) {
      filtered = filtered.filter((log) => log.status === filters.status);
    }

    if (filters?.fromTimestamp) {
      filtered = filtered.filter((log) => log.timestamp >= filters.fromTimestamp!);
    }

    return filtered;
  }

  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get statistics
   */
  public getStats(): {
    total: number;
    success: number;
    error: number;
    pending: number;
    avgDuration: number;
  } {
    const total = this.logs.length;
    const success = this.logs.filter((log) => log.status === 'success').length;
    const error = this.logs.filter((log) => log.status === 'error').length;
    const pending = this.logs.filter((log) => log.status === 'pending').length;

    const completedLogs = this.logs.filter(
      (log) => log.duration !== undefined
    );
    const avgDuration =
      completedLogs.length > 0
        ? completedLogs.reduce((sum, log) => sum + (log.duration || 0), 0) /
          completedLogs.length
        : 0;

    return {
      total,
      success,
      error,
      pending,
      avgDuration,
    };
  }
}

/**
 * Generate unique ID for log entries
 */
function generateLogId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Start logging an API request
 */
export function startApiLog(
  endpoint: string,
  url: string,
  requestDetails: DebugLogEntry['requestDetails']
): string {
  const store = DebugStore.getInstance();

  if (!store.isDebugEnabled()) {
    return '';
  }

  const logId = generateLogId();
  const entry: DebugLogEntry = {
    id: logId,
    timestamp: Date.now(),
    endpoint,
    method: 'GET',
    url,
    status: 'pending',
    requestDetails,
  };

  store.addLog(entry);
  return logId;
}

/**
 * Complete logging an API request with success
 */
export function completeApiLog(
  logId: string,
  statusCode: number,
  duration: number,
  dataSize?: number
): void {
  if (!logId) return;

  const store = DebugStore.getInstance();
  store.updateLog(logId, {
    status: 'success',
    statusCode,
    duration,
    responseDetails: {
      dataSize,
    },
  });
}

/**
 * Complete logging an API request with error
 */
export function errorApiLog(
  logId: string,
  error: Error,
  duration: number,
  statusCode?: number
): void {
  if (!logId) return;

  const store = DebugStore.getInstance();
  store.updateLog(logId, {
    status: 'error',
    statusCode,
    duration,
    responseDetails: {
      error: error.message,
      errorStack: error.stack,
    },
  });
}

/**
 * Get all debug logs
 */
export function getDebugLogs(filters?: {
  endpoint?: string;
  status?: string;
  fromTimestamp?: number;
}): DebugLogEntry[] {
  const store = DebugStore.getInstance();
  return filters ? store.getFilteredLogs(filters) : store.getLogs();
}

/**
 * Clear all debug logs
 */
export function clearDebugLogs(): void {
  const store = DebugStore.getInstance();
  store.clearLogs();
}

/**
 * Get debug statistics
 */
export function getDebugStats() {
  const store = DebugStore.getInstance();
  return store.getStats();
}

/**
 * Check if debug is enabled
 */
export function isDebugEnabled(): boolean {
  const store = DebugStore.getInstance();
  return store.isDebugEnabled();
}

