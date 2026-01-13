import { Partner } from "@/types/wecredit";
import Image from "next/image";

/**
 * Partner logo card component
 */
const PartnerCard = ({ partner }: { partner: Partner }): React.ReactNode => {
	return (
		<div className="shrink-0 w-32 h-16 sm:w-36 sm:h-18 md:w-40 md:h-20 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center p-3 mx-2">
			<Image
				src={partner.logo}
				alt={partner.name}
				width={120}
				height={60}
				className="object-contain max-h-full max-w-full"
			/>
		</div>
	);
};

export default PartnerCard;