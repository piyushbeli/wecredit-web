import { MetadataRoute } from "next";
import { shouldPreventIndexing } from "@/lib/utils/seo-utils";

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
  if (preventIndexing) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: ["/"], // Blocks all routes
        },
      ],
    };
  }
  
  // Production environment - allow indexing with restrictions
  // Original behavior preserved - no changes to production indexing
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  };
}
