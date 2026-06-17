import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import AboutUsContent from '@/components/shared/about-us-content';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

export const metadata: Metadata = buildPageMetadata('/about-us/');

/**
 * About Us page component
 * Displays company information, mission, brands, and value propositions
 */
const AboutUsPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* About Us Content */}
      <AboutUsContent />
    </div>
  );
};

export default AboutUsPage;
