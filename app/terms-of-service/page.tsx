import type { Metadata } from 'next';
import PageBanner from '@/components/shared/page-banner';
import TermsOfServiceContent from '@/components/shared/terms-of-service-content';
import { IMAGES } from '@/lib/constants/images';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

/**
 * Generates metadata for the Terms of Service page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms of Service | WeCredit',
    description: 'Read our terms of service to understand the terms and conditions governing your use of the WeCredit platform.',
    keywords: 'terms of service, terms and conditions, user agreement',
  };
}

/**
 * Terms of Service page component
 * Displays static terms of service content with PageBanner
 */
const TermsOfServicePage = (): React.ReactNode => {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-12">
      {/* Page Banner */}
      <div className="mb-8 flex justify-center">
        <PageBanner 
          title="TERMS OF USE" 
          iconImage={IMAGES.ICONS.TERMS_OF_SERVICE}
        />
      </div>

      {/* Terms of Service Content */}
      <TermsOfServiceContent />
    </div>
  );
};

export default TermsOfServicePage;
