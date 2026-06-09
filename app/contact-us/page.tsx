import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import ContactUsWrapper from '@/components/shared/contact-us-wrapper';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

/**
 * Generates metadata for the Contact Us page
 */
export const metadata: Metadata = buildPageMetadata('/contact-us/');

/**
 * Contact Us page component
 * Displays customer service information and grievance officer details
 */
const ContactUsPage = (): React.ReactNode => {
  return (
    <div className="max-w-4xl mx-auto">
      <ContactUsWrapper />
    </div>
  );
};

export default ContactUsPage;
