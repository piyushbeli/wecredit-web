import { Partner } from "@/types/wecredit";
import Image from "next/image";

/**
 * Partner logo card component
 */
const PartnerCard = ({ partner }: { partner: Partner }): React.ReactNode => {
	return (
		<div className="shrink-0 w-full h-10 sm:h-20  bg-[#00000005]  rounded-lg flex items-center justify-center p-2 sm:p-3">
			<Image
				src={partner.logo}
				alt={partner.name}
				width={520}
				height={260}
				unoptimized
				className="object-contain max-h-full max-w-full"
			/>
		</div>
	);
};

export default PartnerCard;