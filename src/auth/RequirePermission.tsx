"use client";

import { useAuth } from "./useAuth";
import { hasPermission } from "./permissions";
import type { Permission } from "./types";

/**
 * Conditionally renders children when the current user holds `permission`
 * (access-control skill §8.2).
 *
 * Remember: this is UX polish, NOT security (skill §1) — every check here
 * must be duplicated server-side. Route-level protection lives in
 * `src/middleware.ts` (§8.1).
 */
export function RequirePermission({
  permission,
  fallback = null,
  children,
}: {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  if (!user || !hasPermission(user.role, permission)) return <>{fallback}</>;
  return <>{children}</>;
}
