/**
 * Shared FAQ data used across all pages
 * These FAQs are consistent throughout the application
 */

export interface FaqItem {
	id: string;
	question: string;
	answer: string;
}

/**
 * Standard FAQ items for personal loans
 * Used across home page, personal loan page, and other relevant pages
 */
export const STANDARD_FAQS: FaqItem[] = [
	{
		id: 'faq-1',
		question: 'What is a personal loan and how does it work?',
		answer:
			'A personal loan is an unsecured loan that can be used for any personal need. The approved amount is repaid in fixed monthly EMIs over a chosen tenure.',
	},
	{
		id: 'faq-2',
		question: 'What credit score is required for a personal loan?',
		answer:
			'Most lenders prefer a credit score of 720 or above, but some of our lenders may consider applications with a CIBIL score of around 700.',
	},
	{
		id: 'faq-3',
		question: 'How much personal loan amount can be availed?',
		answer:
			'The loan amount depends on income, credit profile, existing liabilities, and lender policy. On WeCredit, offers may range from ₹5,000 to ₹15 lakh.',
	},
	{
		id: 'faq-4',
		question: 'How are personal loan interest rates decided?',
		answer:
			'Interest rates are based on factors like credit score, income stability, loan amount, tenure, and the lender\'s internal policy.',
	},
	{
		id: 'faq-5',
		question: 'How long does personal loan approval and disbursal take?',
		answer:
			'Approval timelines vary by lender, but many personal loans are approved within minutes and disbursed shortly after verification.',
	},
	{
		id: 'faq-6',
		question: 'Does applying for a personal loan affect credit score?',
		answer:
			'Yes. Each application may result in a credit enquiry, which can slightly impact the credit score. Comparing offers on a single platform helps reduce multiple enquiries.',
	},
	{
		id: 'faq-7',
		question: 'Can a personal loan be repaid before tenure completion?',
		answer:
			'Yes, most lenders allow prepayment or foreclosure, but charges may apply depending on lender terms and loan duration.',
	},
	{
		id: 'faq-8',
		question: 'What happens if an EMI is missed?',
		answer:
			'Missing an EMI can attract late payment charges and negatively impact the credit score. Repeated delays may affect future loan eligibility.',
	},
];
