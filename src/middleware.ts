// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.nextauth.token;
    const isPublicRoute = pathname === '/login' || pathname === '/register';
    const isDashboardRoute = pathname.startsWith('/dashboard');

    console.log(isLoggedIn);

    if (isLoggedIn && isPublicRoute) {
      return NextResponse.redirect(new URL('/games', req.url));
    }

    if (!isLoggedIn && isDashboardRoute) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (
          req.nextUrl.pathname.startsWith('/dashboard') &&
          token === null
        ) {
          return false;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)',
    '/',
  ],
};