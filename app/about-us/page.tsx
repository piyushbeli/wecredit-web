import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStaticPageBySlug } from '@/lib/content';
import StaticPageContent from '@/components/shared/StaticPageContent';
import DebugData from '@/components/shared/DebugData';
import { REVALIDATE } from '@/lib/config/cache';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = REVALIDATE.ABOUT_US;

/**
 * Generates metadata for the About Us page
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPageBySlug('about-us');

  if (!page) {
    return {
      title: 'About Us',
    };
  }

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    keywords: page.seo?.keywords,
  };
}

/**
 * About Us page component
 * Content is loaded from /content/pages/about-us.md
 */
const AboutUsPage = async () => {
  const page = await getStaticPageBySlug('about-us');

  if (!page) {
    notFound();
  }

  return <>
    <DebugData data={page} title="About Us Page" />
    <StaticPageContent page={page} />
  </>;
};

export default AboutUsPage;
