'use client';

/**
 * Sticky Apply Button Component
 * Fixed button at bottom of screen that remains visible during scrolling
 * Triggers the same loan application flow as hero section button
 */

import { JSX, useCallback } from 'react';
import { ActionButton } from '../shared';
import { useLoanApplicationStore } from '@/stores/loan-application-store';

/**
 * Sticky Apply Button for Personal Loan Page
 * Fixed at bottom of viewport, triggers LeadFormModal through loan application store
 * Uses safe area insets to avoid overlapping device UI on mobile
 */
const StickyApplyButton = (): JSX.Element => {
	const { triggerApplyFlow, isApplyLoading } = useLoanApplicationStore();

	/**
	 * Handle button click - triggers the loan application flow
	 * Flow: triggerApplyFlow() → PersonalLoanContent watches triggerApply →
	 * handleOpenModal() → checks auth/dedupe → opens LeadFormModal if needsForm is true
	 */
	const handleApplyClick = useCallback((): void => {
		// Guard against store method being undefined (worst-case scenario)
		if (!triggerApplyFlow) {
			return;
		}

		triggerApplyFlow();
	}, [triggerApplyFlow]);

	return (
		<div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white border-t shadow-lg z-10 ">
			<ActionButton
				type="button"
				onClick={handleApplyClick}
				fullWidth
				isLoading={isApplyLoading}
				className="h-14 text-base font-medium max-w-3xl mx-auto items-center justify-center flex"
			>
				Check Offers
			</ActionButton>
		</div>
	);
};

export default StickyApplyButton;
