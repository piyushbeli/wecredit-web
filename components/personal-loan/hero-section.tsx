'use client';

/**
 * Personal Loan Hero Section
 * Gradient background with title, subtitle, and benefit cards
 */

import { JSX, Suspense, useCallback } from 'react';
import { ActionButton, PageHeading } from '../shared';
import { useLoanApplicationStore } from '@/stores/loan-application-store';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { buildOffersPathWithQuery } from '@/lib/utils/offers-navigation';

const HeroHeading = (): JSX.Element => (
	<PageHeading className="text-[26px] font-semibold leading-[1.18] tracking-[-0.02em] text-[#1f232b] md:text-[46px] md:leading-[1.08] lg:text-[52px]">
		Apply Personal Loan
		<br />
		<span className="text-brand-primary">at WeCredit</span>
	</PageHeading>
);

/**
 * Hero Section for Personal Loan Page
 * Displays gradient background, headline, benefits, and stats
 */
const HeroSectionInner = (): JSX.Element => {
	const { triggerApplyFlow, isApplyLoading } = useLoanApplicationStore();
	const { isAuthenticated, openModalWithPendingAction } = useAuthStore();
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleCompareOffers = useCallback((): void => {
		const offersHref = buildOffersPathWithQuery('/offers', searchParams);
		if (isAuthenticated) {
			router.push(offersHref);
			return;
		}
		openModalWithPendingAction({
			type: 'navigate_to_offer',
			href: offersHref,
		});
	}, [isAuthenticated, openModalWithPendingAction, router, searchParams]);

	return (
		<section className="overflow-hidden bg-white pt-24 pb-7 md:pt-28 md:pb-24 lg:pt-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-0">
				<div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
					<div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
						<HeroHeading />

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

					{/* Compare Offers banner (added without changing existing hero content). */}
					<div className="relative w-full">
						<div className="relative w-full aspect-[1024/661] overflow-hidden">
							<Image
								src="/assets/images/compare-personal-loan-banner.png"
								alt="Compare Personal Loan from 25+ lenders"
								fill
								priority
								className="object-contain"
							/>
							<button
								type="button"
								onClick={handleCompareOffers}
								aria-label="Compare Offers"
								className="absolute left-[8.8%] top-[52.9%] h-[6.2%] w-[19.2%] cursor-pointer bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

const heroFallback = (
	<section className="overflow-hidden bg-white pt-24 pb-7 md:pt-28 md:pb-24 lg:pt-32">
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-0">
			<div className="mx-auto max-w-6xl text-center lg:text-left">
				<HeroHeading />
			</div>
		</div>
	</section>
);

const HeroSection = (): JSX.Element => (
	<Suspense fallback={heroFallback}>
		<HeroSectionInner />
	</Suspense>
);

export default HeroSection;
