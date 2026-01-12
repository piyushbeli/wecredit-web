import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStaticPageBySlug } from '@/lib/content';
import StaticPageContent from '@/components/shared/StaticPageContent';
import { CACHE_TIMES } from '@/lib/constants/common';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = CACHE_TIMES.HOUR_1; // Revalidate every hour

/**
 * Generates metadata for the Terms of Service page
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPageBySlug('terms-of-service');
  
  if (!page) {
    return {
      title: 'Terms of Service',
    };
  }
  
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    keywords: page.seo?.keywords,
  };
}

/**
 * Terms of Service page component
 * Content is loaded from /content/pages/terms-of-service.md
 */
const TermsOfServicePage = async () => {
  const page = await getStaticPageBySlug('terms-of-service');
  
  if (!page) {
    notFound();
  }
  
  return <StaticPageContent page={page} />;
};

export default TermsOfServicePage;
