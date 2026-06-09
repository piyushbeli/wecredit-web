import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import GrievanceRedressalWrapper from '@/components/shared/grievance-redressal-wrapper';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

export const metadata: Metadata = buildPageMetadata('/grievance-redressal/');

/**
 * Grievance Redressal page component
 * Displays customer service information and grievance officer details
 */
const GrievanceRedressalPage = (): React.ReactNode => {
  return (
    <div className="max-w-4xl mx-auto">
      <GrievanceRedressalWrapper />
    </div>
  );
};

export default GrievanceRedressalPage;
