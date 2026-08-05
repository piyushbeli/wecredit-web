/**
 * Centralized SEO config for all static pages.
 * Source: https://docs.google.com/spreadsheets/d/1R6QSWZCc9BVFnv8jeh9UlH3O0aB7f8wC9Ii6FCfqDpA
 *
 * Each entry maps a canonical path (with trailing slash, matching next.config.ts trailingSlash: true)
 * to its SEO metadata. h1 is exported so components can render a consistent page heading.
 */

export enum WEB_SEO_ROUTES {
  HOME = '/',
  ABOUT_US = '/about-us/',
  BUREAU_REPORT = '/bureau-report/',
  BUSINESS_LOAN = '/business-loan/',
  CALCULATOR_BUSINESS_LOAN = '/calculator/business-loan/',
  CALCULATOR_EMI = '/calculator/emi/',
  CALCULATOR_PERSONAL_LOAN = '/calculator/personal-loan/',
  CAR_LOAN = '/car-loan/',
  CONTACT_US = '/contact-us/',
  DELETE_ACCOUNT = '/delete_account/',
  CREDIT_CARDS = '/credit-cards/',
  FAQ = '/faq/',
  GOLD_LOAN = '/gold-loan/',
  GRIEVANCE_RESTRAIN = '/grievance-redressal/',
  HOME_LOAN = '/home-loan/',
  INSTANT_PERSONAL_LOAN = '/instant-personal-loan/',
  OUR_PARTNERS = '/our-partners/',
  PARTNER_TERMS_AND_CONDITIONS = '/partner-terms-and-conditions/',
  PARTNER_WITH_US = '/partner-with-us/',
  PERSONAL_LOAN = '/personal-loan/',
  PRIVACY_POLICY = '/privacy-policy/',
  TERMS_OF_SERVICE = '/terms-of-service/',
}

export type StaticPageSeoEntry = {
  title: string;
  description: string;
  // h1: string;
  // priority: 'High' | 'Medium';
};

export const STATIC_PAGE_SEO: Record<WEB_SEO_ROUTES, StaticPageSeoEntry> = {
  [WEB_SEO_ROUTES.HOME]: {
    title: 'Quick Personal Loans & Credit Offers | WeCredit',
    description:
      'Compare personal loans, credit cards and EMI tools in one place. Check eligibility, explore lender offers and apply online with WeCredit.',
    // h1: 'Compare Loans & Credit Offers Online',
    // priority: 'Medium',
  } as const,
  [WEB_SEO_ROUTES.ABOUT_US]: {
    title: 'About WeCredit: Loans Made Simple',
    description:
      'Meet WeCredit, a digital credit platform built to make loans and cards easier to compare with transparent information and trusted partners.',
    // h1: 'About WeCredit',
    // priority: 'loan',
  },
  [WEB_SEO_ROUTES.BUREAU_REPORT]: {
    title: 'Check Credit Score & Loan Eligibility | WeCredit',
    description:
      'Check your credit score and understand loan eligibility before applying. Use WeCredit to compare lenders and choose a suitable offer.',
    // h1: 'Check Credit Score & Loan Eligibility',
    // priority: 'High',
  },
  [WEB_SEO_ROUTES.BUSINESS_LOAN]: {
    title: 'Business Loan Offers for MSMEs | WeCredit',
    description:
      'Explore business loan options for working capital, expansion and cash flow needs. Compare offers and check eligibility with WeCredit.',
    // h1: 'Business Loan Offers for MSMEs',
    // priority: 'High',
  },
  [WEB_SEO_ROUTES.CALCULATOR_BUSINESS_LOAN]: {
    title: 'Business Loan EMI Calculator | WeCredit',
    description:
      'Estimate business loan EMI, total interest and repayment amount in seconds. Adjust loan amount, tenure and rate before you apply.',
    // h1: 'Business Loan EMI Calculator',
    // priority: 'High',
  },
  [WEB_SEO_ROUTES.CALCULATOR_EMI]: {
    title: 'Loan EMI Calculator: Plan Repayments | WeCredit',
    description:
      'Use WeCredit EMI calculator to estimate monthly instalments, interest cost and total repayment for personal, business and other loans.',
    // h1: 'Loan EMI Calculator',
    // priority: 'High',
  },
  [WEB_SEO_ROUTES.CALCULATOR_PERSONAL_LOAN]: {
    title: 'Personal Loan EMI Calculator | WeCredit',
    description:
      'Calculate personal loan EMI, interest payable and total repayment instantly. Plan your borrowing before comparing loan offers.',
    // h1: 'Personal Loan EMI Calculator',
    // priority: 'High',
  },
  [WEB_SEO_ROUTES.CAR_LOAN]: {
    title: 'Car Loan Offers for New & Used Cars | WeCredit',
    description:
      'Compare car loan options for new or used vehicles. Check eligibility, estimate EMI and find financing support through WeCredit.',
    // h1: 'Car Loan Offers for New & Used Cars',
    // priority: 'High',
  },
  [WEB_SEO_ROUTES.CONTACT_US]: {
    title: 'Contact WeCredit Support & Grievance Team',
    description:
      'Need help with WeCredit? Contact customer support or the grievance officer for loan queries, complaints and assistance.',
    // h1: 'Contact WeCredit Support',
    // priority: 'Medium',
  },
  [WEB_SEO_ROUTES.DELETE_ACCOUNT]: {
    title: 'Delete Your WeCredit Account',
    description:
      'Request account deletion by contacting WeCredit support. Our team will verify your details and assist you with the process.',
    // h1: 'Delete Your WeCredit Account',
    // priority: 'Medium',
  },
  [WEB_SEO_ROUTES.CREDIT_CARDS]: {
    title: 'Best Credit Card Offers in India | WeCredit',
    description:
      'Compare credit card offers from leading banks for rewards, shopping, travel and savings. Explore options and apply through WeCredit.',
    // h1: 'Best Credit Card Offers in India',
    // priority: 'Medium',
  },
  [WEB_SEO_ROUTES.FAQ]: {
    title: 'WeCredit FAQs: Loans, Cards & Eligibility',
    description:
      'Find answers about personal loans, credit score, eligibility, interest rates, EMI payments, documents and WeCredit support.',
    // h1: 'WeCredit FAQs',
    // priority: 'High',
  },
  [WEB_SEO_ROUTES.GOLD_LOAN]: {
    title: 'Gold Loan Options in India | WeCredit',
    description:
      'Explore gold loan options, compare lenders and understand eligibility, repayment and interest factors before applying with WeCredit.',
    // h1: 'Gold Loan Options in India',
    // priority: 'High',
  },
  [WEB_SEO_ROUTES.GRIEVANCE_RESTRAIN]: {
    title: 'WeCredit Grievance Redressal & Support',
    description:
      'Raise complaints or grievances with WeCredit and find officer contact details, escalation channels and support information.',
    // h1: 'WeCredit Grievance Redressal',
    // priority: 'Medium',
  },
  [WEB_SEO_ROUTES.HOME_LOAN]: {
    title: 'Home Loan Offers & EMI Planning | WeCredit',
    description:
      'Compare home loan options, estimate EMI and review eligibility factors before choosing financing for your property purchase.',
    // h1: 'Home Loan Offers & EMI Planning',
    // priority: 'High',
  },
  [WEB_SEO_ROUTES.INSTANT_PERSONAL_LOAN]: {
    title: 'Instant Personal Loan Online in India – Apply in 2 Min | WeCredit',
    description:
      'Get instant personal loans up to ₹50 Lakhs in India. Low interest from 1.5% p.m., 30-min disbursal, minimal paperwork. Check eligibility free – no credit score impact.',
    // h1: 'Get Instant Personal Loans',
    // priority: 'High',
  },
  [WEB_SEO_ROUTES.OUR_PARTNERS]: {
    title: 'WeCredit Lending Partners & NBFCs',
    description:
      'View WeCredit partner lenders, NBFCs and financial institutions with contact, grievance and official website details.',
    // h1: 'WeCredit Lending Partners',
    // priority: 'Medium',
  },
  [WEB_SEO_ROUTES.PARTNER_TERMS_AND_CONDITIONS]: {
    title: 'Partner Terms & Conditions | WeCredit',
    description:
      'Read partner-wise terms, consent language and lender conditions used in WeCredit loan journeys and financial product applications.',
    // h1: 'Partner Terms & Conditions',
    // priority: 'Medium',
  },
  [WEB_SEO_ROUTES.PARTNER_WITH_US]: {
    title: 'Partner With WeCredit for Lending Growth',
    description:
      'Partner with WeCredit to distribute loans and financial products through a digital credit marketplace built for Indian users.',
    // h1: 'Partner With WeCredit',
    // priority: 'High',
  },
  [WEB_SEO_ROUTES.PERSONAL_LOAN]: {
    title: 'Personal Loan Online: Compare Offers | WeCredit',
    description:
      'Compare personal loan offers, interest rates and eligibility. Apply online through WeCredit with simple steps and lender options.',
    // h1: 'Personal Loan Online',
    // priority: 'Medium',
  },
  [WEB_SEO_ROUTES.PRIVACY_POLICY]: {
    title: 'Privacy Policy: How WeCredit Uses Data',
    description:
      'Read how WeCredit collects, uses, shares and protects personal data across its website, app, services and partner journeys.',
    // h1: 'Privacy Policy',
    // priority: 'High',
  },
  [WEB_SEO_ROUTES.TERMS_OF_SERVICE]: {
    title: 'Terms of Service: WeCredit User Terms',
    description:
      'Read WeCredit terms covering platform access, user responsibilities, services, partner offers, disclaimers and legal conditions.',
    // h1: 'Terms of Service',
    // priority: 'High',
  },
};
