import { MetadataRoute } from "next";
import { shouldAllowSitemap, shouldPreventIndexing } from "@/lib/utils/seo-utils";

/**
 * Generates robots.txt file for search engines
 * 
 * This robots.txt applies to ALL pages/routes in the application.
 * 
 * Behavior:
 * - Non-production environments (staging): Returns "Disallow: /" (blocks all crawling)
 * - Production environments: Returns normal rules
 * 
 * Uses environment variable check to determine if indexing should be prevented.
 */
export default function robots(): MetadataRoute.Robots {
  // Check environment to determine if indexing should be prevented
  const preventIndexing = shouldPreventIndexing();
  
  // Prevent indexing on non-production domains
  // This blocks ALL pages from being crawled when on staging or other non-production subdomains
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL?.replace(/\/$/, '') ?? '';
  const sitemapUrls =
    baseUrl && shouldAllowSitemap() ? [`${baseUrl}/sitemap.xml`] : undefined;

  if (preventIndexing) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: ["/"], // Blocks all routes
        },
      ],
      ...(sitemapUrls && { sitemap: sitemapUrls }),
    };
  }
  
  // Production environment - allow indexing with restrictions
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    ...(sitemapUrls && { sitemap: sitemapUrls }),
  };
}
