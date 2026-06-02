import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getBlogDestination } from '@/lib/blog/resolve-blog-destination';
import { normalizeBlogSourcePath } from '@/lib/sitemap/fetch-blog-routes-from-sheet';

export const proxy = async (request: NextRequest): Promise<NextResponse> => {
  const pathname = normalizeBlogSourcePath(request.nextUrl.pathname);

  if (!pathname.startsWith('/blog')) {
    return NextResponse.next();
  }

  const destination = await getBlogDestination(pathname);
  return NextResponse.rewrite(new URL(destination));
};

export const config = {
  matcher: ['/blog', '/blog/', '/blog/:path*'],
};
