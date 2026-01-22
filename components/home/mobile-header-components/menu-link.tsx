import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { GlobalLink } from '@/types/strapi';

/** Props for MenuLink component */
interface MenuLinkProps {
    link: GlobalLink;
    onNavigate: () => void;
}

/**
 * Individual menu link with optional children expansion
 */
export const MenuLink = ({ link, onNavigate }: MenuLinkProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = link.children && link.children.length > 0;

    if (hasChildren) {
        return (
            <div>
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex w-full items-center justify-between px-3 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors"
                >
                    <span>{link.label}</span>
                    <motion.svg
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                </button>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 mt-1 space-y-1 overflow-hidden"
                        >
                            {link.children.map((child) => (
                                <li key={child.id}>
                                    <Link
                                        href={child.url}
                                        target={child.openInNewTab ? '_blank' : undefined}
                                        rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                                        className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                        onClick={onNavigate}
                                    >
                                        {child.label}
                                    </Link>
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <Link
            href={link.url}
            target={link.openInNewTab ? '_blank' : undefined}
            rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
            className="block px-3 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors"
            onClick={onNavigate}
        >
            {link.label}
        </Link>
    );
};
