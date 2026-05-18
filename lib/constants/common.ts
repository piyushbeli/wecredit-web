import { SlideContent } from "@/components/home/hero-carousel";
import { Partner } from "@/types/wecredit";
import { IMAGES } from "./images";
import { Testimonial } from "@/components/home/testimonials-section";

/**
 * Cache revalidation times for different data types
 * Optimized to reduce Vercel function costs while maintaining data freshness
 */
export const CACHE_TIMES = {
  HOUR_24: 86400, // 24 hours
  HOUR_1: 3600, // 1 hour
  MINUTE_5: 300, // 5 minutes

  STATIC_PAGES: 3600, // 1 hour
} as const;

/**
 * List of all partner logos
 * Images should be placed in /public/assets/images/partners/
 */
export const PARTNERS: Partner[] = [
  { name: "MoneyView", logo: `${IMAGES.PARTNERS.BASE_PATH}/moneyview.png` },
  { name: "KreditBee", logo: `${IMAGES.PARTNERS.BASE_PATH}/KB.png` },
  { name: "L&T Finance", logo: `${IMAGES.PARTNERS.BASE_PATH}/L&T.png` },
  { name: "Olyv", logo: `${IMAGES.PARTNERS.BASE_PATH}/OLYV.png` },
  { name: "Zype", logo: `${IMAGES.PARTNERS.BASE_PATH}/ZYPE.png` },
  { name: "mPokket", logo: `${IMAGES.PARTNERS.BASE_PATH}/MPOKKET.png` },
  {
    name: "Hero Fincorp",
    logo: `${IMAGES.PARTNERS.BASE_PATH}/HERO FINCORPV.png`,
  },
  {
    name: "Poonawalla Fincorp",
    logo: `${IMAGES.PARTNERS.BASE_PATH}/Poonawala fincorp.png`,
  },
  { name: "Ram Fincorp", logo: `${IMAGES.PARTNERS.BASE_PATH}/Ram fincorp.png` },
  { name: "Creditt+", logo: `${IMAGES.PARTNERS.BASE_PATH}/creditt.png` },
  { name: "True Balance", logo: `${IMAGES.PARTNERS.BASE_PATH}/truebalance.png` },
  {
    name: "Chintamani Finlease",
    logo: `${IMAGES.PARTNERS.BASE_PATH}/chintamani finlease.png`,
  },
  { name: "FLot", logo: `${IMAGES.PARTNERS.BASE_PATH}/Flot.png` },
  { name: "TrustPaisa", logo: `${IMAGES.PARTNERS.BASE_PATH}/Trust Paisa.png` },
  {
    name: "LendingPlate",
    logo: `${IMAGES.PARTNERS.BASE_PATH}/lending plate.png`,
  },
  { name: "FDPL Finance", logo: `${IMAGES.PARTNERS.BASE_PATH}/FDPL.png` },
  {
    name: "Salary On Time",
    logo: `${IMAGES.PARTNERS.BASE_PATH}/Salary on time.png`,
  },
  {
    name: "Emergency Paisa",
    logo: `${IMAGES.PARTNERS.BASE_PATH}/emergency paisa.png`,
  },
  { name: "BrightLoans", logo: `${IMAGES.PARTNERS.BASE_PATH}/Bright loans.png` },
  { name: "FatakPay", logo: `${IMAGES.PARTNERS.BASE_PATH}/FATAK PAY.png` },
  { name: "Dhanvarsha", logo: `${IMAGES.PARTNERS.BASE_PATH}/dhanvarsha.png` },
  { name: "Fatafat", logo: `${IMAGES.PARTNERS.BASE_PATH}/fatafat.png` },
  { name: "Loan Bazaar", logo: `${IMAGES.PARTNERS.BASE_PATH}/loan_bazaar.png` },
  { name: "TezCredit", logo: `${IMAGES.PARTNERS.BASE_PATH}/tezcredit.png` },
  { name: "Cashvia", logo: `${IMAGES.PARTNERS.BASE_PATH}/cashvia.png` },
  { name: "Branch", logo: `${IMAGES.PARTNERS.BASE_PATH}/branch.png` },
];


/**
 * Split partners into rows for the marquee display
 */
export const ROW_1_PARTNERS = PARTNERS.slice(0, 7);
export const ROW_2_PARTNERS = PARTNERS.slice(7, 14);
export const ROW_3_PARTNERS = PARTNERS.slice(14, 21);

/** Carousel slides data */
export const HERO_CAROUSEL_SLIDES: SlideContent[] = [
  {
    id: "slide-1",
    image: IMAGES.CAROUSEL.SLIDE_1,
    titleWhite: "More Savings",
    titleGradient: "on Every Loan",
    ctaText: "Apply For Loan",
    ctaLink: "/personal-loan",
  },
  {
    id: "slide-2",
    image: IMAGES.CAROUSEL.SLIDE_2,
    titleWhite: "Find the Card",
    titleGradient: "That Fits You",
    ctaText: "Get Your Card",
    ctaLink: "/credit-cards",
  },
  {
    id: "slide-3",
    image: IMAGES.CAROUSEL.SLIDE_3,
    titleWhite: "More Choices",
    titleGradient: "Better Loan Deals",
    ctaText: "Check Eligibility",
    ctaLink: "/bureau-report",
  },
];
  

/** Static testimonials data */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'testimonial-1',
    thumbnailUrl: IMAGES.LOGOS.TRANSPARENT,
    videoUrl: '/videos/dummy.mp4',
    quote: 'I got my loan approved faster than I ever expected completely hassle-free!',
    customerName: 'Sarah M.',
  },
  {
    id: 'testimonial-2',
    thumbnailUrl: IMAGES.LOGOS.TRANSPARENT,
    videoUrl: '/videos/dummy.mp4',
    quote: 'WeCredit made the entire process so simple. Highly recommended!',
    customerName: 'Rahul K.',
  },
  {
    id: 'testimonial-3',
    thumbnailUrl: IMAGES.LOGOS.TRANSPARENT,
    videoUrl: '/videos/dummy.mp4',
    quote: 'Best loan experience I have ever had. Quick approval and great rates!',
    customerName: 'Priya S.',
  },
  {
    id: 'testimonial-4',
    thumbnailUrl: IMAGES.LOGOS.TRANSPARENT,
    videoUrl: '/videos/dummy.mp4',
    quote: 'From application to disbursement, everything was seamless!',
    customerName: 'Amit P.',
  },
];


export const UNITY_CONSENT = `I hereby give my consent to Unity Small Finance Bank Limited. as lender to collect, store and verify my credit report from Credit Bureaus and KYC details for the processing of my loan application and contact me through SMS / WhatsApp / Call with reference to my loan application.`

// Dedicated partner terms route for multi-lender consent UI.
export const MULTILENDER_PARTNER_TERMS_HREF = '/partner-terms-and-conditions';
