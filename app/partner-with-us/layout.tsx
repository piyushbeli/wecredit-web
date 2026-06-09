import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';

/**
 * Layout for the Partner With Us route.
 * Metadata is defined here because the page component is a client component
 * and cannot export metadata directly.
 */
export const metadata: Metadata = buildPageMetadata('/partner-with-us/');

const PartnerWithUsLayout = ({ children }: { children: React.ReactNode }) => children;

export default PartnerWithUsLayout;
