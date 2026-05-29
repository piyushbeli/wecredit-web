import type { Metadata } from 'next';
import ContactUsWrapper from '@/components/shared/contact-us-wrapper';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

/**
 * Generates metadata for the Contact Us page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact Us | WeCredit',
    description:
      'Get in touch with WeCredit customer services. Contact our grievance officer for assistance with your queries and complaints.',
    keywords: 'contact us, customer service, support, help',
  };
}

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
