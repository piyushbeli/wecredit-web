'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Partner data type definition
 */
interface Partner {
	name: string;
	logo: string;
}

/**
 * List of all partner logos
 * Images should be placed in /public/assets/images/partners/
 */
const PARTNERS: Partner[] = [
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
const ROW_1_PARTNERS = PARTNERS.slice(0, 7);
const ROW_2_PARTNERS = PARTNERS.slice(7, 14);
const ROW_3_PARTNERS = PARTNERS.slice(14, 21);

/**
 * Partner logo card component
 */
const PartnerCard = ({ partner }: { partner: Partner }): React.ReactNode => {
	return (
		<div className="shrink-0 w-32 h-16 sm:w-36 sm:h-18 md:w-40 md:h-20 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center p-3 mx-2">
			<Image
				src={partner.logo}
				alt={partner.name}
				width={120}
				height={60}
				className="object-contain max-h-full max-w-full"
			/>
		</div>
	);
};

/**
 * Marquee row component - displays partners in an infinite scroll
 */
const MarqueeRow = ({
	partners,
	isReverse = false,
}: {
	partners: Partner[];
	isReverse?: boolean;
}): React.ReactNode => {
	const animationClass = isReverse ? 'animate-marquee-reverse' : 'animate-marquee';
	return (
		<div className="marquee-container overflow-hidden py-2">
			<div className={`flex ${animationClass}`} style={{ width: 'fit-content' }}>
				{/* First set of logos */}
				{partners.map((partner, index) => (
					<PartnerCard key={`first-${partner.name}-${index}`} partner={partner} />
				))}
				{/* Duplicate set for seamless loop */}
				{partners.map((partner, index) => (
					<PartnerCard key={`second-${partner.name}-${index}`} partner={partner} />
				))}
			</div>
		</div>
	);
};

/**
 * Our Partners section with infinite marquee animation
 * Displays partner logos in 3 rows with horizontal scrolling effect
 */
const PartnersSection = (): React.ReactNode => {
	return (
		<section className="bg-white py-8 sm:py-10 md:py-12 overflow-hidden">
			{/* Container with blue left border accent */}
			<div className="border-l-4 border-blue-500 pl-4 sm:pl-6 md:pl-8">
				{/* Section Title */}
				<h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
					Our Partners
				</h2>

				{/* Marquee Rows */}
				<div className="space-y-2 sm:space-y-3">
					{/* Row 1 - scrolls left */}
					<MarqueeRow partners={ROW_1_PARTNERS} />
					{/* Row 2 - scrolls right (reverse) */}
					<MarqueeRow partners={ROW_2_PARTNERS} isReverse />
					{/* Row 3 - scrolls left */}
					<MarqueeRow partners={ROW_3_PARTNERS} />
				</div>
			</div>
		</section>
	);
};

export default PartnersSection;
