import { NextRequest, NextResponse } from "next/server";

const SITE_PASSWORD = "100";
const COOKIE_NAME = "site-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the password page and its API route through
  if (pathname === "/password" || pathname === "/api/password") {
    return NextResponse.next();
  }

  // Allow the embeddable form route (used in Framer iframes)
  if (pathname.startsWith("/forms-demo/embed")) {
    return NextResponse.next();
  }

  // Allow static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff2?|ttf|css|js)$/)
  ) {
    return NextResponse.next();
  }

  const auth = request.cookies.get(COOKIE_NAME);
  if (auth?.value === SITE_PASSWORD) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/password";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
