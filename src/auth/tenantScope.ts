import type { AuthUser } from "./types";

/**
 * Tenant scoping check (access-control skill §6).
 *
 * Every read/write of a tenant-owned resource (product, order, customer,
 * media, storefront settings, …) MUST pass through this function before
 * rendering or mutating — including against mock data, so wrong behavior
 * is caught now, not after the real backend is wired.
 *
 * This mirrors the backend rule exactly:
 *   authenticatedUser.role + authenticatedUser.tenantId === resource.tenantId
 */
export function canAccessTenantResource(
  user: AuthUser,
  resourceTenantId: string
): boolean {
  if (user.role === "SUPER_ADMIN") return true; // global scope — never gated by tenantId
  if (user.role === "MANAGER") return user.tenantId === resourceTenantId;
  return false; // USER never accesses tenant-management resources this way
}

/**
 * User-scoped ownership check (skill §1 + §9 rule 3).
 *
 * A USER may only touch resources where resource.ownerId === user.id.
 * Enforced in the mock data layer too, so IDOR-style bugs surface
 * before the backend exists.
 */
export function canAccessOwnedResource(
  user: AuthUser,
  resourceOwnerId: string
): boolean {
  if (user.role === "SUPER_ADMIN" || user.role === "MANAGER") return true;
  return resourceOwnerId === user.id;
}
