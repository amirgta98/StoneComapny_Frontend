import type { Tenant } from "@/types";
import { mockTenants } from "@/lib/mock-data/tenants";

/**
 * Tenant queries.
 *
 * These are server-side query functions. The actual database
 * implementation should be added when the backend is ready.
 */
export async function getTenants(): Promise<Tenant[]> {
  // Using mock data for now. Replace with actual backend query when ready.
  return mockTenants;
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  // TODO: Implement server-side tenant query.
  void slug;
  return null;
}