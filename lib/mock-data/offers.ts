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
    interestRate: '1.5',
    tenure: '48',
    logo: '/logos/creditsea.png',
    approvalChance: 70,
  },
  {
    lenderName: 'PhatkaPay',
    wcStatus: 'INITIATED',
    utmLink: 'https://example.com/phatkapay-apply',
    loanAmount: '1 Lakh Rupee',
    interestRate: '1.5',
    tenure: '48',
    logo: '/logos/phatkapay.png',
    approvalChance: 70,
  },
  {
    lenderName: 'Aditya Birla Capital',
    wcStatus: 'INITIATED',
    utmLink: 'https://example.com/aditya-birla-apply',
    loanAmount: '1 Lakh Rupee',
    interestRate: '1.5',
    tenure: '48',
    logo: '/logos/aditya-birla.png',
    approvalChance: 70,
  },
  {
    lenderName: 'KreditBee',
    wcStatus: 'INITIATED',
    utmLink: 'https://example.com/kreditbee-apply',
    loanAmount: '1 Lakh Rupee',
    interestRate: '1.5',
    tenure: '48',
    logo: '/logos/kreditbee.png',
    approvalChance: 70,
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
};

/**
 * Mock response with no offers (for testing re-hit flow)
 */
export const MOCK_NO_OFFERS_RESPONSE: CheckStatusAllResponse = {
  statusCode: STATUS_CODES.NO_OFFERS_CAN_REHIT,
  lenders: [],
  isRehitLenders: 0, // Can re-hit to check more lenders
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
    interestRate: '1.5',
    tenure: '48',
    logo: '/logos/bajaj.png',
    approvalChance: 70,
  },
  {
    lenderName: 'Tata Capital',
    wcStatus: 'INITIATED',
    utmLink: 'https://example.com/tata-proceed',
    loanAmount: '1 Lakh Rupee',
    interestRate: '1.5',
    tenure: '48',
    logo: '/logos/tata.png',
    approvalChance: 70,
  },
];

/**
 * Mock response for re-hit API call
 */
export const MOCK_REHIT_RESPONSE: CheckStatusAllResponse = {
  statusCode: STATUS_CODES.OFFERS_FOUND,
  lenders: [...MOCK_OFFERS, ...MOCK_REHIT_OFFERS],
  isRehitLenders: 1, // All lenders checked
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
