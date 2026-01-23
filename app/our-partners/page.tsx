import type { Metadata } from 'next';
import PageHeader from '@/components/shared/page-header';
import PartnerCard from '@/components/shared/partner-card';
import { PERSONAL_LOAN_PARTNERS } from '@/lib/constants/partners-data';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

/**
 * Generates metadata for the Our Partners page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Our Partners | WeCredit',
    description: 'View our trusted personal loan partners. Get detailed information about our partner companies including contact details and grievance officer information.',
    keywords: 'partners, personal loans, lenders, loan partners, WeCredit partners',
  };
}

/**
 * Our Partners page component
 * Displays a list of personal loan partners with expandable details
 */
const OurPartnersPage = (): React.ReactNode => {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header with back button */}
      <PageHeader title="Our Partners" />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-12">
        {/* Section Title */}
        <h2 className="text-base font-normal font-['Poppins'] text-neutral-900 leading-7 mb-2">
          Personal Loans Partners
        </h2>

        {/* Description */}
        <p className="text-xs font-normal font-['Poppins'] text-zinc-500 leading-5 mb-6">
          Tap &apos;More Info&apos; on a partner card to see additional details like grievance officer, email, and website links.
        </p>

        {/* Partner Cards List */}
        <div className="flex flex-col gap-4">
          {PERSONAL_LOAN_PARTNERS.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurPartnersPage;
