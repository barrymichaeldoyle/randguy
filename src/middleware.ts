import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

// Canonical domain - change this if you prefer www
const CANONICAL_HOST = 'randguy.com';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  let hostname = request.headers.get('host') || '';

  // Remove port number if present (for localhost)
  hostname = hostname.split(':')[0];

  // Skip redirects for localhost and preview deployments
  if (
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1') ||
    hostname.includes('.vercel.app') ||
    hostname.includes('.netlify.app')
  ) {
    return NextResponse.next();
  }

  // Normalize hostname - remove www if present
  const normalizedHostname = hostname.replace(/^www\./, '');

  // Check if we need to redirect to canonical domain
  // Redirect if: protocol is not HTTPS, or hostname doesn't match canonical (including www variants)
  const needsRedirect =
    url.protocol !== 'https:' || normalizedHostname !== CANONICAL_HOST;

  if (needsRedirect) {
    // Build canonical URL
    url.protocol = 'https:';
    url.hostname = CANONICAL_HOST;

    // Redirect to canonical URL (301 = permanent redirect)
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
