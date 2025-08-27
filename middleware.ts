import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only run middleware in production or when dev auth is disabled
  const isDevMode = process.env.NO_AUTH_DEV_MODE === 'true';
  
  if (isDevMode) {
    // In dev mode, allow all requests through
    return NextResponse.next();
  }

  // In production, you would implement proper authentication logic here
  // For now, redirect to onboarding
  if (request.nextUrl.pathname === '/app') {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*']
};