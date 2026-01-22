import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/constants/images';

interface HeaderLogoProps {
	siteName: string;
	showSolidHeader: boolean;
}

export const HeaderLogo = ({ siteName, showSolidHeader }: HeaderLogoProps) => (
	<Link href="/" className="flex items-center relative">
		{/* Light logo (for transparent header on blue background) */}
		<Image
			src={IMAGES.LOGOS.DEFAULT}
			alt={siteName || 'WeCredit'}
			width={120}
			height={32}
			className={cn(
				'h-8 w-auto transition-opacity duration-300',
				showSolidHeader ? 'opacity-0 absolute' : 'opacity-100'
			)}
			priority
		/>
		{/* Dark logo (for white solid header) */}
		<Image
			src={IMAGES.LOGOS.TRANSPARENT}
			alt={siteName || 'WeCredit'}
			width={120}
			height={32}
			className={cn(
				'h-8 w-auto transition-opacity duration-300',
				showSolidHeader ? 'opacity-100' : 'opacity-0 absolute'
			)}
			priority
		/>
	</Link>
);
