import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public routes
  const publicRoutes = [
    '/invite',
    '/access-denied',
    '/api/invitations/validate',
    '/api/devices/register',
    '/api/devices/verify',
    '/api/devices/register-admin',
    '/api/admin/generate-invite',
    '/api/invitations/generate',
  ];

  // Check if the current path starts with any public route
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow admin login page but not other admin routes
  if (pathname === '/admin') {
    return NextResponse.next();
  }

  // For all other routes, check if either current or legacy device cookie exists
  const deviceCookie =
    request.cookies.get('syracuse_exoticz_device_token') ??
    request.cookies.get('elevate_device_token');

  if (!deviceCookie) {
    // No device cookie, redirect to access denied
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }

  // Device cookie exists - allow access
  // Full verification will happen on the client side with fingerprint matching
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
