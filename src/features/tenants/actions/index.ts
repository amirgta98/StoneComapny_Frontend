"use server";

import { tenantSchema, type TenantFormValues } from "../schemas";

/**
 * Tenant server actions.
 *
 * These are super-admin operations. Authorization MUST be enforced
 * server-side. Never trust a client-provided tenantId.
 */
export async function createTenant(input: TenantFormValues) {
  const parsed = tenantSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid tenant data", issues: parsed.error.issues };
  }

  // TODO: Check authorization (tenant.create).
  // TODO: Persist tenant via service/database.

  return { success: true };
}

export async function updateTenant(id: string, input: TenantFormValues) {
  const parsed = tenantSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid tenant data", issues: parsed.error.issues };
  }

  // TODO: Check authorization (tenant.update).
  // TODO: Persist changes via service/database.

  return { success: true };
}

export async function updateTenantStatus(id: string, status: TenantFormValues["status"]) {
  // TODO: Check authorization (tenant.update).
  // TODO: Persist status change via service/database.

  void id;
  void status;
  return { success: true };
}