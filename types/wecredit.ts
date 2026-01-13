/**
 * WeCredit Public API Type Definitions
 * Types for the WeCredit lender/offers API
 */

/** Raw lender data from the API response */
export interface Lender {
  id: number;
  Name: string;
  logo: string | null;
  ImageUrl: string | null;
  IntRate: number | null;
  Tenure: number | null;
  UptoAmount: string | null;
  utmLink: string | null;
  Description: string | null;
  ApprovalRate: number | null;
  AvgTicketSize: number | null;
  MinAge: number | null;
  MaxAge: number | null;
  MinIncome: number | null;
  EmploymentType: string | null;
  PincodeValidation: number | null;
  IsApi: number;
  IsAppEnabled: number;
  affiliateStatus: number;
  internalStatus: number;
  backColour: string | null;
  topColour: string | null;
  watermark: string | null;
}

/** API response structure for active-lenders endpoint */
export interface ActiveLendersResponse {
  [key: string]: Lender;
}

export interface Partner {
  name: string;
  logo: string;
}

// ============================================
// Check Status API Types (PDF Step 6 & 7)
// ============================================

/**
 * WeCredit Status values for loan applications
 * Per PDF Step 7 - Clicked Lender Handling
 */
export type WcStatus =
  | 'INITIATED'      // Loan application just started
  | 'PENDING'        // Waiting for processing
  | 'APPROVED'       // Loan approved
  | 'REJECTED'       // Loan rejected
  | 'DISBURSED'      // Loan disbursed
  | 'COMPLETED'      // Loan completed
  | 'CANCELLED';     // Loan cancelled

/**
 * Individual lender offer status in check-status-all response
 */
export interface LenderOfferStatus {
  /** Lender identifier */
  lenderId: string;
  /** Lender name */
  lenderName: string;
  /** WeCredit application status */
  wcStatus: WcStatus;
  /** Application/Offer ID if exists */
  applicationId?: string;
  /** Offer amount if approved */
  offerAmount?: number;
  /** Interest rate offered */
  interestRate?: number;
  /** Loan tenure offered (months) */
  tenure?: number;
  /** UTM/redirect link for the lender */
  utmLink?: string;
  /** Timestamp of last status update */
  updatedAt?: string;
}

/**
 * Check Status All API Response
 * Per PDF Step 6 - Check Status Result – Decision Logic
 */
export interface CheckStatusAllResponse {
  /** Whether the API call was successful */
  success: boolean;
  /** Response message */
  message: string;
  /** Whether user has any offers */
  hasOffers: boolean;
  /** List of lender offer statuses (empty if no offers) */
  offers: LenderOfferStatus[];
}

/**
 * Result type for check status operation
 */
export interface CheckStatusResult {
  /** Whether the check was successful */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Response data */
  data?: CheckStatusAllResponse;
}

/**
 * Lender handling result based on wcStatus
 * Per PDF Step 7 - Clicked Lender Handling
 */
export type LenderHandlingResult =
  | { type: 'initiated'; offer: LenderOfferStatus }    // wcStatus = INITIATED
  | { type: 'existing'; offer: LenderOfferStatus }     // wcStatus != INITIATED
  | { type: 'not_found'; lenderId: string }            // Lender not in offer list
  | { type: 'no_offers' };                             // No offers exist