/**
 * @deprecated Canonical RBAC lives in `@/auth/permissions` (access-control
 * skill §5). This shim keeps old import paths working WITHOUT maintaining
 * a second, divergent permission matrix — always import from `@/auth`.
 *
 * The previous in-house matrix (super_admin / tenant_manager / customer)
 * has been retired; use the platform roles SUPER_ADMIN / MANAGER / USER.
 */
export { hasPermission, ROLE_PERMISSIONS } from "@/auth/permissions";
export type { Role, Permission } from "@/auth/types";