import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected route prefixes requiring authentication
const PROTECTED_PREFIXES = ["/teacher", "/student", "/admin", "/exam-taking"];

// Public auth routes (where logged-in users should be redirected away)
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("auth_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;

  // 1. If visiting an auth page (login/register) while already logged in
  if (AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    if (authToken) {
      const targetUrl =
        userRole === "admin"
          ? "/admin"
          : userRole === "teacher"
          ? "/teacher"
          : "/student/exams";
      return NextResponse.redirect(new URL(targetUrl, request.url));
    }
    return NextResponse.next();
  }

  // 2. Check if route is protected
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected) {
    // If not authenticated, redirect to /login with redirect query param
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based Access Control (RBAC) routing safeguards
    if (pathname.startsWith("/admin") && userRole && userRole !== "admin") {
      const fallbackUrl = userRole === "teacher" ? "/teacher" : "/student/exams";
      return NextResponse.redirect(new URL(fallbackUrl, request.url));
    }

    if (pathname.startsWith("/teacher") && userRole === "student") {
      return NextResponse.redirect(new URL("/student/exams", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (/api/*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - static assets (.svg, .png, .jpg, .css, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|ico|woff|woff2)$).*)",
  ],
};

