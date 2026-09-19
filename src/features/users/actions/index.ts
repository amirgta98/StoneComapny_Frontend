"use server";

import { createUserSchema, type CreateUserFormValues } from "../schemas";

/**
 * User server actions.
 *
 * These are super-admin operations. Authorization MUST be enforced
 * server-side. Never trust client-provided tenantId.
 */
export async function createUser(input: CreateUserFormValues) {
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid user data", issues: parsed.error.issues };
  }

  // TODO: Check authorization (user.create).
  // TODO: Persist user via service/database.

  return { success: true };
}
