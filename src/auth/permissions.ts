import type { Permission, Role } from "./types";

/**
 * Static RBAC permission matrix — mirrors the backend matrix 1:1.
 *
 * Sync strategy (skill §11.4): **Strategy A — static, duplicated matrix.**
 * The backend must keep a line-for-line equivalent of ROLE_PERMISSIONS;
 * treat any drift between the two as a bug. When the
 * `system:roles_permissions` UI ships, migrate to Strategy B
 * (backend-resolved permissions array via GET /api/users/me).
 *
 * Default deny: anything not explicitly listed below is denied.
 */

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "tenant:create", "tenant:manage_all",
    "user:manage_all",
    "product:create", "product:edit_all", "product:delete_all", "product:view_public",
    "category:manage_global",
    "order:manage_all",
    "customer:view_all",
    "storefront:manage_all",
    "media:manage_all",
    "reports:view_global",
    "inventory:view", "inventory:receive", "inventory:issue", "inventory:reserve",
    "inventory:release", "inventory:transfer", "inventory:count", "inventory:adjust",
    "inventory:manage_locations", "inventory:view_reports",
    "system:settings", "system:roles_permissions",
  ],
  MANAGER: [
    "tenant:manage_own",
    "user:manage_tenant",
    "product:create", "product:edit_own_tenant", "product:delete_own_tenant", "product:view_public",
    "category:manage_tenant",
    "order:manage_tenant",
    "customer:view_tenant",
    "storefront:manage_own",
    "media:manage_tenant",
    "reports:view_tenant",
    "inventory:view", "inventory:receive", "inventory:issue", "inventory:reserve",
    "inventory:release", "inventory:transfer", "inventory:count", "inventory:adjust",
    "inventory:manage_locations", "inventory:view_reports",
  ],
  USER: [
    "product:view_public",
    "favorites:manage", "compare:use",
    "order:place", "order:manage_own",
    "customer:view_own",
    "inquiry:submit",
  ],
};

/**
 * The only way to answer "does this role have this permission?".
 * Never inline ROLE_PERMISSIONS lookups ad hoc in components.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false; // default deny
}
