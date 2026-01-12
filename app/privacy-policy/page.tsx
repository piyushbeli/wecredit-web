import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStaticPageBySlug } from '@/lib/content';
import StaticPageContent from '@/components/shared/StaticPageContent';
import { CACHE_TIMES } from '@/lib/constants/common';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = CACHE_TIMES.HOUR_1; // Revalidate every hour

/**
 * Generates metadata for the Privacy Policy page
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPageBySlug('privacy-policy');
  
  if (!page) {
    return {
      title: 'Privacy Policy',
    };
  }
  
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    keywords: page.seo?.keywords,
  };
}

/**
 * Privacy Policy page component
 * Content is loaded from /content/pages/privacy-policy.md
 */
const PrivacyPolicyPage = async () => {
  const page = await getStaticPageBySlug('privacy-policy');
  
  if (!page) {
    notFound();
  }
  
  return <StaticPageContent page={page} />;
};

export default PrivacyPolicyPage;
