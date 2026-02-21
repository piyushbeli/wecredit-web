/**
 * Personal Loan Page Constants
 * Static data for all sections of the personal loan landing page
 */

import { IMAGES } from '@/lib/constants/images';
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
    description: 'Last 2–3 years ITR, GST Certificate, and 6-months bank statement',
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
    question: 'What is a personal loan and how does it work?',
    answer: 'A personal loan is an unsecured loan that can be used for any personal need. The approved amount is repaid in fixed monthly EMIs over a chosen tenure.',
  },
  {
    id: 'faq-2',
    question: 'What credit score is required for a personal loan?',
    answer: 'Most lenders prefer a credit score of 720 or above. A higher score improves approval chances and may help get better interest rates.',
  },
  {
    id: 'faq-3',
    question: 'How much personal loan amount can be availed?',
    answer: 'The loan amount depends on income, credit profile, existing liabilities, and lender policy. On WeCredit, offers may range from ₹5,000 to ₹15 lakh.',
  },
  {
    id: 'faq-4',
    question: 'How are personal loan interest rates decided?',
    answer: 'Interest rates are based on factors like credit score, income stability, loan amount, tenure, and the lender\'s internal policy.',
  },
  {
    id: 'faq-5',
    question: 'What documents are required to apply for a personal loan?',
    answer: 'Basic documents usually include identity proof, address proof, income proof, and bank statements. Requirements may vary by lender.',
  },
  {
    id: 'faq-6',
    question: 'How long does personal loan approval and disbursal take?',
    answer: 'Approval timelines vary by lender, but many personal loans are approved within minutes and disbursed shortly after verification.',
  },
  {
    id: 'faq-7',
    question: 'Does applying for a personal loan affect credit score?',
    answer: 'Yes. Each application may result in a credit enquiry, which can slightly impact the credit score. Comparing offers on a single platform helps reduce multiple enquiries.',
  },
  {
    id: 'faq-8',
    question: 'Can a personal loan be repaid before tenure completion?',
    answer: 'Yes, most lenders allow prepayment or foreclosure, but charges may apply depending on lender terms and loan duration.',
  },
  {
    id: 'faq-9',
    question: 'What happens if an EMI is missed?',
    answer: 'Missing an EMI can attract late payment charges and negatively impact the credit score. Repeated delays may affect future loan eligibility.',
  },
  {
    id: 'faq-10',
    question: 'Is collateral required for a personal loan?',
    answer: 'No. Personal loans are unsecured and do not require any collateral or security.',
  },
];

/** Fee and charge item configuration */
export interface FeeChargeItem {
  id: string;
  label: string;
  value: string;
}

/** Fees and charges for personal loan */
export const FEES_AND_CHARGES: FeeChargeItem[] = [
  {
    id: 'interest-rates',
    label: 'Interest rates:',
    value: 'Starting from 9.99%',
  },
  {
    id: 'processing-fee',
    label: 'Processing fee',
    value: '0.5% to 4% of the loan amount',
  },
  {
    id: 'foreclosure-charges',
    label: 'Foreclosure charges',
    value: 'Often 1-5% of the outstanding loan amount',
  },
  {
    id: 'late-payment-charges',
    label: 'Late payment charges',
    value: 'Around 2% per month on overdue EMIs',
  },
  {
    id: 'emi-bounce-charges',
    label: 'EMI bounce charges',
    value: '₹300 to ₹1,500 per bounce depending on policy',
  },
  {
    id: 'loan-cancellation',
    label: 'Loan Cancellation',
    value: 'Nil to ₹1,000 (post-sanction)',
  },
  {
    id: 'statement-fees',
    label: 'Statement Fees',
    value: '₹100 to ₹500 per request',
  },
];

/** Fees and charges section content */
export const FEES_CHARGES_INFO = {
  title: 'Fees and charges',
  description:
    'Personal loan fees and charges vary based on lender and bank policies. The information below explains the charges generally applicable.',
};

/** How we work section content */
export const HOW_WE_WORK_INFO = {
  title: 'How We Work',
  description:
    'When an application is submitted, our PL engine reviews the provided details such as basic information, income, and credit profile. Based on the given information, eligible lenders are matched according to their criteria. The engine then shows suitable personal loan offers available for the profile, making it easier to compare and proceed with the most relevant option.',
};

/** Tip card item configuration */
export interface TipCardItem {
  id: string;
  title: string;
  description: string;
}

/** Tips to know before applying for a personal loan */
export const BEFORE_APPLYING_TIPS: TipCardItem[] = [
  {
    id: 'credit-score-impact',
    title: 'Credit Score Impact on Loan Approval and Interest Rate',
    description:
      'A higher credit score improves approval chances and may help get a lower interest rate. A low credit score can lead to higher rates or even rejection.',
  },
  {
    id: 'eligibility-varies',
    title: 'Personal Loan Eligibility Varies Across Lenders',
    description:
      'Each bank or NBFC has its own eligibility rules based on factors like income, employment type, and location.',
  },
  {
    id: 'fees-increase-cost',
    title: 'Fees and Charges Increase the Total Loan Cost',
    description:
      'Charges such as processing fees, prepayment charges, and late payment penalties add to the overall cost of the loan. These should be checked along with the interest rate.',
  },
  {
    id: 'multiple-applications',
    title: 'Multiple Loan Applications Can Affect Credit Score',
    description:
      'Applying to many lenders separately can result in multiple credit checks, which may impact the credit score. Comparing offers on one platform can help reduce this.',
  },
  {
    id: 'emi-payment-history',
    title: 'EMI Payment History Affects Future Loan Eligibility',
    description:
      'Missing or delaying EMI payments can lower the credit score and affect eligibility for future loans or better interest rates.',
  },
];

/** Before applying section content */
export const BEFORE_APPLYING_INFO = {
  title: 'Things to Know Before Applying',
};

/** Checklist item configuration */
export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
}

/** Things to do after loan closure */
export const AFTER_CLOSURE_CHECKLIST: ChecklistItem[] = [
  {
    id: 'confirm-closure',
    title: 'Confirm loan closure',
    description: 'Ensure the lender has officially marked the loan as closed after the final EMI.',
  },
  {
    id: 'collect-noc',
    title: 'Collect loan closure letter and NOC',
    description: 'These documents confirm that there are no pending dues on the loan.',
  },
  {
    id: 'check-credit-report',
    title: 'Check credit report status',
    description:
      'Verify that the loan shows as "closed" in the credit report to avoid issues in future applications.',
  },
  {
    id: 'avoid-new-loans',
    title: 'Avoid new loans instantly',
    description:
      'Allow some time after loan closure before applying for a new loan to keep the credit profile stable.',
  },
  {
    id: 'stop-auto-debit',
    title: 'Stop EMI auto-debit',
    description: 'Cancel the EMI auto-debit mandate to prevent any unintended deductions.',
  },
  {
    id: 'save-documents',
    title: 'Save all loan documents',
    description:
      'Keep loan agreements, payment receipts, and closure documents for future reference.',
  },
];

/** After closure section content */
export const AFTER_CLOSURE_INFO = {
  title: 'Things to Do After Loan Closure',
};

/** Expert quote configuration */
export interface ExpertQuote {
  quote: string;
  name: string;
  designation: string;
  imageUrl: string;
}

/** Expert testimonial quote */
export const EXPERT_QUOTE: ExpertQuote = {
  quote:
    "A personal loan is not just a transaction. It is a moment in someone's life, a medical bill that could not wait, a dream that needed a push, or a gap that needed filling. When we started WeCredit, we wanted to make sure that moment felt simple, fair, and judgment-free. That has not changed, and it never will.",
  name: 'Laksh Dua',
  designation: 'Co - Founder',
  imageUrl:IMAGES.DIRECT_CONTACT_EXPERTS.LAKASH,
};

/** Expert quote section content */
export const EXPERT_QUOTE_INFO = {
  title: 'Direct from Expert',
};
