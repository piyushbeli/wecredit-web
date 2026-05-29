import type { Metadata } from 'next';
import PrivacyPolicyWrapper from '@/components/shared/privacy-policy-wrapper';

/** Force static generation with 30-minute revalidation */
export const dynamic = 'force-static';
export const revalidate = 1800; // 30 minutes

const PRIVACY_URL =
  'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/wc_privacy_policy.html';

/**
 * Generates metadata for the Privacy Policy page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy | WeCredit',
    description:
      'Read our privacy policy to understand how we collect, use, and protect your personal information.',
    keywords: 'privacy policy, data protection, security',
  };
}

/**
 * Fetch Privacy Policy HTML from S3
 */
async function getPrivacyContent(): Promise<string> {
  const res = await fetch(PRIVACY_URL, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch Privacy Policy content');
  }

  const html = await res.text();

  // Remove first <h1>Privacy Policy</h1> (case-insensitive)
  const cleanedHtml = html.replace(
    /<h1[^>]*>\s*Privacy\s*Policy\s*<\/h1>/i,
    ''
  );

  return cleanedHtml;
}


/**
 * Privacy Policy page component
 */
const PrivacyPolicyPage = async (): Promise<React.ReactNode> => {
  const htmlContent = await getPrivacyContent();

  return (
    <div className="max-w-4xl mx-auto">
      
      <PrivacyPolicyWrapper htmlContent={htmlContent} />
    </div>
  );
};

export default PrivacyPolicyPage;
