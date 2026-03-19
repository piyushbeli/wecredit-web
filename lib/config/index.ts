/**
 * Application Configuration
 * Centralized environment-dependent configuration using singleton pattern
 */

import { PARTNER_CODE } from '@/lib/constants/api-keys';

/** Environment type for multi-environment support */
type EnvironmentType = 'staging' | 'production';

/** Environment-specific headers */
interface EnvironmentHeaders {
  'Content-Type': string;
  'X-Agent-Host'?: string;
}

/** Configuration for each environment */
interface EnvironmentConfig {
  /** Base URL for both frontend and API (same domain) */
  apiUrl: string;
  ondcBaseUrl: string;
  multilenderBaseUrl: string;
  wecreditHeaders: EnvironmentHeaders;
  ondcHeaders: EnvironmentHeaders;
  multilenderHeaders: EnvironmentHeaders;
}

export const APPCONFIG = {
  playstoreUrl: 'https://play.google.com/store/apps/details?id=com.zapcash.loan',
}

/** Environment configurations */
const ENVIRONMENTS: Record<EnvironmentType, EnvironmentConfig> = {
  staging: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.wecredit.co.in',
    ondcBaseUrl: process.env.NEXT_PUBLIC_ONDC_BASE_URL_STAGING ||
      'https://ondc-internal-staging-pl.azurewebsites.net/ondc',
    multilenderBaseUrl: process.env.NEXT_PUBLIC_MULTILENDER_BASE_URL ||
      'https://multilender.wecredit.co.in/api/v1/user/data-upload',
    wecreditHeaders: {
      'Content-Type': 'application/json',
      'X-Agent-Host': 'gateway-uat',
    },
    ondcHeaders: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    multilenderHeaders: {
      'Content-Type': 'application/json',
    },
  },

  production: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.wecredit.co.in',
    ondcBaseUrl: process.env.NEXT_PUBLIC_ONDC_BASE_URL_PROD ||
      'https://ondc-internal-prod-pl.azurewebsites.net/ondc',
    multilenderBaseUrl: process.env.NEXT_PUBLIC_MULTILENDER_BASE_URL ||
      'https://multilender.wecredit.co.in/api/v1/user/data-upload',
    wecreditHeaders: {
      'Content-Type': 'application/json',
    },
    ondcHeaders: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    multilenderHeaders: {
      'Content-Type': 'application/json',
    },
  },
};

/**
 * Environment Singleton Class
 * Provides centralized access to environment-specific configuration
 */
class Environment {
  private static instance: Environment;
  private readonly config: EnvironmentConfig;
  private readonly environmentType: EnvironmentType;

  private constructor() {
    this.environmentType = (process.env.NEXT_PUBLIC_ENVIRONMENT || 'production') as EnvironmentType;
    this.config = ENVIRONMENTS[this.environmentType] || ENVIRONMENTS.production;
  }

  /** Get singleton instance */
  public static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  /** Get full environment configuration */
  public getConfig(): EnvironmentConfig {
    return this.config;
  }

  /** Get current environment type */
  public getEnvironmentType(): EnvironmentType {
    return this.environmentType;
  }

  /** API URL */
  public get apiUrl(): string {
    return this.config.apiUrl;
  }

  /** WeCredit API headers (includes X-Agent-Host in staging/preprod) */
  public get wecreditHeaders(): EnvironmentHeaders {
    return this.config.wecreditHeaders;
  }

  /** ONDC API base URL */
  public get ondcBaseUrl(): string {
    return this.config.ondcBaseUrl;
  }

  /** Multilender API base URL */
  public get multilenderBaseUrl(): string {
    return this.config.multilenderBaseUrl;
  }

  /** Check if running in development mode */
  public get isDevelopment(): boolean {
    return process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging';
  }

  /** Check if running in production mode */
  public get isProduction(): boolean {
    return process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
  }

  /** Check if running in test mode */
  public get isTest(): boolean {
    return process.env.NEXT_PUBLIC_ENVIRONMENT === 'test';
  }
}

/** Environment singleton instance */
export const environment = Environment.getInstance();

/** Environment flags (backward compatible) */
export const env = {
  isDevelopment: environment.isDevelopment,
  isProduction: environment.isProduction,
  isTest: environment.isTest,
} as const;

/**
 * WeCredit API Configuration
 * API is on the same domain as the frontend
 */
export const wecreditConfig = {
  /** Base URL (same as frontend) */
  apiUrl: environment.apiUrl,
  /** Gateway URL for public API */
  gatewayUrl: `${environment.apiUrl}/api/public`,
  /** Partner code for API authentication */
  partnerCode: PARTNER_CODE,
  /** Headers for API requests */
  headers: environment.wecreditHeaders,
} as const;

/** Strapi API Configuration */
export const strapiConfig = {
  url: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
  token: process.env.STRAPI_API_TOKEN,
} as const;

/** Export types */
export type { EnvironmentConfig, EnvironmentType };
