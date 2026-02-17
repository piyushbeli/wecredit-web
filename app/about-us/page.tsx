import type { Metadata } from 'next';
import { IMAGES } from '@/lib/constants/images';
import PageBanner from '@/components/shared/page-banner';
import AboutUsContent from '@/components/shared/about-us-content';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

/**
 * Generates metadata for the About Us page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About Us - WeCredit',
    description: 'Learn about WeCredit\'s mission to make personal finance easy, convenient, and transparent. Discover our brands and how we help people across India with loans.',
    keywords: 'WeCredit, about us, personal loans, business loans, financial services, loan comparison',
  };
}

/**
 * About Us page component
 * Displays company information, mission, brands, and value propositions
 */
const AboutUsPage = () => {
  return (
    <div className="max-w-4xl mx-auto  pt-18 pb-8 md:pt-28 md:pb-12">
      {/* About Us Content */}
      <AboutUsContent />
    </div>
  );
};

export default AboutUsPage;
