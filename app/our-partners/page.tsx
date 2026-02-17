import type { Metadata } from 'next';
import PageHeader from '@/components/shared/page-header';
import PartnerCard from '@/components/shared/partner-card';
import type { PartnerDetail } from '@/lib/constants/partners-data';
import { BackToHomeButton } from '@/components/shared/back-to-home-button';

/** Force static generation with 30-minute revalidation */
export const dynamic = 'force-static';
export const revalidate = 1800; // 30 minutes

const PARTNERS_URL ='https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/our_partner_details_one.json';

/**
 * Generates metadata for the Our Partners page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Our Partners | WeCredit',
    description:
      'View our trusted personal loan partners. Get detailed information about our partner companies including contact details and grievance officer information.',
    keywords:
      'partners, personal loans, lenders, loan partners, WeCredit partners',
  };
}

/**
 * Fetch partner data from S3
 */
async function getPartners(): Promise<PartnerDetail[]> {
  const res = await fetch(PARTNERS_URL, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch partners data');
  }

  const json = await res.json();

  // Extract array safely
  const rawPartners = Array.isArray(json?.data) ? json.data : [];

  // Transform API shape → UI shape
  return rawPartners.map((item: any) => ({
    id: item.partner_name?.toLowerCase().replace(/\s+/g, '-'),
    logo: item.img_url,
    companyName: item.info?.companyName || item.partner_name,
    phone: item.info?.telephone || '',
    officer: item.info?.grievanceRedressalOfficer || '',
    email: item.info?.email || '',
    websiteLink: item.info?.redirectionLink || item.link || '',
  }));
}


/**
 * Our Partners page component
 */
const OurPartnersPage = async (): Promise<React.ReactNode> => {
  const partners = await getPartners();
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <PageHeader title="Our Partners" />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-12">
        {/* Back to Home Button */}
        <BackToHomeButton />
        
        {/* Section Title */}
<h2 className="font-['Poppins'] font-normal text-base leading-7 tracking-normal text-zinc-800">
          Personal Loans Partners
        </h2>

        {/* Description */}
<p className="font-['Poppins'] font-normal text-xs leading-5 tracking-normal text-zinc-500 mb-4 mt-1">
          Tap &apos;More Info&apos; on a partner card to see additional details like grievance officer, email, and website links.
        </p>

        {/* Partner Cards List */}
        <div className="flex flex-col gap-4">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurPartnersPage;
