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