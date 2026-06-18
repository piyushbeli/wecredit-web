import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

import type { User as UserType } from '@/stores/auth-store';

interface UserButtonProps {
	isAuthenticated: boolean;
	user: UserType | null;
	showSolidHeader: boolean;
	toggleMenu: () => void;
	openAuthModal: () => void;
}

export const UserButton = ({
	isAuthenticated,
	user,
	showSolidHeader,
	toggleMenu,
	openAuthModal,
}: UserButtonProps) => {

	const [hydrated, setHydrated] = useState(false);
	useEffect(() => setHydrated(true), []);

	if (!hydrated) {
		return (
			<span
				aria-hidden
				className={cn('inline-block px-4 py-2 rounded-md')}
			/>
		);
	}

	if (isAuthenticated) {
		return (
			<motion.button
				type="button"
				onClick={toggleMenu}
				className={cn(
					'flex cursor-pointer items-center gap-1.5 p-2.5 rounded-md transition-all duration-300 text-sm font-medium',
					showSolidHeader
						? 'text-wc-blue-600 bg-wc-blue-100 hover:bg-wc-blue-200'
						: 'wc-menu-btn-glass text-white'
				)}
				whileTap={{ scale: 0.95 }}
			>
				<User className="w-5 h-5" />

			</motion.button>
		);
	}

	return (
		<motion.button
			type="button"
			onClick={openAuthModal}
			className={cn(
				'px-4 py-2 cursor-pointer rounded-md transition-all duration-300 text-sm font-semibold',
				showSolidHeader
					? 'bg-wc-blue-600 text-white hover:bg-wc-blue-700'
					: 'bg-white text-wc-blue-600 hover:bg-white/90'
			)}
			whileTap={{ scale: 0.95 }}
		>
			Login
		</motion.button>
	);
};
