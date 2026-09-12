import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const ADMIN_SUBDOMAIN = process.env.ADMIN_SUBDOMAIN || "dev";
const PUBLIC_PATHS = ["/login"];

export const isAuthenticated = (request: NextRequest) => {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return false;
  return !!verifyToken(token);
};

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const pathname = url.pathname;

  const subdomain = hostname.split(".")[0];

  if (subdomain !== ADMIN_SUBDOMAIN) {
    return NextResponse.next();
  }

  const authenticated = isAuthenticated(request);
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Public routes (e.g. /login): redirect authenticated users to dashboard
  if (isPublicPath) {
    if (authenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Allow unauthenticated access to public paths, rewrite to /admin/login
    url.pathname = `/admin${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Protected routes: redirect unauthenticated users to login
  if (!authenticated) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth-token");
    return response;
  }

  // Authenticated + protected route: rewrite to /admin folder
  url.pathname = `/admin${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
