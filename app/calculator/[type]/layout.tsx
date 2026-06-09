import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';

type Props = {
  children: React.ReactNode;
  params: Promise<{ type: string }>;
};

/**
 * Layout for calculator routes. Exports per-type metadata because the page
 * component itself is a client component and cannot export metadata directly.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  // Map the URL slug to the canonical path key used in STATIC_PAGE_SEO
  const pathMap: Record<string, string> = {
    'personal-loan': '/calculator/personal-loan/',
    'business-loan': '/calculator/business-loan/',
    emi: '/calculator/emi/',
  };
  const path = pathMap[type];
  return path ? buildPageMetadata(path) : {};
}

const CalculatorLayout = ({ children }: { children: React.ReactNode }) => children;

export default CalculatorLayout;
