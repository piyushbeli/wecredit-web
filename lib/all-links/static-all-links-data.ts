/**
 * Static data for /all-links (no Strapi).
 * Marketing routes from sitemap constants; blog routes from Google Sheet.
 */

import { SITEMAP_PATHS } from '@/lib/constants/sitemap-routes';
import { fetchBlogRoutesFromSheet } from '@/lib/sitemap/fetch-blog-routes-from-sheet';
import type { Footer, Header, Page } from '@/types/strapi';

const STATIC_TIMESTAMP = '2026-01-01T00:00:00.000Z';

/** Default header for all-links overview (matches legacy Strapi fallbacks) */
export const STATIC_ALL_LINKS_HEADER: Header = {
  navigation: [
    { id: 1, order: 1, label: 'Home', url: '/', openInNewTab: false, children: [] },
    { id: 2, order: 2, label: 'About Us', url: '/about-us/', openInNewTab: false, children: [] },
    { id: 3, order: 3, label: 'Credit Cards', url: '/credit-cards/', openInNewTab: false, children: [] },
    { id: 4, order: 4, label: 'Personal Loan', url: '/personal-loan/', openInNewTab: false, children: [] },
    { id: 5, order: 5, label: 'FAQ', url: '/faq/', openInNewTab: false, children: [] },
  ],
  ctaButton: {
    label: 'Apply Now',
    url: '/offers/',
  },
};

/** Default footer for all-links overview */
export const STATIC_ALL_LINKS_FOOTER: Footer = {
  columns: [],
  copyright: `© ${new Date().getFullYear()} WeCredit. All rights reserved.`,
  socialLinks: [],
};

/**
 * Derives a display title from a URL path segment.
 */
function pathToTitle(fullPath: string): string {
  if (fullPath === '/') return 'Home';
  const segment = fullPath.replace(/^\/|\/$/g, '').split('/').pop() ?? '';
  if (!segment) return fullPath;
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function normalizeFullPath(path: string): string {
  if (path === '/') return '/';
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

/**
 * Builds a minimal Page shape for the all-links UI from a path string.
 */
function buildStaticPage(fullPath: string, index: number): Page {
  const normalized = normalizeFullPath(fullPath);
  const slug = normalized.replace(/^\/|\/$/g, '') || 'home';

  return {
    id: index,
    documentId: `static-all-links-${index}`,
    title: pathToTitle(normalized),
    slug,
    fullPath: normalized,
    createdAt: STATIC_TIMESTAMP,
    updatedAt: STATIC_TIMESTAMP,
    publishedAt: STATIC_TIMESTAMP,
    children: [],
    sidebar: [],
  };
}

/**
 * Marketing + blog paths as static Page list (no Strapi).
 */
export async function getStaticAllLinksPages(): Promise<Page[]> {
  const marketingPages = SITEMAP_PATHS.map((path, index) => buildStaticPage(path, index));

  const blogRoutes = await fetchBlogRoutesFromSheet();
  const blogStartIndex = marketingPages.length;
  const blogPages = blogRoutes.map((route, index) =>
    buildStaticPage(route.source, blogStartIndex + index)
  );

  return [...marketingPages, ...blogPages];
}

export async function getAllLinksPageData(): Promise<{
  pages: Page[];
  header: Header;
  footer: Footer;
}> {
  const pages = await getStaticAllLinksPages();
  return {
    pages,
    header: STATIC_ALL_LINKS_HEADER,
    footer: STATIC_ALL_LINKS_FOOTER,
  };
}
