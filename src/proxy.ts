import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

interface SessionData {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: {
    id: string;
    role: string;
    [key: string]: any;
  };
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/profile") &&
    !pathname.startsWith("/auth") &&
    !pathname.startsWith("/admin")
  ) {
    console.log("Skipping non-protected route");
    return NextResponse.next();
  }

  try {
    const data = (await auth.api.getSession(req)) as unknown as SessionData;

    const isLoggedIn = !!data?.session;
    const isAdmin = data?.user?.role === "ADMIN";

    // Redirect logged-in users away from auth page
    if (pathname.startsWith("/auth")) {
      if (isLoggedIn) {
        const url = req.nextUrl.clone();
        // Redirect admins to admin dashboard, others to user dashboard
        url.pathname = isAdmin ? "/admin/dashboard" : "/dashboard";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    // Protect admin routes - require login AND admin role
    if (pathname.startsWith("/admin")) {
      if (!isLoggedIn) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }

      if (!isAdmin) {
        // Non-admin users trying to access admin routes
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    }

    // Protect user dashboard and profile
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
      if (!isLoggedIn) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/auth/:path*",
    "/admin/:path*",
  ],
};
