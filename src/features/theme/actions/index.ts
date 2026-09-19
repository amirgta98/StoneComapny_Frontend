"use server";

import { themeSchema, type ThemeFormValues } from "../schemas";

/**
 * Theme server actions.
 *
 * Theme is scoped to a tenant. Authorization MUST be enforced
 * server-side. Never trust a client-provided tenantId.
 */
export async function updateTenantTheme(tenantId: string, input: ThemeFormValues) {
  const parsed = themeSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid theme data", issues: parsed.error.issues };
  }

  // TODO: Check authorization (theme.update).
  // TODO: Verify tenant scope server-side.
  // TODO: Persist theme via service/database.

  return { success: true };
}