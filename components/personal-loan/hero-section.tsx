'use client';

/**
 * Personal Loan Hero Section
 * Gradient background with title, subtitle, and benefit cards
 */

import { JSX } from 'react';
import { ActionButton } from '../shared';
import { useLoanApplicationStore } from '@/stores/loan-application-store';

/**
 * Hero Section for Personal Loan Page
 * Displays gradient background, headline, benefits, and stats
 */
const HeroSection = (): JSX.Element => {
	const { triggerApplyFlow, isApplyLoading } = useLoanApplicationStore();

	return (
		<section className="pt-20 pb-6">
			{/* Main Content */}
			<div className="px-4 pt-6 flex flex-col items-center justify-center">
				{/* Tagline */}
				<p className=" text-sm mb-1 text-center">
					Loans for every Credit Profile
				</p>

				{/* Main Heading */}
				<h1 className="text-2xl font-semibold text-center mb-6">
					Apply <span className="">Personal Loan</span>
					<br />
					<span className="text-brand-primary font-medium">at WeCredit</span>
				</h1>

				<ActionButton
					className="h-14 w-56 text-base font-medium bg-[#045CD033] text-brand-primary hover:bg-[#045CD033]"
					fullWidth
					variant="secondary"
					size="lg"
					onClick={triggerApplyFlow}
					isLoading={isApplyLoading}
				>
					Apply Now
				</ActionButton>

				{/* Subtitle */}
				<p className=" text-sm text-center my-6 max-w-md mx-auto">
					Compare personal loan offers, interest rates, eligibility, and apply in few easy steps.
				</p>
			</div>
		</section>
	);
};

export default HeroSection;
