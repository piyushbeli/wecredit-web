'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/** FAQ item configuration */
interface FaqItem {
	id: string;
	question: string;
	answer: string;
}

/** Static FAQ data */
const faqItems: FaqItem[] = [
	{
		id: 'faq-1',
		question: 'What is a small amount personal loan?',
		answer:
			'Also known as a short-term loan, a small amount personal loan is a type of loan of up to ₹2 lacs that is scheduled to be repaid in a short period. This could be a year or more, but not more than 2 years. A small amount personal loan is generally taken to finance the short-term money requirements.',
	},
	{
		id: 'faq-2',
		question: 'Who should take a short-term loan?',
		answer:
			'Short-term loan can be taken by anyone who wants to meet his/her personal/professional needs. It could be taken by businessmen to meet working capital requirements. Working capital requirements include maintaining a cash flow and financing funds in a case of temporary shortage. In fact, salaried professionals and self-employed individuals too can apply for small amount personal loans to finance for personal needs such as purchasing consumer appliances and electronics such as laptops and smartphones. Even though these are short-term loan examples, anyone who meets the short-term personal loan eligibility can apply for a short-term loan.',
	},
	{
		id: 'faq-3',
		question: 'Benefits of small amount personal loan?',
		answer:
			'A short-term loan is an easy way to meet any shortcomings in funds when in dire need. Apart from being an instant personal loan, there are a lot of other benefits of small amount personal loan. Some of them are:\n• Easy Access to Money\n• Quick Approval\n• Attractive Interest Rates\n• 100% Transparent process\n• Flexible repayment option(s)',
	},
	{
		id: 'faq-4',
		question:
			'What is the difference in short-term loans from registered lending portals vs moneylenders?',
		answer:
			'There are many short-term loan providers varying from banks, NBFCs to private moneylenders\nHere are a few reasons why it is advisable to apply for short-terms loan online via registered portals:\n• Interest rates: The interest rates offered by registered lenders are lower in comparison to private moneylenders. The private moneylenders cost of acquiring funds gets passed on in their loan rates making it expensive.\n• Loan amount: Lending institutions consider your monthly income and repayment capabilities before determining the loan amount. Therefore, the chances of your loan getting approved are higher. However, moneylenders do not run a background check making it possible for you to end up in a debt trap.\n• Credit Score: Borrowing a loan from a registered lending portal also improves your credit score. If you have a high credit Score, you can negotiate on the interest rate on future loans. However, borrowing money from a private moneylender will not be considered in your credit history.\n• Terms And Conditions: There is a lack of formal agreement when you borrow money from a lender. The terms are very unclear and there is no legal binding. The moneylender may ask you to repay the loan before the loan tenure ends or may increase the interest rates. However, a loan taken from a registered lender clearly states the terms and conditions related to the payment tenure, interest rate, and others.',
	},
	{
		id: 'faq-5',
		question: 'What are the eligibility criteria for a small amount personal loan?',
		answer:
			'The following conditions need to be met in order to apply for short-term loans online:\n• The applicant must be at least 25 years old.\n• The applicant must be a citizen of India.\n• The applicant must have a good credit score.\n• The applicant must have a valid Indian bank account\n• The applicant must have a minimum of ₹10000 as monthly income\n• The other conditions for small amount personal loan eligibility vary from lender to lender. It also depends on the amount you wish to get, the loan tenure, and your capacity to repay.',
	},
	{
		id: 'faq-6',
		question: 'What are the documents required for small amount personal loan?',
		answer:
			'The documents required to Apply for a Personal Loan:\n• Proof of Identity (Aadhaar/PAN card/Voter ID/Passport)\n• Proof of Age (Aadhaar/Driving License/Voter ID/Passport)\n• Bank statement for last 6 months\n• Proof of Income (salary slips of last 3 months or last year ITR or income declaration)\n• Passport-sized photograph(s)',
	},
	{
		id: 'faq-7',
		question: 'Why take a short-term personal loan from WeCredit?',
		answer:
			'WeCredit is an online lending portal aiming to improve the financial marketplace by making credit products such as loan easily accessible to applicants. With easy loan application process, WeCredit promises to provide instant approval and fast disbursal to individuals.\nHere are few other reasons to choose WeCredit for short-term loans online:\n• Instant Approval\n• EMI starting from ₹1400\n• Cash within a few days\n• Flexible repayment option\n• Minimum documentation\n• Loan offers for individuals with salary starting ₹10,000\n• Pre-active customer care support\n• WeCredit focusses to make loan process easy and simple for all its customers.',
	},
];

/** Props for FaqAccordionItem component */
interface FaqAccordionItemProps {
	item: FaqItem;
	isExpanded: boolean;
	onToggle: () => void;
	index: number;
}

/**
 * Single FAQ accordion item with expand/collapse animation
 */
const FaqAccordionItem = ({
	item,
	isExpanded,
	onToggle,
	index,
}: FaqAccordionItemProps): React.ReactNode => {
	return (
		<motion.div
			className="border border-gray-200 overflow-hidden bg-[#0000000D]"
			initial={{ opacity: 0, y: 10 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.3, delay: index * 0.05 }}
		>
			<button
				type="button"
				onClick={onToggle}
				className="w-full px-4 sm:px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
				aria-expanded={isExpanded}
			>
				<span className="text-sm sm:text-base pr-4 text-gray-500">
					{item.question}
				</span>
				<ChevronDown
					className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${
						isExpanded ? 'rotate-180' : ''
					}`}
				/>
			</button>
			<AnimatePresence initial={false}>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className="overflow-hidden"
					>
						<div className="px-4 sm:px-5 pb-4 pt-1">
							<p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
								{item.answer}
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

/**
 * Frequently Asked Questions section with accordion
 * Displays common questions about personal loans
 */
const FaqSection = (): React.ReactNode => {
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const handleToggle = (id: string): void => {
		setExpandedId((prev) => (prev === id ? null : id));
	};

	return (
		<section className="bg-white py-4 sm:py-10 md:py-12 px-4">
			{/* Section Title */}
			<motion.h2
				className="text-lg sm:text-xl md:text-2xl font-medium text-center mb-6 sm:mb-8"
				initial={{ opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.4 }}
			>
				Frequently Asked Questions
			</motion.h2>

			{/* FAQ Accordion */}
			<div className="max-w-2xl mx-auto space-y-1">
				{faqItems.map((item, index) => (
					<FaqAccordionItem
						key={item.id}
						item={item}
						isExpanded={expandedId === item.id}
						onToggle={() => handleToggle(item.id)}
						index={index}
					/>
				))}
			</div>
		</section>
	);
};

export default FaqSection;

