/**
 * API Endpoints Configuration
 * Application-specific paths and endpoint identifiers
 */

import { wecreditConfig, strapiConfig } from './index';

/**
 * WeCredit API Configuration
 * Gateway-style API: single URL, endpoint passed in request body
 */
export const wecreditApi = {
  /** Full gateway URL */
  gatewayUrl: `${wecreditConfig.baseUrl}/api/public`,

  /**
   * Endpoint identifiers (passed in request body)
   * Usage: { endpoint: wecreditApi.endpoints.activeLenders, partnerCode: '...' }
   */
  endpoints: {
    activeLenders: 'active-lenders',
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

