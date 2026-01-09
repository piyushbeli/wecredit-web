/**
 * API Endpoints Configuration
 * Application-specific paths and endpoint identifiers
 */

import { strapiConfig, wecreditConfig } from './index';

/**
 * WeCredit API Configuration
 * Gateway-style API: single URL, endpoint passed in request body
 * Dev: https://wecredit-uat.co.in/api/public
 * Prod: /api/public (relative, matches frontend origin)
 */
export const wecreditApi = {
  /** Gateway URL: full URL in dev, relative URL in prod */
  gatewayUrl: wecreditConfig.baseUrl + '/api/public',

  /**
   * Endpoint identifiers (passed in request body)
   * Usage: { endpoint: wecreditApi.endpoints.activeLenders }
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

