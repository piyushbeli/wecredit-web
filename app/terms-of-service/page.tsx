import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { sanitizeExternalHtml } from '@/lib/seo/sanitize-external-html';
import TermsOfUseWrapper from '@/components/shared/terms-of-use-wrapper';
/** Force static generation with 30-minute revalidation */
export const dynamic = 'force-static';
export const revalidate = 1800; // 30 minutes

const TERMS_URL =
  'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/wc_terms_of_use1.html';

export const metadata: Metadata = buildPageMetadata('/terms-of-service/');

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

  // Strip document-level tags and first <h1> (page renders its own semantic H1)
  return sanitizeExternalHtml(html);
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
