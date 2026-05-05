/**
 * Mock Offers Data
 * Static data for testing offers functionality with feature flag
 * Use: Enable 'enableOfferMockData' feature flag in dev mode
 */

import type { LenderOfferStatus, CheckStatusAllResponse } from '@/types/wecredit';
import { STATUS_CODES } from '@/types/wecredit';

/**
 * Mock lender offers matching screenshot design
 * Represents offers shown in the UI mockup
 */
export const MOCK_OFFERS: LenderOfferStatus[] = [
  {
    lenderName: 'CreditSea',
    wcStatus: 'INITIATED',
    utmLink: 'https://example.com/creditsea-apply',
    loanAmount: '1 Lakh Rupee',
    intRate: '1.5',
    tenure: '48',
    logo: '/logos/creditsea.png',
    approvalRate: 70,
  },
  {
    lenderName: 'PhatkaPay',
    wcStatus: 'INITIATED',
    utmLink: 'https://example.com/phatkapay-apply',
    loanAmount: '1 Lakh Rupee',
    intRate: '1.5',
    tenure: '48',
    logo: '/logos/phatkapay.png',
    approvalRate: 70,
  },
  {
    lenderName: 'Aditya Birla Capital',
    wcStatus: 'INITIATED',
    utmLink: 'https://example.com/aditya-birla-apply',
    loanAmount: '1 Lakh Rupee',
    intRate: '1.5',
    tenure: '48',
    logo: '/logos/aditya-birla.png',
    approvalRate: 70,
  },
  {
    lenderName: 'KreditBee',
    wcStatus: 'INITIATED',
    utmLink: 'https://example.com/kreditbee-apply',
    loanAmount: '1 Lakh Rupee',
    intRate: '1.5',
    tenure: '48',
    logo: '/logos/kreditbee.png',
    approvalRate: 70,
  },
];

/**
 * Mock offers with all status types for UI testing
 * One offer for each possible wcStatus value
 */
export const MOCK_OFFERS_ALL_STATUSES: LenderOfferStatus[] = [
  {
    lenderName: 'CreditSea',
    wcStatus: 'INITIATED',
    utmLink: 'https://example.com/creditsea-apply',
    loanAmount: '1 Lakh Rupee',
    intRate: '1.5',
    tenure: '48',
    logo: '/logos/creditsea.png',
    approvalRate: 70,
  },
  {
    lenderName: 'PhatkaPay',
    wcStatus: 'UTM_CLICKED',
    utmLink: 'https://example.com/phatkapay-apply',
    loanAmount: '1 Lakh Rupee',
    intRate: '1.5',
    tenure: '48',
    logo: '/logos/phatkapay.png',
    approvalRate: 75,
  },
  {
    lenderName: 'Aditya Birla Capital',
    wcStatus: 'JOURNEY_STARTED',
    utmLink: 'https://example.com/aditya-birla-apply',
    loanAmount: '2 Lakh Rupee',
    intRate: '2.0',
    tenure: '36',
    logo: '/logos/aditya-birla.png',
    approvalRate: 65,
  },
  {
    lenderName: 'KreditBee',
    wcStatus: 'UNDER_REVIEW',
    utmLink: 'https://example.com/kreditbee-apply',
    loanAmount: '1.5 Lakh Rupee',
    intRate: '1.8',
    tenure: '42',
    logo: '/logos/kreditbee.png',
    approvalRate: 60,
  },
  {
    lenderName: 'Bajaj Finserv',
    wcStatus: 'PENDING',
    utmLink: 'https://example.com/bajaj-apply',
    loanAmount: '2.5 Lakh Rupee',
    intRate: '2.2',
    tenure: '48',
    logo: '/logos/bajaj.png',
    approvalRate: 55,
  },
  {
    lenderName: 'Tata Capital',
    wcStatus: 'APPROVED',
    utmLink: 'https://example.com/tata-apply',
    loanAmount: '3 Lakh Rupee',
    intRate: '1.9',
    tenure: '60',
    logo: '/logos/tata.png',
    approvalRate: 80,
  },
  {
    lenderName: 'HDFC Bank',
    wcStatus: 'REJECTED',
    utmLink: 'https://example.com/hdfc-apply',
    loanAmount: '1 Lakh Rupee',
    intRate: '2.5',
    tenure: '36',
    logo: '/logos/hdfc.png',
    approvalRate: 40,
  },
  {
    lenderName: 'ICICI Bank',
    wcStatus: 'DISBURSED',
    utmLink: 'https://example.com/icici-apply',
    loanAmount: '2 Lakh Rupee',
    intRate: '1.7',
    tenure: '48',
    logo: '/logos/icici.png',
    approvalRate: 85,
  },
  {
    lenderName: 'Axis Bank',
    wcStatus: 'COMPLETED',
    utmLink: 'https://example.com/axis-apply',
    loanAmount: '1.5 Lakh Rupee',
    intRate: '2.0',
    tenure: '42',
    logo: '/logos/axis.png',
    approvalRate: 90,
  },
  {
    lenderName: 'SBI',
    wcStatus: 'CANCELLED',
    utmLink: 'https://example.com/sbi-apply',
    loanAmount: '1 Lakh Rupee',
    intRate: '2.3',
    tenure: '36',
    logo: '/logos/sbi.png',
    approvalRate: 50,
  },
];

/**
 * Mock response for check-status-all API
 * Includes offers with re-hit capability
 */
export const MOCK_CHECK_STATUS_RESPONSE: CheckStatusAllResponse = {
  statusCode: STATUS_CODES.OFFERS_FOUND,
  lenders: MOCK_OFFERS,
  isRehitLenders: 0, // More lenders available for re-hit
  declaredSalary: 50000,
  empType: 'salaried',
};

/**
 * Mock response with all status types for UI testing
 * Use this to test all status badges and CTA buttons
 */
export const MOCK_ALL_STATUSES_RESPONSE: CheckStatusAllResponse = {
  statusCode: STATUS_CODES.OFFERS_FOUND,
  lenders: MOCK_OFFERS_ALL_STATUSES,
  isRehitLenders: 1, // All lenders checked
  declaredSalary: 50000,
  empType: 'salaried',
};

/**
 * Mock response with no offers (for testing re-hit flow)
 */
export const MOCK_NO_OFFERS_RESPONSE: CheckStatusAllResponse = {
  statusCode: STATUS_CODES.NO_OFFERS_CAN_REHIT,
  lenders: [],
  isRehitLenders: 0, // Can re-hit to check more lenders
  declaredSalary: null,
  empType: null,
};

/**
 * Mock response after re-hit (additional offers)
 */
export const MOCK_REHIT_OFFERS: LenderOfferStatus[] = [
  {
    lenderName: 'Bajaj Finserv',
    wcStatus: 'INITIATED',
    utmLink: 'https://example.com/bajaj-apply',
    loanAmount: '1 Lakh Rupee',
    intRate: '1.5',
    tenure: '48',
    logo: '/logos/bajaj.png',
    approvalRate: 70,
  },
  {
    lenderName: 'Tata Capital',
    wcStatus: 'INITIATED',
    utmLink: 'https://example.com/tata-proceed',
    loanAmount: '1 Lakh Rupee',
    intRate: '1.5',
    tenure: '48',
    logo: '/logos/tata.png',
    approvalRate: 70,
  },
];

/**
 * Mock response for re-hit API call
 */
export const MOCK_REHIT_RESPONSE: CheckStatusAllResponse = {
  statusCode: STATUS_CODES.OFFERS_FOUND,
  lenders: [...MOCK_OFFERS, ...MOCK_REHIT_OFFERS],
  isRehitLenders: 1, // All lenders checked
  declaredSalary: 50000,
  empType: 'salaried',
};

/**
 * Get mock delay in milliseconds for simulating API calls
 * Adds realistic loading state experience
 */
export function getMockApiDelay(): number {
  return 800 + Math.random() * 700; // 800-1500ms
}

/**
 * Simulate API call with delay
 * @param data - Data to return after delay
 * @returns Promise that resolves to the data
 */
export async function simulateMockApiCall<T>(data: T): Promise<T> {
  await new Promise(resolve => setTimeout(resolve, getMockApiDelay()));
  return data;
}
