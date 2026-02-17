import type { Metadata } from 'next';
import PageBanner from '@/components/shared/page-banner';
import GrievanceContactContent from '@/components/shared/grievance-contact-content';
import { IMAGES } from '@/lib/constants/images';
import { BackToHomeButton } from '@/components/shared/back-to-home-button';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

/**
 * Generates metadata for the Grievance Redressal page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Grievance Redressal | WeCredit',
    description: 'Contact our grievance officer to resolve your complaints and grievances. We are committed to resolving issues within a reasonable time frame.',
    keywords: 'grievance redressal, customer service, complaints, contact',
  };
}

/**
 * Grievance Redressal page component
 * Displays customer service information and grievance officer details
 */
const GrievanceRedressalPage = (): React.ReactNode => {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-12">
      {/* Back to Home Button */}
      <BackToHomeButton />
      
      {/* Page Banner with shield+heart icon (default) */}
      <div className="mb-8 flex justify-center">
        <PageBanner title="GRIEVANCE REDRESSAL"  iconImage={IMAGES.ICONS.WECREDIT_HEART} />
      </div>

      {/* Grievance Content */}
      <GrievanceContactContent />
    </div>
  );
};

export default GrievanceRedressalPage;
