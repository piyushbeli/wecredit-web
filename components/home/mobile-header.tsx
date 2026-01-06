'use client';

import { JSX, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import type { GlobalLink, StrapiMedia } from '@/types/strapi';

/** Props for MobileHeader component */
interface MobileHeaderProps {
  headerLinks: GlobalLink[];
  logo: StrapiMedia | null;
  siteName: string;
}

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

/**
 * Mobile-first header with transparent background and slide-out menu drawer
 */
const MobileHeader = ({ headerLinks, logo, siteName }: MobileHeaderProps): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt={siteName || 'WeCredit'}
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Hamburger Menu Button */}
          <motion.button
            type="button"
            onClick={toggleMenu}
            className="p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Open menu"
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
      </header>

      {/* Menu Drawer */}
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
                    src="/images/logo.png"
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

              {/* Navigation Links */}
              <nav className="p-4">
                <ul className="space-y-1">
                  {headerLinks.map((link, index) => (
                    <motion.li
                      key={link.id}
                      custom={index}
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
    </>
  );
};

/** Props for MenuLink component */
interface MenuLinkProps {
  link: GlobalLink;
  onNavigate: () => void;
}

/**
 * Individual menu link with optional children expansion
 */
const MenuLink = ({ link, onNavigate }: MenuLinkProps): JSX.Element => {
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

export default MobileHeader;

