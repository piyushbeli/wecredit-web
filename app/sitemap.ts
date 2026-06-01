import { MetadataRoute } from 'next';
import { SITEMAP_PATHS } from '@/lib/constants/sitemap-routes';
import { shouldPreventIndexing } from '@/lib/utils/seo-utils';

const getBaseUrl = (): string => {
  const base = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL?.replace(/\/$/, '') ?? '';
  return base;
};

/** Builds absolute sitemap URL with trailing slash (matches trailingSlash: true). */
const toSitemapUrl = (baseUrl: string, path: string): string => {
  if (path === '/') return `${baseUrl}/`;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export default function sitemap(): MetadataRoute.Sitemap {
  if (shouldPreventIndexing()) return [];

  const baseUrl = getBaseUrl();
  if (!baseUrl) return [];

  return SITEMAP_PATHS.map((path) => ({
    url: toSitemapUrl(baseUrl, path),
    lastModified: new Date(),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));
}
