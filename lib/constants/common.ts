import { SlideContent } from "@/components/home/hero-carousel";
import { Partner } from "@/types/wecredit";
import { IMAGES } from "./images";

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
  { name: "CreditSea", logo: `${IMAGES.PARTNERS.BASE_PATH}/CREDIT SEA.png` },
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
    ctaLink: "#",
  },
  {
    id: "slide-2",
    image: IMAGES.CAROUSEL.SLIDE_2,
    titleWhite: "More Savings",
    titleGradient: "on Every Loan",
    ctaText: "Get Your Card",
    ctaLink: "#",
  },
  {
    id: "slide-3",
    image: IMAGES.CAROUSEL.SLIDE_3,
    titleWhite: "More Savings",
    titleGradient: "on Every Loan",
    ctaText: "Check Eligibility",
    ctaLink: "#",
  },
];
  