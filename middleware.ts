import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session'); // A secure, http-only cookie is recommended

  // Define all paths that require a user to be logged in
  const protectedPaths = [
    '/admin',
    '/dashboard',
    '/doctor',
    '/hospital',
    '/lab',
    '/pharmacy',
  ];

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  // If trying to access a protected route without a session cookie, redirect to login
  if (isProtected && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect_to', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If the user is logged in but tries to access auth pages, redirect them to a default dashboard
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  if (sessionCookie && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Config matcher to specify which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
