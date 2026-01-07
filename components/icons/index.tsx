import Image from "next/image";

// imagePath: '/assets/svgs/business-loan.svg',
export const PercentIcon = (): React.ReactNode => (
    <Image
        src="/assets/svgs/percentage-icon.svg"
        alt="Percent"
        width={10}
        height={10}
        className="shrink-0"
    />
)

export const CalendarIcon = (): React.ReactNode => (
    <Image
        src="/assets/svgs/calendar-icon.svg"
        alt="Calendar"
        width={10}
        height={10}
        className="shrink-0"
    />
)