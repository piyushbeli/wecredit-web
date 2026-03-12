/**
 * Local Static Pages Content Management
 * Functions to read and parse markdown files from /content/pages/
 * 
 * Static pages are stored as markdown files with frontmatter metadata.
 * The filename (without .md extension) determines the URL slug.
 * 
 * Example: /content/pages/about-us.md → accessible at /about-us
 * 
 * Frontmatter structure:
 * ---
 * title: "Page Title"
 * slug: "page-slug" (should match filename)
 * seo:
 *   metaTitle: "SEO Title"
 *   metaDescription: "SEO Description"
 *   keywords: "keywords"
 * ---
 */

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import type { StaticPage } from '@/lib/strapi/types';

/** Directory containing static page markdown files */
const CONTENT_DIRECTORY = join(process.cwd(), 'content', 'pages');

/** Frontmatter structure for static pages */
interface StaticPageFrontmatter {
  title: string;
  slug: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    canonicalUrl?: string;
  };
}

/** Cache for parsed static pages (in-memory during runtime) */
const staticPagesCache = new Map<string, StaticPage>();

/**
 * Parses a markdown file and returns a StaticPage object
 * Validates that the frontmatter slug matches the filename
 */
function parseMarkdownFile(fileContent: string, slug: string): StaticPage {
  const { data, content } = matter(fileContent);
  const frontmatter = data as StaticPageFrontmatter;
  
  // Validate that frontmatter slug matches filename
  if (frontmatter.slug && frontmatter.slug !== slug) {
    console.warn(
      `Warning: Frontmatter slug "${frontmatter.slug}" does not match filename "${slug}.md". ` +
      `Using filename as slug.`
    );
  }
  
  return {
    id: 0, // Local pages don't have database IDs
    documentId: slug,
    type: 'static-page',
    title: frontmatter.title,
    slug: slug, // Always use filename as slug for consistency
    content: content.trim(),
    seo: frontmatter.seo && frontmatter.seo.metaTitle && frontmatter.seo.metaDescription ? {
      metaTitle: frontmatter.seo.metaTitle,
      metaDescription: frontmatter.seo.metaDescription,
      keywords: frontmatter.seo.keywords,
      canonicalUrl: frontmatter.seo.canonicalUrl,
    } : undefined,
  };
}

/**
 * Fetches a static page by slug from local markdown files
 */
export async function getStaticPageBySlug(slug: string): Promise<StaticPage | null> {
  try {
    // Check cache first
    if (staticPagesCache.has(slug)) {
      return staticPagesCache.get(slug)!;
    }
    
    // Read markdown file
    const filePath = join(CONTENT_DIRECTORY, `${slug}.md`);
    const fileContent = await readFile(filePath, 'utf-8');
    
    // Parse and cache
    const page = parseMarkdownFile(fileContent, slug);
    staticPagesCache.set(slug, page);
    
    return page;
  } catch (error) {
    // File not found or parsing error
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    return null;
  }
}

/**
 * Fetches all static pages from local markdown files
 */
export async function getAllStaticPages(): Promise<StaticPage[]> {
  try {
    const files = await readdir(CONTENT_DIRECTORY);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const pages = await Promise.all(
      markdownFiles.map(async (file) => {
        const slug = file.replace(/\.md$/, '');
        const filePath = join(CONTENT_DIRECTORY, file);
        const fileContent = await readFile(filePath, 'utf-8');
        return parseMarkdownFile(fileContent, slug);
      })
    );
    
    return pages;
  } catch (error) {
    return [];
  }
}

/**
 * Clears the static pages cache
 * Useful for development or when content changes
 */
export function clearStaticPagesCache(): void {
  staticPagesCache.clear();
}

/**
 * Gets all available static page slugs
 */
export async function getStaticPageSlugs(): Promise<string[]> {
  try {
    const files = await readdir(CONTENT_DIRECTORY);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
  } catch (error) {
    return [];
  }
}
