'use client';

/**
 * How to Apply Steps Component
 * Compact vertical timeline showing the loan application process
 */

import { JSX } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HOW_TO_APPLY_STEPS, StepItem } from './constants';
import { ActionButton } from '../shared';
import { IMAGES } from '@/lib/constants/images';
import { useLoanApplicationStore } from '@/stores/loan-application-store';

/** Step icons mapping using SVG images */
const STEP_ICONS = [IMAGES.ICONS.OTP, IMAGES.ICONS.DOCUMENT, IMAGES.ICONS.WALLET];

/** Step row props */
interface StepRowProps {
	step: StepItem;
	index: number;
	isLast: boolean;
}

/**
 * Individual step row with icon and connector
 */
const StepRow = ({ step, index, isLast }: StepRowProps): JSX.Element => {
	const iconSrc = STEP_ICONS[index] || IMAGES.ICONS.DOCUMENT;

	return (
		<motion.div
			className="relative flex items-start gap-4 md:flex-col md:items-center md:gap-5 md:text-center"
			initial={{ opacity: 0, x: -20 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.4, delay: index * 0.1 }}
		>
			{/* Icon Column with Connector */}
			<div className="relative flex flex-col items-center">
				{/* Circular Icon Container */}
				<div className="w-12 h-12 rounded-full bg-blue-700/20 flex items-center justify-center md:h-[74px] md:w-[74px]">
					<Image
						src={iconSrc}
						alt={`Step ${index + 1} icon`}
						width={24}
						height={24}
						className="w-6 h-6 md:h-9 md:w-9"
					/>
				</div>

				{/* Vertical Connector Line */}
				{!isLast && (
					<div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-brand-primary md:hidden" />
				)}
			</div>

			{/* Content Column */}
			<div className="flex-1 pt-1 pb-8 md:w-full md:flex-none md:pb-0 md:pt-0">
				<p className="text-sm font-medium text-brand-primary md:text-lg">{step.title.replace(/\s*:\s*$/, '')}</p>
				<p className="text-sm text-gray-500 leading-5 md:mx-auto md:mt-6 md:max-w-[240px] md:text-sm md:leading-6">{step.description}</p>
			</div>
		</motion.div>
	);
};

/**
 * How to Apply Steps Section
 * Displays the loan application process in a compact vertical timeline
 */
const HowToApplySteps = (): JSX.Element => {
	const { triggerApplyFlow, isApplyLoading } = useLoanApplicationStore();

	return (
		<section className="bg-gray-50 py-6 px-4 max-w-3xl mx-auto md:max-w-none md:bg-white md:px-0 md:py-24">
			<motion.div
				className="max-w-md mx-auto md:max-w-7xl md:px-4 lg:px-8 xl:px-0"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.4 }}
			>
				{/* Section Title */}
				<h2 className="text-base font-medium text-center text-gray-900/80 mb-2 md:text-[34px] md:leading-tight md:text-[#2b2d31]">
					How to Apply for Personal Loan Online?
				</h2>
				<p className="text-sm text-gray-500 mb-6 md:mb-24 md:text-center md:text-xl md:leading-7">
					Get instant personal loan with these easy steps :
				</p>

				{/* Steps Timeline */}
				<div className="mb-6 md:relative md:mx-auto md:mb-14 md:grid md:max-w-4xl md:grid-cols-3 md:gap-12 md:before:absolute md:before:left-[16.666%] md:before:right-[16.666%] md:before:top-[37px] md:before:h-px md:before:bg-brand-primary">
					{HOW_TO_APPLY_STEPS.map((step, index) => (
						<StepRow
							key={step.id}
							step={step}
							index={index}
							isLast={index === HOW_TO_APPLY_STEPS.length - 1}
						/>
					))}
				</div>

				{/* CTA Button */}
				<ActionButton
					className="h-14 w-full cursor-pointer text-lg font-medium bg-[#045CD033] text-brand-primary hover:bg-[#045CD033] md:mx-auto md:flex md:h-14 md:max-w-[420px] md:text-xl"
					fullWidth
					variant="secondary"
					size="lg"
					onClick={triggerApplyFlow}
					isLoading={isApplyLoading}
				>
					Start Loan Application
				</ActionButton>
			</motion.div>
		</section>
	);
};

export default HowToApplySteps;
