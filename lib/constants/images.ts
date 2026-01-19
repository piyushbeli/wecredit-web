/**
 * Centralized image and SVG paths for the entire project.
 * Use these constants instead of hardcoded strings to ensure consistency
 * and make path changes easier.
 */
export const IMAGES = {
  LOGOS: {
    DEFAULT: '/assets/images/logo.png',
    TRANSPARENT: '/assets/images/logo-transparent.jpg',
  },
  CAROUSEL: {
    SLIDE_1: '/assets/images/carousel-one.png',
    SLIDE_2: '/assets/images/carousel-two.png',
    SLIDE_3: '/assets/images/carousel-three.png',
  },
  CERTIFICATIONS: {
    ISO_BADGE_1: '/assets/images/certifications/iso-badge-1.png',
    CII_LOGO: '/assets/images/certifications/cii-logo.png',
    ISO_CERTIFIED: '/assets/images/certifications/iso-certified-company.png',
  },
  APP: {
    GOOGLE_PLAY: '/assets/images/google-play-badge.png',
    APP_STORE: '/assets/images/app-store-badge.png',
    MOCKUP: '/assets/images/wecredit-app-mock.png',
  },
  ILLUSTRATIONS: {
    EMI_CALC: '/assets/images/emi-calculator-illustration.png',
    PERSONAL_LOAN: '/assets/images/personal-loan-illustration.png',
    CREDIT_SCORE: '/assets/images/check-credit-score.png',
    BUSINESS_LOAN_CALC: '/assets/images/business-loan-calculator-illustration.png',
    OTP_SMS: '/assets/images/otp-sms.png',
  },
  DIRECT_CONTACT_EXPERTS: {
    LAKASH: '/assets/images/lakash.png',
    PLAYSTORE_ICON: '/assets/images/playstoreicon.png',
  },
  ICONS: {
    PERCENTAGE: '/assets/svgs/percentage-icon.svg',
    CALENDAR: '/assets/svgs/calendar-icon.svg',
    PERSONAL_LOAN: '/assets/svgs/personal-loan.svg',
    BUSINESS_LOAN: '/assets/svgs/business-loan.svg',
    PL_BY_ONDC: '/assets/svgs/pl-by-ondc.svg',
    CREDIT_CARD: '/assets/svgs/credit-card.svg',
    DOCUMENT: '/assets/svgs/document.svg',
    OTP: '/assets/svgs/otp.svg',
    VECTOR: '/assets/svgs/vector.svg',
    HOURGLASS: '/assets/svgs/hourglass.svg',
  },
  PARTNERS: {
    BASE_PATH: '/assets/images/partners',
  },
} as const;
