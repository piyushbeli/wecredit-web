/**
 * Credit Report dashboard types (API/mock contract).
 */

export type CreditScoreChangeType = 'INCREASED' | 'DECREASED' | 'UNCHANGED';

export type ScoreFactorRating = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'LOW';

export type SummaryValueType = 'NUMBER' | 'PERCENTAGE' | 'CURRENCY_COMPACT';

export type FullCreditReportStatus = 'LOCKED' | 'UNLOCKED';

/**
 * End-to-end credit-report flow status (score fetch → summary → full report).
 * Maps 1:1 to backend job status when APIs are wired.
 */
export type CreditReportStatus =
  | 'idle'
  | 'verifying_identity'
  | 'connecting_bureau'
  | 'generating_score'
  | 'score_ready'
  | 'generating_full_report'
  | 'full_report_ready'
  | 'failed';

export type CreditReportProgressStepState = 'pending' | 'active' | 'completed' | 'failed';

export type CreditReportAccountStatus = 'ACTIVE' | 'CLOSED' | 'OVERDUE';

export type CreditReportPaymentStatus = 'ON_TIME' | 'DELAYED' | 'MISSED' | 'NO_DATA';

export type CreditReportFailurePhase = 'score' | 'full_report';

export type CreditReportView =
  | 'fetching'
  | 'summary'
  | 'processing'
  | 'full_report'
  | 'error';

export interface CreditReportUser {
  readonly firstName: string;
}

export interface CreditScoreInfo {
  readonly bureau: string;
  readonly score: number;
  readonly minimumScore: number;
  readonly maximumScore: number;
  readonly rating: string;
  readonly monthlyChange: number;
  readonly changeType: CreditScoreChangeType;
  readonly lastUpdatedAt: string;
  readonly canRefresh: boolean;
}

export interface LoanOfferInfo {
  readonly isEligible: boolean;
  readonly isPreApproved: boolean;
  readonly offerId: string;
  readonly loanType: string;
  readonly maximumAmount: number;
  readonly currency: string;
  readonly minimumInterestRate: number;
  readonly interestRateType: string;
  readonly disbursalTime: string;
  readonly collateralRequired: boolean;
  readonly creditScoreImpact: boolean;
  readonly ctaText: string;
}

export interface FullCreditReportInfo {
  readonly reportId: string;
  readonly bureau: string;
  readonly status: FullCreditReportStatus;
  readonly isAvailable: boolean;
  readonly originalPrice: number;
  readonly sellingPrice: number;
  readonly currency: string;
  readonly desktopTitle: string;
  readonly mobileTitle: string;
  readonly description: string;
  readonly mobileDescription: string;
  readonly ctaText: string;
}

export interface ScoreFactorItem {
  readonly key: string;
  readonly label: string;
  readonly rating: ScoreFactorRating;
  readonly displayValue: string;
  /** Progress percentage 0–100 */
  readonly progress: number;
  readonly hideOnMobile?: boolean;
}

export interface CreditSummaryItem {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly valueType: SummaryValueType;
  readonly currency?: string;
  readonly highlight?: boolean;
  readonly hideOnMobile?: boolean;
}

export interface ImprovementTipItem {
  readonly id: string;
  readonly text: string;
}

export interface CreditReportVisibility {
  readonly showStartOver: boolean;
  readonly showLoanOffer: boolean;
  readonly showFullReport: boolean;
  readonly showScoreFactors: boolean;
  readonly showCreditSummary: boolean;
  readonly showImprovementTips: boolean;
}

export interface CreditReportDashboard {
  readonly user: CreditReportUser;
  readonly creditScore: CreditScoreInfo;
  readonly loanOffer: LoanOfferInfo;
  readonly fullCreditReport: FullCreditReportInfo;
  readonly scoreFactors: readonly ScoreFactorItem[];
  readonly creditSummary: readonly CreditSummaryItem[];
  readonly improvementTips: readonly ImprovementTipItem[];
  readonly visibility: CreditReportVisibility;
}

export interface CreditReportScoreDetails {
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly category: string;
  readonly riskLabel: string;
  readonly change: number;
}

export interface CreditReportConsumer {
  readonly name: string;
  readonly pan: string;
  readonly dateOfBirth: string;
  readonly mobile: string;
  readonly email?: string;
  readonly address?: string;
}

export interface CreditReportAccount {
  readonly id: string;
  readonly lenderName: string;
  readonly accountType: string;
  readonly sanctionedAmount?: number;
  readonly creditLimit?: number;
  readonly outstandingAmount: number;
  readonly status: CreditReportAccountStatus;
}

export interface CreditReportPaymentHistoryItem {
  readonly month: string;
  readonly status: CreditReportPaymentStatus;
}

export interface CreditReportEnquiry {
  readonly id: string;
  readonly lenderName: string;
  readonly enquiryType: string;
  readonly enquiredAt: string;
}

export interface CreditReportData {
  readonly reportId: string;
  readonly generatedAt: string;
  readonly pdfUrl: string;
  readonly bureau: 'EQUIFAX';
  readonly score: CreditReportScoreDetails;
  readonly consumer: CreditReportConsumer;
  readonly accounts: readonly CreditReportAccount[];
  readonly paymentHistory: readonly CreditReportPaymentHistoryItem[];
  readonly enquiries?: readonly CreditReportEnquiry[];
}

export interface CreditReportProgressStep {
  readonly id: string;
  readonly label: string;
  readonly state: CreditReportProgressStepState;
}

/** @deprecated Prefer CreditReportStatus-driven views via useCreditReportPage */
export type CreditReportPageStatus = 'loading' | 'ready' | 'error';
