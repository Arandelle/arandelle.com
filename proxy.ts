import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const ADMIN_SUBDOMAIN = process.env.ADMIN_SUBDOMAIN || 'dev';
const PROTECTED_PREFIXES = ['/admin'];

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // Check if request is from admin subdomain
  const isSubdomain = hostname.startsWith(`${ADMIN_SUBDOMAIN}.`);

  // ─── Subdomain Routing: dev.* → /admin/* ─────────────────────────
  if (isSubdomain) {
    // Redirect root to /admin
    if (pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }

    // Rewrite all subdomain requests to /admin/*
    url.pathname = `/admin${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ─── Auth Protection for /admin/* routes ──────────────────────────
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get('auth-token')?.value;
    const isAuthenticated = token && verifyToken(token);

    // Redirect to login if not authenticated
    if (!isAuthenticated && !pathname.startsWith('/admin/login')) {
      url.pathname = '/admin/login';
      url.search = `?redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from login to dashboard
    if (isAuthenticated && pathname.startsWith('/admin/login')) {
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public/*)
     * - API routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth/login|api/auth/logout).*)',
  ],
};
