/**
 * Blogs API Functions
 *
 * Blog URLs are sourced from Google Sheets for sitemap and static route listings.
 */

import { fetchBlogRoutesFromSheet } from '@/lib/sitemap/fetch-blog-routes-from-sheet';

/** @deprecated Use BlogRouteMapping from fetch-blog-routes-from-sheet */
export interface SitemapBlogEntry {
  fullPath: string;
  updatedAt: string;
}

/**
 * Returns blog source paths from the Google Sheet (for static generation, etc.).
 */
export async function getAllBlogPaths(): Promise<string[]> {
  const routes = await fetchBlogRoutesFromSheet();
  return routes.map((route) => route.source);
}
