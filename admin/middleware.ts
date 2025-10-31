import { NextRequest, NextResponse } from 'next/server';

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/'];

// API routes that require authentication
const PROTECTED_API_ROUTES = [
  '/api/admin/products',
  '/api/admin/categories',
  '/api/admin/orders',
  '/api/admin/shipments',
  '/api/admin/users',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if it's a public route
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Get auth token from cookie or header
  const token =
    request.cookies.get('adminAuthToken')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // Check if user is authenticated
  const isAuthenticated = !!token;

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
    // Redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and trying to access login page
  if (isAuthenticated && pathname === '/login') {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to apply middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
