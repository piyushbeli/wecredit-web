'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * Our Partners section with Coming Soon placeholder
 * Will display partner logos when available
 */
const PartnersSection = (): React.ReactNode => {
	return (
		<section className="bg-white py-8 sm:py-10 md:py-12 px-4">
			{/* Section Title */}
			<motion.h2
				className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8"
				initial={{ opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.4 }}
			>
				Our Partners
			</motion.h2>

			{/* Coming Soon Placeholder */}
			<motion.div
				className="max-w-md mx-auto"
				initial={{ opacity: 0, scale: 0.95 }}
				whileInView={{ opacity: 1, scale: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-100 p-8 sm:p-10">
					{/* Background decoration */}
					<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
					<div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100/40 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

					{/* Content */}
					<div className="relative flex flex-col items-center text-center">
						<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
							<Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
						</div>
						<h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
							Coming Soon
						</h3>
						<p className="text-sm sm:text-base text-gray-600 max-w-xs">
							We&apos;re partnering with leading financial institutions to bring you the best offers.
						</p>
					</div>
				</div>
			</motion.div>
		</section>
	);
};

export default PartnersSection;

