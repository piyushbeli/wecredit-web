/**
 * API Endpoints Configuration
 * Application-specific paths and endpoint identifiers
 */

import { strapiConfig, wecreditConfig } from './index';
import { ENDPOINTS } from '@/lib/constants/api-keys';

/**
 * WeCredit API Configuration
 * Direct calls to WeCredit backend (same domain as frontend)
 * URL determined by NEXT_PUBLIC_ENVIRONMENT and NEXT_PUBLIC_WEBSITE_BASE_URL
 */
export const wecreditApi = {
  /** Gateway URL for WeCredit public API */
  gatewayUrl: wecreditConfig.gatewayUrl,

  /**
   * Endpoint identifiers (passed in request body)
   * Usage: { endpoint: wecreditApi.endpoints.activeLenders }
   */
  endpoints: {
    activeLenders: ENDPOINTS.PUBLIC.ACTIVE_LENDERS,
    // Add more endpoint identifiers as the API grows
    // lenderDetails: 'lender-details',
    // applyLoan: 'apply-loan',
    // checkEligibility: 'check-eligibility',
  },
} as const;

/**
 * Strapi API Configuration
 * Traditional REST API: endpoint is part of URL path
 */
export const strapiApi = {
  /** Base API URL */
  baseUrl: `${strapiConfig.url}/api`,

  /** URL builders for REST endpoints */
  urls: {
    pages: (slug?: string) => slug
      ? `${strapiConfig.url}/api/pages/${slug}`
      : `${strapiConfig.url}/api/pages`,
    authors: (id?: string) => id
      ? `${strapiConfig.url}/api/authors/${id}`
      : `${strapiConfig.url}/api/authors`,
  },
} as const;

/** WeCredit endpoint type for type safety */
export type WeCreditEndpoint = typeof wecreditApi.endpoints[keyof typeof wecreditApi.endpoints];
