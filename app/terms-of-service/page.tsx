import type { Metadata } from 'next';
import TermsOfUseWrapper from '@/components/shared/terms-of-use-wrapper';
/** Force static generation with 30-minute revalidation */
export const dynamic = 'force-static';
export const revalidate = 1800; // 30 minutes

const TERMS_URL =
  'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/wc_terms_of_use1.html';

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
 * Fetch Terms HTML from S3
 */
async function getTermsContent(): Promise<string> {
  const res = await fetch(TERMS_URL, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch Terms of Use content');
  }

  const html = await res.text();

  // Remove first <h1>...</h1>
  const cleanedHtml = html.replace(/<h1[^>]*>.*?<\/h1>/i, '');

  return cleanedHtml;
}


/**
 * Terms of Service page component
 */
const TermsOfServicePage = async (): Promise<React.ReactNode> => {
  const htmlContent = await getTermsContent();

  return (
    <div className="max-w-4xl mx-auto">
      <TermsOfUseWrapper htmlContent={htmlContent} />
    </div>
  );
};

export default TermsOfServicePage;
