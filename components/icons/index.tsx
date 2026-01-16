import Image from "next/image";
import { IMAGES } from "@/lib/constants/images";

// imagePath: IMAGES.ICONS.BUSINESS_LOAN,
export const PercentIcon = (): React.ReactNode => (
    <Image
        src={IMAGES.ICONS.PERCENTAGE}
        alt="Percent"
        width={10}
        height={10}
        className="shrink-0"
    />
)

export const CalendarIcon = (): React.ReactNode => (
    <Image
        src={IMAGES.ICONS.CALENDAR}
        alt="Calendar"
        width={10}
        height={10}
        className="shrink-0"
    />
)
