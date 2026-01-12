import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStaticPageBySlug } from '@/lib/content';
import StaticPageContent from '@/components/shared/StaticPageContent';

/** Force static generation for better performance */
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

/**
 * Generates metadata for the Contact Us page
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPageBySlug('contact-us');
  
  if (!page) {
    return {
      title: 'Contact Us',
    };
  }
  
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    keywords: page.seo?.keywords,
  };
}

/**
 * Contact Us page component
 * Content is loaded from /content/pages/contact-us.md
 */
const ContactUsPage = async () => {
  const page = await getStaticPageBySlug('contact-us');
  
  if (!page) {
    notFound();
  }
  
  return <StaticPageContent page={page} />;
};

export default ContactUsPage;
