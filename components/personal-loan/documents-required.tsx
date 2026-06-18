'use client';

/**
 * Documents Required Component
 * Displays list of documents needed for personal loan application
 * with toggle between Salaried and Self-Employed categories
 */

import { JSX, useState } from 'react';
import Image from 'next/image';
import { SALARIED_DOCUMENTS, SELF_EMPLOYED_DOCUMENTS, DocumentItem } from './constants';
import { IMAGES } from '@/lib/constants/images';
import { ActionButton } from '../shared';
import { useLoanApplicationStore } from '@/stores/loan-application-store';

/** Employment type for document filtering */
type EmploymentType = 'salaried' | 'self-employed';

/** Tab button props */
interface TabButtonProps {
	label: string;
	isActive: boolean;
	onClick: () => void;
}

/**
 * Individual tab button for employment type selection
 */
const TabButton = ({ label, isActive, onClick }: TabButtonProps): JSX.Element => {
	const activeStyles = 'bg-blue-700 text-white';
	const inactiveStyles = 'bg-transparent text-zinc-800';

	return (
		<button
			type="button"
			onClick={onClick}
			className={`w-28 h-8 rounded-md text-xs font-medium leading-5 transition-colors md:h-10 md:w-36 md:text-sm ${isActive ? activeStyles : inactiveStyles
				}`}
		>
			{label}
		</button>
	);
};

/** Document row props */
interface DocumentRowProps {
	document: DocumentItem;
}

/**
 * Individual document item with icon and details
 */
const DocumentRow = ({ document }: DocumentRowProps): JSX.Element => {
	return (
		<div className="flex items-start gap-4 md:gap-3">
			{/* Document Icon */}
			<div className="w-4 h-4 shrink-0 mt-1 md:h-6 md:w-6">
				<Image
					src={IMAGES.ICONS.DOCUMENT}
					alt="Document icon"
					width={14}
					height={14}
					className="w-3.5 h-3.5 md:h-6 md:w-6"
				/>
			</div>

			{/* Document Details */}
			<div className="flex-1">
				<span className="text-zinc-800 text-sm font-medium leading-5 md:text-xl md:font-semibold md:leading-7">
					{document.title}
				</span>
				<br />
				<span className="text-zinc-500 text-xs font-normal leading-5 md:text-xl md:leading-8">
					{document.description}
				</span>
			</div>
		</div>
	);
};

/**
 * Documents Required Section
 * Lists all documents needed for loan application based on employment type
 */
const DocumentsRequired = (): JSX.Element => {
	const [activeTab, setActiveTab] = useState<EmploymentType>('salaried');
	const { triggerApplyFlow, isApplyLoading } = useLoanApplicationStore();

	const documents = activeTab === 'salaried' ? SALARIED_DOCUMENTS : SELF_EMPLOYED_DOCUMENTS;

	const handleTabChange = (tab: EmploymentType): void => {
		setActiveTab(tab);
	};

	return (
		<section className="bg-white py-6 px-4 md:px-0 md:py-24">
			<div
				className="max-w-3xl mx-auto md:grid md:max-w-7xl md:grid-cols-[minmax(360px,0.9fr)_minmax(520px,1.1fr)] md:gap-24 md:px-4 lg:px-8 xl:px-0"
			>
				<div>
					{/* Section Title */}
					<h2 className="text-base font-medium text-center text-black/80 mb-2 md:text-left md:text-[32px] md:font-semibold md:leading-[1.35] md:text-[#303236]">
						Documents Required for
						<br className="hidden md:block" />
						{' '}Personal Loan
					</h2>

					{/* Subtitle */}
					<p className="text-sm text-zinc-500 font-normal leading-5 mb-6 md:mt-10 md:max-w-xl md:text-xl md:leading-8">
						Basically it depends on the lender how they verify the customer, here are some common
						documents required for personal loan application.
					</p>

					<ActionButton
						className="hidden h-14 cursor-pointer max-w-[420px] text-xl font-medium md:mt-28 md:flex"
						fullWidth
						size="lg"
						onClick={triggerApplyFlow}
						isLoading={isApplyLoading}
					>
						Start Loan Application
					</ActionButton>
				</div>

				<div>
					{/* Tab Toggle */}
					<div className="flex justify-center mb-6 md:mb-16 md:justify-center">
						<div className="w-60 h-10  bg-blue-700/20 rounded-lg p-1 flex items-center md:h-auto md:w-auto md:gap-4 md:bg-transparent md:p-0">
							<TabButton
								label="Salaried"
								isActive={activeTab === 'salaried'}
								onClick={() => handleTabChange('salaried')}
							/>
							<TabButton
								label="Self-Employed"
								isActive={activeTab === 'self-employed'}
								onClick={() => handleTabChange('self-employed')}
							/>
						</div>
					</div>

					{/* Document List */}
					<div className="space-y-5 md:space-y-8">
						{documents.map((doc) => (
							<DocumentRow key={doc.id} document={doc} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default DocumentsRequired;
