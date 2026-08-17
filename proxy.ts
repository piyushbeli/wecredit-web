import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getProxyRewriteDestination } from '@/lib/sitemap/resolve-sheet-destination';

export const proxy = async (request: NextRequest): Promise<NextResponse> => {
  const destination = await getProxyRewriteDestination(request.nextUrl.pathname);
  if (destination) {
    return NextResponse.rewrite(new URL(destination));
  }
  return NextResponse.next();
};

/**
 * Lookup-first matcher: run on app routes, skip static assets and API.
 * Rewrites only when the path exists in the sheet map (or is an unknown /blog path).
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt|woff2?)$).*)',
  ],
};
