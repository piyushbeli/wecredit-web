/**
 * Personal Loan Page Constants
 * Static data for all sections of the personal loan landing page
 */

import { Calculator, Clock, Shield, Percent, FileText, Users, Zap, HeadphonesIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** Benefit card configuration */
export interface BenefitItem {
  id: string;
  icon: string;
  title: string;
  value: string;
  fallbackIcon: string;
}

/** Hero section benefits */
export const HERO_BENEFITS: BenefitItem[] = [
  {
    id: 'loan-amount',
    icon: '/icons/loan-amount.svg',
    title: 'Loan Amount',
    value: 'Upto ₹15 Lakhs',
    fallbackIcon: '💰',
  },
  {
    id: 'interest-rate',
    icon: '/icons/interest-rate.svg',
    title: 'Interest Rate',
    value: 'From 9.9%',
    fallbackIcon: '📊',
  },
  {
    id: 'disbursal',
    icon: '/icons/disbursal.svg',
    title: 'Disbursal',
    value: 'In 5 Minutes',
    fallbackIcon: '⚡',
  },
];

/** Step configuration for how to apply */
export interface StepItem {
  id: string;
  number: number;
  title: string;
  description: string;
}

/** How to apply steps */
export const HOW_TO_APPLY_STEPS: StepItem[] = [
  {
    id: 'step-1',
    number: 1,
    title: 'Step 1 :',
    description: 'Enter your mobile number and verify with OTP',
  },
  {
    id: 'step-2',
    number: 2,
    title: 'Step 2:',
    description: 'Enter your personal details',
  },
  {
    id: 'step-3',
    number: 3,
    title: 'Step 3 :',
    description: 'Choose best-suited offer or lender for you',
  },
];

/** Document item configuration */
export interface DocumentItem {
  id: string;
  title: string;
  description: string;
}

/** Documents required for personal loan */
export const DOCUMENTS_REQUIRED: DocumentItem[] = [
  {
    id: 'doc-identity',
    title: 'Identity Proof',
    description: 'Aadhaar Card / PAN Card / Voter ID / Passport',
  },
  {
    id: 'doc-address',
    title: 'Address Proof',
    description: 'Aadhaar Card / Utility Bills / Rent Agreement',
  },
  {
    id: 'doc-income',
    title: 'Income Proof',
    description: 'Salary Slips (3 months) / Bank Statement (6 months)',
  },
  {
    id: 'doc-photo',
    title: 'Photograph',
    description: 'Passport-sized recent photograph',
  },
  {
    id: 'doc-bank',
    title: 'Bank Details',
    description: 'Cancelled cheque / Bank account statement',
  },
  {
    id: 'doc-employment',
    title: 'Employment Proof',
    description: 'Employee ID / Offer Letter / Employment Certificate',
  },
];

/** Documents required for salaried employees */
export const SALARIED_DOCUMENTS: DocumentItem[] = [
  {
    id: 'identity',
    title: 'Identity Proof :',
    description: 'PAN, Aadhaar, Passport, or Voter ID',
  },
  {
    id: 'address',
    title: 'Address Proof:',
    description: 'Utility bill, Aadhaar, Passport, or Rent Agreement',
  },
  {
    id: 'income',
    title: 'Income Proof:',
    description: 'Last 3 months salary slips and bank statements',
  },
];

/** Documents required for self-employed individuals */
export const SELF_EMPLOYED_DOCUMENTS: DocumentItem[] = [
  {
    id: 'identity',
    title: 'Identity Proof :',
    description: 'PAN, Aadhaar, Passport, or Voter ID',
  },
  {
    id: 'address',
    title: 'Address Proof:',
    description: 'Utility bill, Aadhaar, Passport, or Rent Agreement',
  },
  {
    id: 'income',
    title: 'Income Proof:',
    description: 'Last 2 years ITR and business proof',
  },
];

/** Eligibility item configuration */
export interface EligibilityItem {
  id: string;
  title: string;
  requirement: string;
}

/** Eligibility criteria for personal loan */
export const ELIGIBILITY_CRITERIA: EligibilityItem[] = [
  {
    id: 'age',
    title: 'Age :',
    requirement: '21 to 60 years, for self employed and pensioners it may go up to 70.',
  },
  {
    id: 'employment',
    title: 'Employment:',
    requirement: 'You must be either a salaried or a self-employed.',
  },
  {
    id: 'credit-score',
    title: 'Credit Score :',
    requirement: '720+ Recommended',
  },
  {
    id: 'salary',
    title: 'Salary :',
    requirement: 'Usually Rs. 20,000 - 30,000 a month',
  },
  {
    id: 'income',
    title: 'Income :',
    requirement: '3 Lakhs annually (For self-employed person)',
  },
];

/** Lender interest rate configuration */
export interface LenderRate {
  id: string;
  name: string;
  logo: string;
  interestRate: string;
  processingFee: string;
  loanAmount: string;
  tenure: string;
}

/** Interest rates by lender */
export const LENDER_RATES: LenderRate[] = [
  {
    id: 'mpokket',
    name: 'mPokket',
    logo: '/logos/mpokket.png',
    interestRate: '0% - 48%',
    processingFee: '0% - 15%',
    loanAmount: '₹500 - ₹30,000',
    tenure: '61 - 120 days',
  },
  {
    id: 'fibe',
    name: 'Fibe',
    logo: '/logos/fibe.png',
    interestRate: '14% - 30%',
    processingFee: '2% - 6%',
    loanAmount: '₹5,000 - ₹5,00,000',
    tenure: '3 - 36 months',
  },
  {
    id: 'kreditbee',
    name: 'KreditBee',
    logo: '/logos/kreditbee.png',
    interestRate: '0% - 29.95%',
    processingFee: '0% - 10%',
    loanAmount: '₹1,000 - ₹5,00,000',
    tenure: '2 - 24 months',
  },
  {
    id: 'moneyview',
    name: 'MoneyView',
    logo: '/logos/moneyview.png',
    interestRate: '14% - 36%',
    processingFee: '2% - 8%',
    loanAmount: '₹10,000 - ₹10,00,000',
    tenure: '3 - 60 months',
  },
  {
    id: 'cashe',
    name: 'CASHe',
    logo: '/logos/cashe.png',
    interestRate: '2.25% p.m.',
    processingFee: '2% - 3%',
    loanAmount: '₹5,000 - ₹4,00,000',
    tenure: '3 - 18 months',
  },
  {
    id: 'nira',
    name: 'NIRA',
    logo: '/logos/nira.png',
    interestRate: '24% - 36%',
    processingFee: '2.5% - 5%',
    loanAmount: '₹5,000 - ₹1,00,000',
    tenure: '3 - 12 months',
  },
];

/** Why WeCredit benefit configuration */
export interface WhyWeCreditItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Why choose WeCredit benefits */
export const WHY_WECREDIT_BENEFITS: WhyWeCreditItem[] = [
  {
    id: 'instant-approval',
    icon: Zap,
    title: 'Instant Approval',
    description: 'Get loan approval within minutes with our AI-powered verification system.',
  },
  {
    id: 'low-interest',
    icon: Percent,
    title: 'Low Interest Rates',
    description: 'Compare offers from 30+ lenders to find the best interest rates for you.',
  },
  {
    id: 'minimal-docs',
    icon: FileText,
    title: 'Minimal Documentation',
    description: 'Simple online process with minimal paperwork required.',
  },
  {
    id: 'secure',
    icon: Shield,
    title: '100% Secure',
    description: 'Your data is encrypted and protected with bank-grade security.',
  },
  {
    id: 'support',
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Our customer support team is available round the clock to assist you.',
  },
  {
    id: 'trusted',
    icon: Users,
    title: 'Trusted by Lakhs',
    description: 'Over 4 lakh+ satisfied customers have chosen WeCredit for their loans.',
  },
];

/** Simplified Why WeCredit benefit for 2x2 grid */
export interface WhyWeCreditSimpleItem {
  id: string;
  text: string;
}

/** Simplified benefits for Why Choose WeCredit section */
export const WHY_WECREDIT_SIMPLE: WhyWeCreditSimpleItem[] = [
  {
    id: 'multiple-offers',
    text: 'Multiple personal loan offers',
  },
  {
    id: 'eligibility-check',
    text: 'Check eligibility in one place',
  },
  {
    id: 'higher-approval',
    text: 'Higher loan approval chances',
  },
  {
    id: 'quick-disbursal',
    text: 'Quick approval and fast loan disbursal',
  },
];

/** Interest rates info section content */
export const INTEREST_RATES_INFO = {
  title: 'Personal loan Interest Rates',
  description:
    "Personal loan interest rates available on WeCredit start from 9.99% p.a.* The final rate offered depends on the lender's criteria, loan amount, tenure, and the applicant's credit profile. Comparing offers from multiple banks and NBFCs can help in selecting a suitable interest rate.",
};

/** Eligibility section content */
export const ELIGIBILITY_SECTION_INFO = {
  title: 'Eligibility Criteria of Personal Loan',
  description:
    'Eligibility criteria for a personal loan may vary from lender to lender, but these are some basic requirements.',
};

/** EMI Calculator configuration */
export const EMI_CALCULATOR_CONFIG = {
  loanAmount: {
    min: 5000,
    max: 1500000,
    step: 5000,
    default: 25000,
  },
  tenure: {
    minMonths: 1,
    maxMonths: 288, // 24 years
    default: 4,
  },
  interestRate: {
    min: 8,
    max: 30,
    step: 0.5,
    default: 10.5,
  },
} as const;

/** Stats data */
export const STATS_DATA = [
  {
    id: 'disbursed',
    label: 'Total Loan Disbursed',
    value: '₹650 Crore',
  },
  {
    id: 'users',
    label: 'Trusted by',
    value: '4 Lakh+ Indians',
  },
];

/** Video section configuration */
export const VIDEO_CONFIG = {
  thumbnailUrl: '/assets/images/personal-loan-video-thumbnail.jpg',
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  title: 'How WeCredit Works',
  fallbackThumbnail: '/assets/images/personal-loan-illustration.png',
};

/** FAQ items specific to personal loan */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const PERSONAL_LOAN_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is a personal loan?',
    answer: 'A personal loan is an unsecured loan that you can use for various personal expenses such as medical emergencies, home renovation, travel, wedding, or debt consolidation. Unlike secured loans, personal loans do not require any collateral.',
  },
  {
    id: 'faq-2',
    question: 'What is the maximum loan amount I can get?',
    answer: 'Through WeCredit, you can get personal loans ranging from ₹5,000 to ₹15,00,000 depending on your income, credit score, and the lender you choose. The exact amount will be determined based on your eligibility.',
  },
  {
    id: 'faq-3',
    question: 'What are the interest rates for personal loans?',
    answer: 'Interest rates for personal loans through WeCredit range from 9.9% to 36% per annum, depending on the lender, your credit profile, and loan amount. We help you compare offers from 30+ lenders to find the best rate.',
  },
  {
    id: 'faq-4',
    question: 'How quickly can I get the loan disbursed?',
    answer: 'Once your loan is approved, the amount can be disbursed to your bank account within 5 minutes to 24 hours, depending on the lender. Most of our partner lenders offer same-day disbursal.',
  },
  {
    id: 'faq-5',
    question: 'What documents are required for a personal loan?',
    answer: 'Basic documents required include: Identity proof (Aadhaar/PAN), Address proof, Income proof (salary slips or bank statements), and a photograph. Some lenders may have additional requirements based on the loan amount.',
  },
  {
    id: 'faq-6',
    question: 'Can I prepay my personal loan?',
    answer: 'Yes, most lenders allow prepayment of personal loans. However, some may charge a prepayment penalty (usually 2-5% of the outstanding amount). Check with your lender for specific prepayment terms.',
  },
  {
    id: 'faq-7',
    question: 'What happens if I miss an EMI payment?',
    answer: 'Missing an EMI payment can result in late payment fees, increased interest charges, and negatively impact your credit score. If you anticipate difficulty in making payments, contact your lender immediately to discuss options.',
  },
];
