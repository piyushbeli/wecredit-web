/**
 * Strapi API Query Functions
 * Functions to fetch and normalize data from Strapi CMS
 * Note: Static pages are now managed locally via /content/pages/
 */

import { fetchStrapi, getStrapiMediaUrl } from './client';
import { getStaticPageBySlug as getLocalStaticPageBySlug } from '@/lib/content';
import type {
  StrapiResponse,
  StrapiBlogPost,
  StrapiStaticPage,
  StrapiHeader,
  StrapiFooter,
  BlogPost,
  StaticPage,
  PageData,
  Header,
  Footer,
  StrapiPage,
  Page,
  StrapiGlobal,
  GlobalData,
} from './types';

/**
 * Fetches all published blog posts from Strapi
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await fetchStrapi<StrapiResponse<StrapiBlogPost[]>>(
    '/blog-posts',
    {
      params: {
        'populate': '*',
        'sort': 'publishedAt:desc',
      },
    }
  );
  return response.data.map(normalizeBlogPost);
}

/**
 * Fetches a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const response = await fetchStrapi<StrapiResponse<StrapiBlogPost[]>>(
    '/blog-posts',
    {
      params: {
        'filters[slug][$eq]': slug,
        'populate': '*',
      },
    }
  );
  if (!response.data || response.data.length === 0) {
    return null;
  }
  return normalizeBlogPost(response.data[0]);
}

/**
 * Fetches all static pages from local markdown files
 * @deprecated Static pages are now managed locally. Use getAllStaticPages from @/lib/content instead.
 */
export async function getStaticPages(): Promise<StaticPage[]> {
  // This function is deprecated - static pages are now local
  // If needed, import getAllStaticPages from @/lib/content
  console.warn('getStaticPages is deprecated. Static pages are now managed locally.');
  return [];
}

/**
 * Fetches a single static page by slug from local markdown files
 * Static pages are now stored locally in /content/pages/
 */
export async function getStaticPageBySlug(slug: string): Promise<StaticPage | null> {
  // Read from local markdown files instead of Strapi API
  return getLocalStaticPageBySlug(slug);
}

/**
 * Fetches page data by slug (tries blog post first, then static page)
 * @deprecated Use getBlogPostBySlug directly. Static pages now have dedicated routes.
 */
export async function getPageDataBySlug(slug: string): Promise<PageData | null> {
  // Try blog post first
  const blogPost = await getBlogPostBySlug(slug);
  if (blogPost) {
    return blogPost;
  }
  
  // Try static page (from local markdown files)
  const staticPage = await getStaticPageBySlug(slug);
  if (staticPage) {
    return staticPage;
  }
  
  return null;
}

/**
 * Fetches header data from Strapi single type
 */
export async function getHeader(): Promise<Header> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiHeader>>(
      '/header',
      {
        params: {
          'populate': '*',
        },
      }
    );
    return normalizeHeader(response.data);
  } catch {
    return getDefaultHeader();
  }
}

/**
 * Fetches footer data from Strapi single type
 */
export async function getFooter(): Promise<Footer> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiFooter>>(
      '/footer',
      {
        params: {
          'populate[columns][populate]': '*',
          'populate[socialLinks][populate]': '*',
          'populate[logo][populate]': '*',
        },
      }
    );
    return normalizeFooter(response.data);
  } catch {
    return getDefaultFooter();
  }
}

/**
 * Fetches global site data from Strapi single type
 * Includes header links, footer links, social links, logo, and favicon
 */
export async function getGlobal(): Promise<GlobalData> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiGlobal>>(
      '/global',
      {
        params: {
          'populate[headerLinks][populate]': 'children',
          'populate[footerLinks][populate]': 'children',
          'populate[socialLinks]': '*',
          'populate[logo][populate]': '*',
          'populate[favicon][populate]': '*',
        },
      }
    );
    const data = response.data;
    return {
      id: data.id,
      documentId: data.documentId,
      siteName: data.siteName,
      copyrightText: data.copyrightText,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      headerLinks: data.headerLinks || [],
      footerLinks: data.footerLinks || [],
      socialLinks: data.socialLinks,
      logo: data.logo,
      favicon: data.favicon,
    };
  } catch {
    return getDefaultGlobal();
  }
}

/**
 * Returns default global data when Strapi is unavailable
 */
function getDefaultGlobal(): GlobalData {
  return {
    id: 0,
    documentId: '',
    siteName: 'WeCredit',
    copyrightText: `© ${new Date().getFullYear()} WeCredit. All rights reserved.`,
    contactEmail: '',
    contactPhone: '',
    headerLinks: [
      { id: 1, order: 1, label: 'Home', url: '/', openInNewTab: false, children: [] },
      { id: 2, order: 2, label: 'About Us', url: '/about-us', openInNewTab: false, children: [] },
      { id: 3, order: 3, label: 'Credit Cards', url: '/credit-cards', openInNewTab: false, children: [] },
    ],
    footerLinks: [],
    socialLinks: null,
    logo: null,
    favicon: null,
  };
}

/**
 * Normalizes blog post data from Strapi v5 format
 */
function normalizeBlogPost(data: StrapiBlogPost): BlogPost {
  return {
    id: data.id,
    documentId: data.documentId,
    type: 'blog-post',
    title: data.title,
    slug: data.slug,
    content: data.contentMarkdown || '',
    description: data.description || undefined,
    featuredImage: data.featuredImage ? {
      url: getStrapiMediaUrl(data.featuredImage.url),
      alt: data.featuredImage.alternativeText || data.title,
      width: data.featuredImage.width,
      height: data.featuredImage.height,
    } : undefined,
    category: data.blogGuideCategory ? {
      name: data.blogGuideCategory.name,
      slug: data.blogGuideCategory.slug,
    } : undefined,
    seo: data.seo,
    publishedAt: data.publishedAt,
  };
}

/**
 * Normalizes header data from Strapi v5 format
 */
function normalizeHeader(data: StrapiHeader): Header {
  return {
    logo: data.logo ? {
      url: getStrapiMediaUrl(data.logo.url),
      alt: data.logo.alternativeText || 'Logo',
    } : undefined,
    navigation: (data.navigation || []).map((link, index) => ({
      id: link.id,
      order: index + 1,
      label: link.label,
      url: link.url,
      openInNewTab: link.isExternal,
      children: [],
    })),
    ctaButton: data.ctaButton,
  };
}

/**
 * Normalizes footer data from Strapi v5 format
 */
function normalizeFooter(data: StrapiFooter): Footer {
  return {
    logo: data.logo ? {
      url: getStrapiMediaUrl(data.logo.url),
      alt: data.logo.alternativeText || 'Logo',
    } : undefined,
    columns: data.columns || [],
    copyright: data.copyright || '',
    socialLinks: data.socialLinks || [],
  };
}

/**
 * Returns default header when Strapi is unavailable
 */
function getDefaultHeader(): Header {
  return {
    navigation: [
      { id: 1, order: 1, label: 'Home', url: '/', openInNewTab: false, children: [] },
      { id: 2, order: 2, label: 'About Us', url: '/about-us', openInNewTab: false, children: [] },
    ],
    ctaButton: {
      label: 'Apply Now',
      url: '/apply',
    },
  };
}

/**
 * Returns default footer when Strapi is unavailable
 */
function getDefaultFooter(): Footer {
  return {
    columns: [],
    copyright: `© ${new Date().getFullYear()} WeCredit. All rights reserved.`,
    socialLinks: [],
  };
}

/**
 * Fetches all pages from Strapi
 */
export async function getAllPages(): Promise<Page[]> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPage[]>>(
      '/pages',
      {
        params: {
          'populate[sidebar][populate]': '*',
          'populate[children][populate]': '*',
          'populate[parent][populate]': '*',
          'populate[featuredImage][populate]': '*',
          'sort': 'order:asc',
        },
      }
    );
    return response.data.map(normalizePage);
  } catch (error) {
    if (error instanceof Error) {
      console.warn('Failed to fetch pages from Strapi:', error.message);
      console.warn('Make sure the pages collection has proper permissions in Strapi');
    }
    return [];
  }
}

/**
 * Fetches a single page by slug from Strapi
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiPage[]>>(
      '/pages',
      {
        params: {
          'filters[slug][$eq]': slug,
          'populate[sidebar][populate]': '*',
          'populate[children][populate]': '*',
          'populate[parent][populate]': '*',
          'populate[featuredImage][populate]': '*',
        },
      }
    );
    
    if (!response.data || response.data.length === 0) {
      return null;
    }
    
    return normalizePage(response.data[0]);
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`Failed to fetch page with slug "${slug}" from Strapi:`, error.message);
      if (error.message.includes('Forbidden')) {
        console.warn('⚠️  The pages collection requires authentication or proper permissions.');
        console.warn('📝 To fix this:');
        console.warn('   1. Set STRAPI_API_TOKEN in your .env.local file');
        console.warn('   2. OR make the pages collection publicly accessible in Strapi');
        console.warn('   3. Go to Settings > Roles > Public > Permissions > Pages');
        console.warn('   4. Enable "find" and "findOne" permissions');
      }
    }
    return null;
  }
}

/**
 * Builds the full path for a page by traversing parent chain
 */
export function buildPagePath(page: StrapiPage): string {
  const buildPath = (p: StrapiPage, segments: string[] = []): string[] => {
    segments.unshift(p.slug || '');
    if (p.parent && p.parent.slug !== 'home') {
      return buildPath(p.parent, segments);
    }
    return segments;
  };
  
  const segments = buildPath(page);
  return segments.join('/');
}

/**
 * Normalizes page data from Strapi v5 format
 */
function normalizePage(data: StrapiPage): Page {
  const fullPath = buildPagePath(data);
  
  return {
    id: data.id,
    documentId: data.documentId,
    type: 'page',
    title: data.title,
    slug: data.slug,
    fullPath,
    level: data.level,
    order: data.order,
    content: data.content || '',
    metaDescription: data.metaDescription || '',
    sidebar: data.sidebar || [],
    parent: data.parent ? normalizePage(data.parent) : null,
    children: data.children ? data.children.map(normalizePage) : [],
    featuredImage: data.featuredImage ? {
      url: getStrapiMediaUrl(data.featuredImage.url),
      alt: data.featuredImage.alternativeText || data.title,
      width: data.featuredImage.width,
      height: data.featuredImage.height,
    } : undefined,
    seo: data.seo,
    publishedAt: data.publishedAt,
  };
}
