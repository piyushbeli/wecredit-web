import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getBlogDestination } from '@/lib/blog/resolve-blog-destination';
import { getLoanDestination } from '@/lib/loans/resolve-loan-destination';
import { normalizeSheetSourcePath } from '@/lib/sitemap/fetch-sheet-routes';

export const proxy = async (request: NextRequest): Promise<NextResponse> => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/blog')) {
    const normalizedPath = normalizeSheetSourcePath(pathname);
    const destination = await getBlogDestination(normalizedPath);
    return NextResponse.rewrite(new URL(destination));
  }

  if (pathname.startsWith('/loans')) {
    const normalizedPath = normalizeSheetSourcePath(pathname);
    const destination = await getLoanDestination(normalizedPath);

    if (destination) {
      return NextResponse.rewrite(new URL(destination));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    '/blog',
    '/blog/',
    '/blog/:path*',
    '/loans',
    '/loans/',
    '/loans/:path*',
  ],
};
