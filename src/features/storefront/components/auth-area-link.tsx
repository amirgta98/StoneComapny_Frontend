"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User } from "lucide-react";

import { useAuth } from "@/auth";

/**
 * Auth area of the storefront header (access-control skill S7 + S8).
 *
 * - Logged out -> "ثبت‌نام | ورود" link that returns the user to the current
 *   page after a successful OTP login (the new `redirect` param the
 *   middleware sets; S8.1).
 * - USER        -> "حساب کاربری" link to the customer account panel (/account).
 * - MANAGER / SUPER_ADMIN -> "داشبورد" link to the management panel (/dashboard).
 *
 * The destination is role-aware so a regular USER is never sent to
 * /dashboard (which only allows MANAGER/SUPER_ADMIN and would bounce them
 * to /?denied=1).
 */
export function AuthAreaLink() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Authenticated -> role-aware destination.
  if (user) {
    const href = user.role === "USER" ? "/account" : "/dashboard";
    const label = user.role === "USER" ? "حساب کاربری" : "داشبورد";
    return (
      <Link
        href={href}
        aria-label={label}
        className="flex items-center gap-1 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted"
      >
        <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  }

  // Guest -> login/sign-up.
  const redirect = `/login?redirect=${encodeURIComponent(pathname)}`;
  return (
    <Link
      href={redirect}
      aria-label="ثبت نام | ورود"
      className="flex items-center gap-1 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted"
    >
      <User className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">ثبت‌نام | ورود</span>
    </Link>
  );
}