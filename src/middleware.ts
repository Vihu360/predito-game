// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("Token in middleware:", req.nextauth.token);
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access if there's a valid token
        return !!token;
      },
    },
  }
);

// Protect only the games route
export const config = { 
  matcher: ["/games"] 
};