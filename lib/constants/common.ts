/**
 * Cache revalidation times for different data types
 * Optimized to reduce Vercel function costs while maintaining data freshness
 */
export const CACHE_TIMES = {

    HOUR_24: 86400, // 24 hours
    HOUR_1: 3600, // 1 hour
    MINUTE_5: 300, // 5 minutes
  
    STATIC_PAGES: 3600,      // 1 hour
    
  } as const;