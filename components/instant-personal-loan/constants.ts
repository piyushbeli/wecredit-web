/**
 * Static content for the Instant Personal Loan landing page.
 * Keeps copy and section data separate from UI components.
 */

import { Eye, Percent, Shield, Zap, type LucideIcon } from 'lucide-react';

/** Hero benefit pill shown below the headline */
export interface HeroBenefit {
  id: string;
  label: string;
  icon: 'rupee' | 'percent' | 'lightning';
}

export const HERO_TAGLINE = 'Loans for every small profit.';
export const HERO_HEADLINE = 'Get Instant Personal Loans.';

export const HERO_BENEFITS: HeroBenefit[] = [
  { id: 'loan-amount', label: 'Higher loan amount', icon: 'rupee' },
  { id: 'interest-rate', label: 'Lowest interest rates', icon: 'percent' },
  { id: 'paperless', label: 'Fast approvals', icon: 'lightning' },
];

/** How It Works step */
export interface HowItWorksStep {
  id: string;
  number: number;
  title: string;
  description: string;
}

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: 'eligibility',
    number: 1,
    title: 'Check Eligibility',
    description: 'Enter basic details to find your approved limit in 2 minutes.',
  },
  {
    id: 'documents',
    number: 2,
    title: 'Upload Documents',
    description: 'Complete your KYC online with Aadhar and Pan securely.',
  },
  {
    id: 'transfer',
    number: 3,
    title: 'Instant Transfer',
    description: 'Money is credited to your bank account within 30 minutes.',
  },
];

/** Why WeCredit benefit card */
export interface WhyWeCreditBenefit {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const WHY_WECREDIT_BENEFITS: WhyWeCreditBenefit[] = [
  {
    id: 'super-fast',
    title: 'Super Fast',
    description: 'Approval in 30 seconds',
    icon: Zap,
  },
  {
    id: 'secure',
    title: '100% Secure',
    description: 'RBI Registered process',
    icon: Shield,
  },
  {
    id: 'lowest-roi',
    title: 'Lowest ROI',
    description: 'Starting at 1.5% p.m.',
    icon: Percent,
  },
  {
    id: 'no-hidden-cost',
    title: 'No Hidden Cost',
    description: 'Full transparency',
    icon: Eye,
  },
];

/** Icon key mapped to per-criterion visuals in the eligibility section */
export type EligibilityIconKey = 'age' | 'employment' | 'credit-score' | 'salary' | 'income';

/** Eligibility criteria item */
export interface EligibilityItem {
  id: string;
  title: string;
  requirement: string;
  icon: EligibilityIconKey;
}

export const ELIGIBILITY_SECTION_TITLE = 'Eligibility Criteria for Personal Loan';

export const ELIGIBILITY_SECTION_DESCRIPTION =
  'Eligibility criteria for a personal loan may vary from lender to lender, but these are some basic requirements.';

export const ELIGIBILITY_CRITERIA: EligibilityItem[] = [
  {
    id: 'age',
    title: 'Age :',
    requirement: '21 to 60 years old for self-employed and pensioners it may go up to 70.',
    icon: 'age',
  },
  {
    id: 'employment',
    title: 'Employment:',
    requirement: 'You must be either a salaried or a self-employed.',
    icon: 'employment',
  },
  {
    id: 'credit-score',
    title: 'Credit Score :',
    requirement: '720+ Recommended',
    icon: 'credit-score',
  },
  {
    id: 'salary',
    title: 'Salary :',
    requirement: 'Usually Rs. 20,000 - 30,000 a month',
    icon: 'salary',
  },
  {
    id: 'income',
    title: 'Income :',
    requirement: '3 Lakhs annually (For self-employed person)',
    icon: 'income',
  },
];

/** Document checklist item */
export interface DocumentItem {
  id: string;
  title: string;
  description: string;
}

export const DOCUMENTS_SECTION_TITLE = 'Documents Required for Personal Loan';

export const DOCUMENTS_SECTION_DESCRIPTION =
  'Basically it depends on the lender how they verify the customer, here are some common documents required for personal loan application.';

export const SALARIED_DOCUMENTS: DocumentItem[] = [
  {
    id: 'identity',
    title: 'Identity Proof :',
    description: 'PAN Card, Aadhaar Card, etc.',
  },
  {
    id: 'address',
    title: 'Address Proof:',
    description: 'Utility bills, Rent Agreement, etc.',
  },
  {
    id: 'income',
    title: 'Income Proof:',
    description: 'Last 3 months salary slips and 6 months bank statement.',
  },
];

export const SELF_EMPLOYED_DOCUMENTS: DocumentItem[] = [
  {
    id: 'identity',
    title: 'Identity Proof :',
    description: 'PAN Card, Aadhaar Card, etc.',
  },
  {
    id: 'address',
    title: 'Address Proof:',
    description: 'Utility bills, Rent Agreement, etc.',
  },
  {
    id: 'income',
    title: 'Income Proof:',
    description: 'Last 2–3 years ITR, GST Certificate, and 6-months bank statement.',
  },
];

/** Loan repayment terms content */
export const REPAYMENT_TERMS = {
  title: 'Loan Repayment Terms',
  repaymentPeriod: {
    label: 'Repayment Period',
    value: 'Minimum 3 months, Maximum 60 months.',
  },
  interestRates: {
    label: 'APR Range',
    value: '2% to 33%, with a maximum APR of 20%, depending on loan amount and repayment period.',
  },
  representativeExample: {
    label: 'Representative Example',
    value: 'For a ₹10,00,000 loan with an 18% APR over 60 months, the monthly repayment is ₹29,351, totaling ₹17,81,079 with interest and processing fees.'
  },
};

/** Minimal page footer links */
export const FOOTER_LINKS = [
  { id: 'privacy', label: 'Privacy Policy', href: '/privacy-policy/' },
  { id: 'terms', label: 'Terms of Service', href: '/terms-of-service/' },
] as const;

export const FOOTER_COPYRIGHT =`© ${new Date().getFullYear()} Quantum X Global Private Limited. All Rights Reserved.`;
