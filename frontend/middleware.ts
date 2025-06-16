import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: Request) {
  const sessionCookie = getSessionCookie(request);
  const url = new URL(request.url);

  // If user is NOT logged in and tries to access dashboard, redirect to login
  if (!sessionCookie && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user IS logged in and tries to access public routes, redirect to dashboard
  if (sessionCookie && ["/", "/login", "/register"].includes(url.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"], // Match all these routes
};