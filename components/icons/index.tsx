import Image from "next/image";
import { IMAGES } from "@/lib/constants/images";

// imagePath: IMAGES.ICONS.BUSINESS_LOAN,
export const PercentIcon = (): React.ReactNode => (
    <Image
        src={IMAGES.ICONS.PERCENTAGE}
        alt="Percent"
        width={15}
        height={15}
        className="shrink-0"
    />
)

export const CalendarIcon = (): React.ReactNode => (
    <Image
        src={IMAGES.ICONS.CALENDAR}
        alt="Calendar"
        width={19}
        height={19}
        className="shrink-0"
    />
)
