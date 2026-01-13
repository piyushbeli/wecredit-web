import { Partner } from "@/types/wecredit";

/**
 * Cache revalidation times for different data types
 * Optimized to reduce Vercel function costs while maintaining data freshness
 */
export const CACHE_TIMES = {

    HOUR_24: 86400, // 24 hours
    HOUR_1: 3600, // 1 hour
    MINUTE_5: 300, // 5 minutes
  
    STATIC_PAGES: 3600,      // 1 hour
    
  } as const;


  /**
 * List of all partner logos
 * Images should be placed in /public/assets/images/partners/
 */
export const PARTNERS: Partner[] = [
	{ name: 'MoneyView', logo: '/assets/images/partners/moneyview.png' },
	{ name: 'KreditBee', logo: '/assets/images/partners/KB.png' },
	{ name: 'L&T Finance', logo: '/assets/images/partners/L&T.png' },
	{ name: 'Olyv', logo: '/assets/images/partners/OLYV.png' },
	{ name: 'Zype', logo: '/assets/images/partners/ZYPE.png' },
	{ name: 'mPokket', logo: '/assets/images/partners/MPOKKET.png' },
	{ name: 'Hero Fincorp', logo: '/assets/images/partners/HERO FINCORPV.png' },
	{ name: 'CreditSea', logo: '/assets/images/partners/CREDIT SEA.png' },
	{ name: 'Poonawalla Fincorp', logo: '/assets/images/partners/Poonawala fincorp.png' },
	{ name: 'Ram Fincorp', logo: '/assets/images/partners/Ram fincorp.png' },
	{ name: 'Creditt+', logo: '/assets/images/partners/creditt.png' },
	{ name: 'True Balance', logo: '/assets/images/partners/truebalance.png' },
	{ name: 'Chintamani Finlease', logo: '/assets/images/partners/chintamani finlease.png' },
	{ name: 'FLot', logo: '/assets/images/partners/Flot.png' },
	{ name: 'TrustPaisa', logo: '/assets/images/partners/Trust Paisa.png' },
	{ name: 'LendingPlate', logo: '/assets/images/partners/lending plate.png' },
	{ name: 'FDPL Finance', logo: '/assets/images/partners/FDPL.png' },
	{ name: 'Salary On Time', logo: '/assets/images/partners/Salary on time.png' },
	{ name: 'Emergency Paisa', logo: '/assets/images/partners/emergency paisa.png' },
	{ name: 'BrightLoans', logo: '/assets/images/partners/Bright loans.png' },
	{ name: 'FatakPay', logo: '/assets/images/partners/FATAK PAY.png' },
];

/**
 * Split partners into rows for the marquee display
 */
export const ROW_1_PARTNERS = PARTNERS.slice(0, 7);
export const ROW_2_PARTNERS = PARTNERS.slice(7, 14);
export const ROW_3_PARTNERS = PARTNERS.slice(14, 21);