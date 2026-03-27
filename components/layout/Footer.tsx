import Link from 'next/link';
import Image from 'next/image';
import { IMAGES } from '@/lib/constants/images';
import { EXTERNAL_LINKS } from '@/lib/constants/links';

/** Footer link item */
interface FooterLinkItem {
  label: string;
  href: string;
}

/** Footer section with title and links */
interface FooterSection {
  title: string;
  links: FooterLinkItem[];
}

/** Social link configuration */
interface SocialLink {
  platform: string;
  href: string;
  icon: React.ReactNode;
}

/** Footer sections organized for mobile-first single-column layout */
const footerSections: FooterSection[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Partner with Us', href: '/partner-with-us' },
      { label: 'Partner Terms & Conditions', href: '/partner-terms-and-conditions' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Use', href: '/terms-of-service' },
      { label: 'Grievance Redressals', href: '/grievance-redressal' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Calculators', href: '/calculator/personal-loan' },
      { label: 'Our Partners', href: '/our-partners' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact-us' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
];

/** Social media icons */
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

/** Social links configuration with blue-700 colored icons */
const socialLinks: SocialLink[] = [
  { platform: 'X', href: EXTERNAL_LINKS.SOCIAL.X, icon: <XIcon className="w-6 h-6" /> },
  { platform: 'LinkedIn', href: EXTERNAL_LINKS.SOCIAL.LINKEDIN, icon: <LinkedInIcon className="w-6 h-6" /> },
  { platform: 'Facebook', href: EXTERNAL_LINKS.SOCIAL.FACEBOOK, icon: <FacebookIcon className="w-6 h-6" /> },
  { platform: 'YouTube', href: EXTERNAL_LINKS.SOCIAL.YOUTUBE, icon: <YouTubeIcon className="w-6 h-6" /> },
  { platform: 'Instagram', href: EXTERNAL_LINKS.SOCIAL.INSTAGRAM, icon: <InstagramIcon className="w-6 h-6" /> },
];

/**
 * Site footer with WeCredit branding, social links, and organized link sections
 * Mobile-first design matching the 393px width layout
 * Includes bottom padding to account for sticky buttons (e.g., Apply Now button)
 * Footer visibility is controlled by ConditionalFooter wrapper component
 */
const Footer = () => {
  return (
    <footer className="bg-white">
  <div className="max-w-7xl mx-auto px-4 pt-8 pb-[100px]">

        {/* Top Section - Logo, Tagline, and Social Links */}
        <div className="mb-10">
          {/* Logo */}
          <Link href="/" className="inline-block mb-4">
            <Image
              src={IMAGES.LOGOS.TRANSPARENT}
              alt="WeCredit"
              width={106}
              height={24}
              className="h-6 w-auto transition-opacity duration-300"
              priority
            />
          </Link>

          {/* Tagline */}
          <p className="text-sm text-zinc-800 font-normal font-['Poppins'] leading-5 mb-6">
            Check your credit score, compare loans, and choose the right lender.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 flex items-center justify-center text-blue-700 transition-colors"
                aria-label={social.platform}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Links - Single Column Mobile Layout */}
        <div className="space-y-6 mb-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium font-['Poppins'] leading-5 text-zinc-800 mb-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-normal font-['Poppins'] leading-5 text-zinc-600 hover:text-zinc-800 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section - Divider and Copyright */}
        <div className="border-t border-stone-300 pt-4">
          {/* Copyright */}
          <p className="text-xs font-normal font-['Poppins'] leading-4 text-zinc-500 text-center">
            © 2026 Quantum X Global Private Limited. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
