/**
 * Authors API Functions
 * Query functions for fetching author data from Strapi
 */

import { fetchFromCms } from '@/lib/api/cms-client';
import type { Author, StrapiResponse } from '@/types/strapi';

// Export type for convenience
export type { Author };

const AUTHOR_POPULATE = {
  avatar: true,
  socialLinks: true,
};

/**
 * Fetch author by slug
 */
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const response = await fetchFromCms<StrapiResponse<Author[]>>('authors', {
    filters: {
      slug: { $eq: slug },
    },
    populate: AUTHOR_POPULATE,
  });

  return response.data[0] || null;
}

/**
 * Fetch all authors
 */
export async function getAllAuthors(): Promise<Author[]> {
  const response = await fetchFromCms<StrapiResponse<Author[]>>('authors', {
    populate: AUTHOR_POPULATE,
    sort: ['name:asc'],
  });

  return response.data;
}

