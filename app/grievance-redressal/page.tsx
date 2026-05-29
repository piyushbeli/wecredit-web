import type { Metadata } from 'next';
import GrievanceRedressalWrapper from '@/components/shared/grievance-redressal-wrapper';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

/**
 * Generates metadata for the Grievance Redressal page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Grievance Redressal | WeCredit',
    description:
      'Contact our grievance officer to resolve your complaints and grievances. We are committed to resolving issues within a reasonable time frame.',
    keywords: 'grievance redressal, customer service, complaints, contact',
  };
}

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
