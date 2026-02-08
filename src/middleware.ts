import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from './constants';

/**
 * Cookie name for auth token (must match the one set in use-auth.ts)
 */
const AUTH_COOKIE_NAME = 'auth_token';

/**
 * Routes that require authentication
 */
const PROTECTED_ROUTES = [
  ROUTES.ACCOUNT.BASE,
  ROUTES.CHECKOUT,
];

/**
 * Routes that should redirect to home if already authenticated
 */
const AUTH_ROUTES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
];

/**
 * Get the base path from a route (handles both string and object routes)
 */
function getRoutePath(route: string | { BASE?: string; [key: string]: string | undefined }): string {
  if (typeof route === 'string') {
    return route;
  }
  return route.BASE ?? Object.values(route).find((v) => typeof v === 'string') ?? '';
}

/**
 * Check if the pathname matches any of the protected routes
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(getRoutePath(route)));
}

/**
 * Check if the pathname is an auth route (login/register)
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(getRoutePath(route)));
}

/**
 * Middleware to protect routes and handle authentication redirects
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // If user is authenticated and trying to access auth routes, redirect to home
  if (token && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!token && isProtectedRoute(pathname)) {
    const loginUrl = new URL('/auth/login', request.url);
    // Add the original URL as a redirect parameter
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
