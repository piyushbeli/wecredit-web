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
		<section className="overflow-hidden bg-white pt-24 pb-7 md:pt-28 md:pb-24 lg:pt-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-0">
				<div className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
					<h1 className="text-[26px] font-semibold leading-[1.18] tracking-[-0.02em] text-[#1f232b] md:text-[46px] md:leading-[1.08] lg:text-[52px]">
						Apply Personal Loan
						<br />
						<span className="text-brand-primary">at WeCredit</span>
					</h1>

					<p className="mt-3 max-w-2xl text-base leading-6 text-[#777] md:mt-5 md:text-2xl md:leading-9">
						Compare personal loan offers, interest rates,
						<br className="hidden md:block" />
						eligibility, and apply in few easy steps.
					</p>

					<div className="mt-7 flex w-full max-w-[260px] flex-col gap-3 md:mt-7 md:max-w-[520px] md:flex-row">
						<ActionButton
							className="h-[52px] cursor-pointer rounded-lg bg-[#045CD033] text-xl font-semibold text-brand-primary shadow-none hover:bg-[#045CD033] md:h-12 md:flex-1 md:bg-brand-primary md:text-xl md:text-white! md:hover:bg-brand-primary/90"
							fullWidth
							variant="secondary"
							size="lg"
							onClick={triggerApplyFlow}
							isLoading={isApplyLoading}
						>
							Apply Now
						</ActionButton>
						<ActionButton
							className="hidden h-12 cursor-pointer flex-1 rounded-lg border border-brand-primary bg-[#045CD033] text-xl font-medium text-brand-primary shadow-none hover:bg-[#045CD033] md:inline-flex"
							variant="outline"
							size="lg"
							onClick={triggerApplyFlow}
							isLoading={isApplyLoading}
						>
							Check Eligibility
						</ActionButton>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
