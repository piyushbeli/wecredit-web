"use client"
import React from 'react';
import { Partner } from '@/types/wecredit';
import { PARTNERS } from '@/lib/constants/common';
import PartnerCard from './partner-card';
import { motion } from 'framer-motion';

/**
 * Grid settings for partners layout.
 */
const PARTNER_GRID_COLUMNS = 5;
const PARTNER_GRID_ROWS = 6;
const PARTNER_GRID_ITEMS = PARTNER_GRID_COLUMNS * PARTNER_GRID_ROWS;
type PartnerGridItem = Partner | null;

/**
 * Our Partners section with a static 5x5 grid.
 */
const PartnersSection = (): React.ReactNode => {
	const gridPartners = PARTNERS.slice(0, PARTNER_GRID_ITEMS);
	const placeholderCount = PARTNER_GRID_ITEMS - gridPartners.length;
	const placeholders = Array.from({ length: Math.max(0, placeholderCount) }, (): PartnerGridItem => null);
	const partnerGridItems = [...gridPartners, ...placeholders];
	return (
		<section className="bg-white py-4 sm:mt-5 md:py-5 overflow-hidden">
			{/* Container with blue left border accent */}
			{/* Section Title */}
			<motion.h2
				className="text-xl font-semibold text-gray-900 text-center mb-8"
				initial={{ opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.4 }}
			>
				Our Partners
			</motion.h2>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-4 lg:px-0">
				<div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4 justify-items-center">
					{partnerGridItems.map((partner, index) => (
						<div key={`partner-grid-${index}`} className="flex justify-center">
							{partner ? (
								<PartnerCard partner={partner} />
							) : (
								<div className="w-14 h-10 sm:w-20 sm:h-12 md:w-28 md:h-16 lg:w-32 lg:h-20" />
							)}
						</div>
					))}
				</div>
			</div>

		</section>
	);
};

export default PartnersSection;
