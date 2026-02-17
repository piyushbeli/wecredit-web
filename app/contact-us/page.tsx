import type { Metadata } from 'next';
import PageBanner from '@/components/shared/page-banner';
import GrievanceContactContent from '@/components/shared/grievance-contact-content';
import { IMAGES } from '@/lib/constants/images';
import { BackToHomeButton } from '@/components/shared/back-to-home-button';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

/**
 * Generates metadata for the Contact Us page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact Us | WeCredit',
    description: 'Get in touch with WeCredit customer services. Contact our grievance officer for assistance with your queries and complaints.',
    keywords: 'contact us, customer service, support, help',
  };
}

/**
 * Contact Us page component
 * Displays customer service information and grievance officer details
 */
const ContactUsPage = (): React.ReactNode => {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-12">
      {/* Back to Home Button */}
      <BackToHomeButton />
      
      {/* Page Banner with envelope icon */}
      <div className="mb-8 flex justify-center">
        <PageBanner 
          title="CONTACT US" 
          iconImage={IMAGES.ICONS.CONTACT_US}
          iconAlt="Contact Us Icon"
        />
      </div>

      {/* Contact Content */}
      <GrievanceContactContent />
    </div>
  );
};

export default ContactUsPage;

