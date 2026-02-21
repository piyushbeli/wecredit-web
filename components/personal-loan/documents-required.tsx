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
			className={`w-28 h-8 rounded-md text-xs font-medium font-['Poppins'] leading-5 transition-colors ${
				isActive ? activeStyles : inactiveStyles
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
		<div className="flex items-start gap-4">
			{/* Document Icon */}
			<div className="w-4 h-4 shrink-0 mt-1">
				<Image
					src={IMAGES.ICONS.DOCUMENT}
					alt="Document icon"
					width={14}
					height={14}
					className="w-3.5 h-3.5"
				/>
			</div>

			{/* Document Details */}
			<div className="flex-1">
				<span className="text-zinc-800 text-sm font-medium font-['Poppins'] leading-5">
					{document.title}
				</span>
				<br />
				<span className="text-zinc-500 text-xs font-normal font-['Poppins'] leading-5">
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

	const documents = activeTab === 'salaried' ? SALARIED_DOCUMENTS : SELF_EMPLOYED_DOCUMENTS;

	const handleTabChange = (tab: EmploymentType): void => {
		setActiveTab(tab);
	};

	return (
		<section className="bg-white py-6 px-4">
			<div
				className="max-w-3xl mx-auto"
			>
				{/* Section Title */}
				<h2 className="text-base font-medium text-center text-black/80 font-['Poppins'] mb-2">
					Documents Required for Personal Loan
				</h2>

				{/* Subtitle */}
				<p className="text-sm text-zinc-500 font-normal font-['Poppins'] leading-5 mb-6">
					Basically it depends on the lender how they verify the customer, here are some common
					documents required for personal loan application.
				</p>

				{/* Tab Toggle */}
				<div className="flex justify-center mb-6">
					<div className="w-60 h-10 bg-blue-700/20 rounded-lg p-1 flex items-center">
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
				<div className="space-y-5">
					{documents.map((doc) => (
						<DocumentRow key={doc.id} document={doc} />
					))}
				</div>
			</div>
		</section>
	);
};

export default DocumentsRequired;
