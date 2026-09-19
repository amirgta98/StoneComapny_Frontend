"use client";

import { hasPermission } from "./permissions";
import { useAuth } from "./useAuth";
import type { Permission, Role } from "./types";

/**
 * Permission hooks (access-control skill §3):
 * - hasPermission(permission) — RBAC matrix lookup (default deny)
 * - hasRole(...roles) — direct role check
 *
 * Both return `false` while logged out — never throw.
 */
export function usePermission() {
  const { user } = useAuth();

  return {
    hasPermission: (permission: Permission): boolean =>
      user ? hasPermission(user.role, permission) : false,
    hasRole: (...roles: Role[]): boolean =>
      user ? roles.includes(user.role) : false,
  };
}
