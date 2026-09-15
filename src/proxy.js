// src/proxy.js
import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { NextResponse } from "next/server";
import { getCachedMaintenanceStatus } from "./lib/settingsCache";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const session = req.auth;

  const isLoggedIn = Boolean(session?.user);
  const userRole = session?.user?.role;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isMaintenancePage = nextUrl.pathname === "/maintenance";

  // Lejo API routes (NextAuth, products, orders, etj.)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // ✅ Kontrollo maintenance mode (vetëm për routes publike, jo admin/login/maintenance)
  if (!isAdminRoute && !isMaintenancePage && !isAuthPage) {
    const { maintenanceMode } = await getCachedMaintenanceStatus();

    if (maintenanceMode) {
      // ✅ Admin-i mund të kalojë maintenance mode-in
      if (!(isLoggedIn && userRole === "admin")) {
        return NextResponse.redirect(new URL("/maintenance", nextUrl));
      }
    }
  }

  // ... pjesa tjetër e logic

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl);

      loginUrl.searchParams.set("callbackUrl", `${pathname}${nextUrl.search}`);

      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "admin" && userRole !== "seller") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  if (isDashboardRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);

    loginUrl.searchParams.set("callbackUrl", `${pathname}${nextUrl.search}`);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
