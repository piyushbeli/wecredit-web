import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { linkContactDetails, sanitizeExternalHtml } from '@/lib/seo/sanitize-external-html';
import PrivacyPolicyWrapper from '@/components/shared/privacy-policy-wrapper';

/** Force static generation with 30-minute revalidation */
export const dynamic = 'force-static';
export const revalidate = 1800; // 30 minutes

const PRIVACY_URL =
  'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/wc_privacy_policy.html';

export const metadata: Metadata = buildPageMetadata('/privacy-policy/');

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

  // Strip document-level tags and first <h1> (page renders its own semantic H1)
  return linkContactDetails(sanitizeExternalHtml(html));
}


/**
 * Privacy Policy page component
 */
const PrivacyPolicyPage = async (): Promise<React.ReactNode> => {
  const htmlContent = await getPrivacyContent();

  return (
    <div className="max-w-7xl mx-auto">

      <PrivacyPolicyWrapper htmlContent={htmlContent} />
    </div>
  );
};

export default PrivacyPolicyPage;
