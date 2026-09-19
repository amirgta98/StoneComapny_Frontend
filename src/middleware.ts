import { NextResponse, type NextRequest } from "next/server";
import {
  decodeSessionCookie,
  MOCK_SESSION_COOKIE,
} from "@/auth/session-codec";
import type { Role } from "@/auth/types";

/**
 * Route-level access control (access-control skill §8.1).
 *
 * PROTECTED_PREFIXES uses the REAL routes of this project:
 * - /superAdmin/** → platform administration        (SUPER_ADMIN only)
 * - /dashboard/**  → single-tenant management panel (MANAGER, SUPER_ADMIN)
 *
 * When account/checkout style routes are added later, register them here:
 *   "/account":  ["SUPER_ADMIN", "MANAGER", "USER"],
 *   "/checkout": ["SUPER_ADMIN", "MANAGER", "USER"],
 *
 * NOTE — the frontend is a UX convenience layer, never a security boundary
 * (skill §9.1). In the mock phase the session cookie shape is decoded here;
 * in production this must verify a signed, httpOnly session cookie (real
 * JWT verification or a server-side session check) — never trust an
 * unverified payload.
 */
const PROTECTED_PREFIXES: Record<string, Role[]> = {
  "/superAdmin": ["SUPER_ADMIN"],
  "/account": ["SUPER_ADMIN", "MANAGER", "USER"],
  "/dashboard": ["SUPER_ADMIN", "MANAGER"],
  "/checkout": ["SUPER_ADMIN", "MANAGER", "USER"],
};

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Longest prefix wins so /superAdmin/settings matches "/superAdmin", not "/super".
  const matchedPrefix = Object.keys(PROTECTED_PREFIXES)
    .sort((a, b) => b.length - a.length)
    .find((p) => path === p || path.startsWith(`${p}/`));
  if (!matchedPrefix) return NextResponse.next();

  const rawCookie = req.cookies.get(MOCK_SESSION_COOKIE)?.value;
  // The decoded payload is UNTRUSTED — role checks here are UX-level only.
  const payload = decodeSessionCookie(rawCookie);

  if (!payload || payload.exp <= Date.now()) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", path); // preserve return destination
    return NextResponse.redirect(loginUrl);
  }

  const allowedRoles = PROTECTED_PREFIXES[matchedPrefix];
  if (!allowedRoles.includes(payload.role)) {
    // Signed in, but this area belongs to a different role → send home.
    const homeUrl = new URL("/", req.url);
    homeUrl.searchParams.set("denied", "1");
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/superAdmin/:path*",
    "/dashboard/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/checkout",
  ],
};
