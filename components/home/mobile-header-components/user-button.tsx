import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

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
	if (isAuthenticated) {
		return (
			<motion.button
				type="button"
				onClick={toggleMenu}
				className={cn(
					'flex items-center gap-1.5 px-3 py-2 rounded-md transition-all duration-300 text-sm font-medium',
					showSolidHeader
						? 'text-wc-blue-600 bg-wc-blue-100 hover:bg-wc-blue-200'
						: 'wc-menu-btn-glass text-white'
				)}
				whileTap={{ scale: 0.95 }}
			>
				<User className="w-4 h-4" />
				<span className="hidden sm:inline max-w-[80px] truncate">
					{user?.name || 'Account'}
				</span>
			</motion.button>
		);
	}

	return (
		<motion.button
			type="button"
			onClick={openAuthModal}
			className={cn(
				'px-4 py-2 rounded-md transition-all duration-300 text-sm font-semibold',
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
