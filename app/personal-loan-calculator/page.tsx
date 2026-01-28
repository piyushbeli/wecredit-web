import EmailCalculator from "@/components/personal-loan/emi-calculator";

/**
 * Privacy Policy page component
 * Displays static privacy policy content with PageBanner
 */
const PersonalLoanCalculatorPage = (): React.ReactNode => {
	return (
		<div className="max-w-4xl mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-12">
			<EmailCalculator />
		</div>
	);
};

export default PersonalLoanCalculatorPage;