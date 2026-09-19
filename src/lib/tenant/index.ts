import type { TenantContext } from "@/types";

/**
 * Resolves the current tenant from a hostname.
 *
 * This is infrastructure for tenant resolution:
 *
 *   hostname
 *     ↓
 *   tenant resolver
 *     ↓
 *   tenant context
 *     ↓
 *   tenant ID
 *
 * The actual database lookup should be implemented server-side.
 * Never trust a browser-supplied tenant ID.
 */
export async function resolveTenantFromHostname(
  hostname: string
): Promise<TenantContext | null> {
  // TODO: Implement server-side tenant resolution against the database.
  // This is a placeholder that should be replaced with a real lookup.
  void hostname;
  return null;
}