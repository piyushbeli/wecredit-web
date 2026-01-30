import { FaqSection, PageBanner } from "@/components/shared";
import { IMAGES } from "@/lib/constants/images";

const FaqPage = (): React.ReactNode => {
	return (
		<div className="max-w-4xl mx-auto pt-24 pb-8 md:pt-28 md:pb-12">
			{/* Page Banner */}
			<div className="mb-8 flex justify-center px-4">
				<PageBanner
					title="Frequently Asked Questions "
					iconImage={IMAGES.ICONS.TERMS_OF_SERVICE}
				/>
			</div>

			{/* Terms of Service Content */}
			<FaqSection />
		</div>
	);
};

export default FaqPage;