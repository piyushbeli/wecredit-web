/**
 * API Constants and Keys
 * Centralized constants for API communication
 */

/** Header key names */
export const HEADER_CONTENT_TYPE = 'Content-Type';
export const HEADER_AUTHORIZATION = 'Authorization';
export const HEADER_AGENT_HOST = 'X-Agent-Host';
export const HEADER_MOBILE = 'mobile';

/** Content type values */
export const CONTENT_TYPE_JSON = 'application/json';

/** LocalStorage keys */
export const STORAGE_AUTH_TOKEN = 'auth_token';
export const STORAGE_MOBILE = 'mobile';

/** Auth cookie configuration (7 days) shared across all auth flows */
export const AUTH_COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production',
};

/** API parameter keys */
export const PARAM_SOURCE = 'source';
export const PARAM_AGENT_ID = 'agentId';
export const PARAM_PHONE_NUMBER = 'phoneNumber';
export const PARAM_FIRST_NAME = 'firstName';
export const PARAM_MIDDLE_NAME = 'middleName';
export const PARAM_LAST_NAME = 'lastName';
export const PARAM_DOB = 'dob';
export const PARAM_GENDER = 'gender';
export const PARAM_PINCODE = 'pincode';
export const PARAM_PAN = 'pan';
export const PARAM_EMAIL = 'email';
export const PARAM_EMPLOYMENT_TYPE = 'employmentType';
export const PARAM_REQUIRED_LOAN_AMOUNT = 'requiredLoanAmount';
export const PARAM_LENDER_NAME = 'lenderName';
export const PARAM_ENDPOINT = 'endpoint';
export const PARAM_PARTNER_CODE = 'partnerCode';

/** Source identifiers */
export const SOURCE_WEBSITE = 'website';

/**
 * API Endpoint Identifiers
 * These are passed in request body, not used as URLs
 * Actual gateway URL comes from wecreditConfig.gatewayUrl
 */
export const ENDPOINTS = {
  PUBLIC: {
    /** Endpoint identifier for active lenders (generic - no auth) */
    ACTIVE_LENDERS: 'active-lenders',

    /** Endpoint identifier for check status all (PDF Step 6) */
    CHECK_STATUS_ALL: 'check-status-all',

    /** Endpoint identifier for check dedupe (determine if user needs to fill form) */
    CHECK_DEDUPE: 'check-dedupe',

    /** Endpoint identifier for fetching lender-specific form fields */
    LENDERS_FORM_FILLED: 'lenders-form-filled',

    /** Endpoint identifier for creating a new lead */
    CREATE_LEAD: 'create-lead',

    /** Endpoint identifier for re-hitting all lenders (PDF Offers Screen) */
    HIT_ALL_LENDERS: 'hit-all-lenders',

    /** Endpoint identifier for update utm clicked (Offers Screen) */
    UPDATE_UTM_CLICKED: 'update-utm-clicked',

    /** Endpoint identifier for credit card Apply Now click tracking */
    CLICKS_COUNTER: 'clicks_counter',

    UPSWING_NAVIGATION_EVENT: 'upswing-navigation-event',
  },
  AUTH: {
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP: '/api/auth/verify-otp',
    REFRESH_TOKEN: '/api/auth/refresh',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/update',
  },
  LOANS: {
    GET_OFFERS: '/api/loans/offers',
    APPLY: '/api/loans/apply',
    STATUS: '/api/loans/status',
  },
} as const;

/** Partner code for API authentication */
export const PARTNER_CODE = 'WC001';

/** Default timeout values (in milliseconds) */
export const TIMEOUT_DEVELOPMENT = 15000;
export const TIMEOUT_PRODUCTION = 30000;
