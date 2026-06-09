/**
 * Minimal in-page footer for the Instant Personal Loan landing page.
 */

import { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IMAGES } from '@/lib/constants/images';
import { FOOTER_COPYRIGHT, FOOTER_LINKS } from './constants';

const PageFooter = (): JSX.Element => {
  return (
    <footer className="pt-6 px-4 bg-white border-t border-gray-100 space-y-4">
      <div className="max-w-xl mx-auto flex flex-col gap-7">
        <Image
          src={IMAGES.LOGOS.TRANSPARENT}
          alt="WeCredit"
          width={120}
          height={32}
        />

        <nav className="flex items-center gap-4" aria-label="Footer links">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="text-sm  hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-gray-500 leading-5">{FOOTER_COPYRIGHT}</p>
      </div>
    </footer>
  );
};

export default PageFooter;
