import type { Metadata } from 'next';
import PageBanner from '@/components/shared/page-banner';
import PrivacyPolicyContent from '@/components/shared/privacy-policy-content';
import { IMAGES } from '@/lib/constants/images';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

/**
 * Generates metadata for the Privacy Policy page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy | WeCredit',
    description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
    keywords: 'privacy policy, data protection, security',
  };
}

/**
 * Privacy Policy page component
 * Displays static privacy policy content with PageBanner
 */
const PrivacyPolicyPage = (): React.ReactNode => {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-12">
      {/* Page Banner */}
      <div className="mb-8 flex justify-center">
        <PageBanner 
          title="PRIVACY POLICY" 
          iconImage={IMAGES.ICONS.WECREDIT_HEART}
          iconAlt="WeCredit Heart Icon"
        />
      </div>

      {/* Privacy Policy Content */}
      <PrivacyPolicyContent />
    </div>
  );
};

export default PrivacyPolicyPage;
