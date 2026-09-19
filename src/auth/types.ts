/**
 * Auth domain types — single source of truth for the whole app.
 *
 * These types are the contract the real backend must honor too
 * (see `GET /api/users/me` in the access-control skill §11.2).
 * Keep them in sync with the backend user shape — drift here
 * silently breaks every permission check.
 */

export type Role = "SUPER_ADMIN" | "MANAGER" | "USER";

export type Permission =
  | "tenant:create" | "tenant:manage_all" | "tenant:manage_own"
  | "user:manage_all" | "user:manage_tenant"
  | "product:create" | "product:edit_all" | "product:edit_own_tenant"
  | "product:delete_all" | "product:delete_own_tenant" | "product:view_public"
  | "category:manage_global" | "category:manage_tenant"
  | "order:manage_all" | "order:manage_tenant" | "order:manage_own"
  | "customer:view_all" | "customer:view_tenant" | "customer:view_own"
  | "storefront:manage_all" | "storefront:manage_own"
  | "media:manage_all" | "media:manage_tenant"
  | "reports:view_global" | "reports:view_tenant"
  | "inventory:view" | "inventory:receive" | "inventory:issue" | "inventory:reserve"
  | "inventory:release" | "inventory:transfer" | "inventory:count" | "inventory:adjust"
  | "inventory:manage_locations" | "inventory:view_reports"
  | "system:settings" | "system:roles_permissions"
  | "favorites:manage" | "compare:use" | "order:place" | "inquiry:submit";

export interface AuthUser {
  id: string;
  role: Role;
  tenantId: string | null; // null for SUPER_ADMIN
  name: string;
  phone: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
}
