import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, User, LogOut } from 'lucide-react';
import type { GlobalLink } from '@/types/strapi';
import type { User as UserType } from '@/stores/auth-store';
import { IMAGES } from '@/lib/constants/images';
import { MenuLink } from './menu-link';

/** Menu item animation variants */
const menuItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.3,
            ease: 'easeOut',
        },
    }),
    exit: { opacity: 0, x: -20 },
};

/** Drawer animation variants */
const drawerVariants: Variants = {
    hidden: { x: '-100%' },
    visible: {
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        },
    },
    exit: {
        x: '-100%',
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        },
    },
};

interface MobileMenuDrawerProps {
    isMenuOpen: boolean;
    closeMenu: () => void;
    siteName: string;
    isAuthenticated: boolean;
    user: UserType | null;
    logout: () => void;
    openAuthModal: () => void;
    headerLinks: GlobalLink[];
}

export const MobileMenuDrawer = ({
    isMenuOpen,
    closeMenu,
    siteName,
    isAuthenticated,
    user,
    logout,
    openAuthModal,
    headerLinks,
}: MobileMenuDrawerProps) => {
    return (
        <AnimatePresence>
            {isMenuOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 wc-menu-overlay"
                        onClick={closeMenu}
                    />

                    {/* Drawer */}
                    <motion.div
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-0 left-0 bottom-0 w-[280px] z-50 bg-wc-dark shadow-2xl"
                    >
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <Link href="/" onClick={closeMenu} className="flex items-center">
                                <Image
                                    src={IMAGES.LOGOS.DEFAULT}
                                    alt={siteName || 'WeCredit'}
                                    width={100}
                                    height={28}
                                    className="h-7 w-auto"
                                />
                            </Link>
                            <motion.button
                                type="button"
                                onClick={closeMenu}
                                className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                aria-label="Close menu"
                                whileTap={{ scale: 0.95 }}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* User Section */}
                        <div className="p-4 border-b border-white/10">
                            {isAuthenticated ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-wc-blue-500 flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            
                                            <p className="text-white/60 text-sm">
                                                +91 {user?.phoneNumber}
                                            </p>
                                        </div>
                                    </div>
                                    <motion.button
                                        type="button"
                                        onClick={() => {
                                            logout();
                                            closeMenu();
                                        }}
                                        className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                        aria-label="Logout"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            ) : (
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        openAuthModal();
                                        closeMenu();
                                    }}
                                    className="w-full py-3 bg-wc-blue-500 text-white rounded-lg font-semibold hover:bg-wc-blue-600 transition-colors"
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Login / Sign Up
                                </motion.button>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <nav className="p-4">
                            <ul className="space-y-1">
                                {isAuthenticated && (
                                    <motion.li
                                        custom={0}
                                        variants={menuItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <Link
                                            href="/offers/status"
                                            onClick={closeMenu}
                                            className="flex items-center gap-3 px-3 py-3 text-white rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <span className="font-medium">Loan Status</span>
                                        </Link>
                                    </motion.li>
                                )}
                                {headerLinks.map((link, index) => (
                                    <motion.li
                                        key={link.id}
                                        custom={isAuthenticated ? index + 1 : index}
                                        variants={menuItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <MenuLink link={link} onNavigate={closeMenu} />
                                    </motion.li>
                                ))}
                            </ul>
                        </nav>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
