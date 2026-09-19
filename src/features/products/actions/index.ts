"use server";

import { productSchema, type ProductFormValues } from "../schemas";

/**
 * Product server actions.
 *
 * These follow the preferred mutation path:
 *   Form → Server Action → Zod validation → Authorization → Service → Database
 *
 * Authorization and tenant isolation MUST be enforced server-side.
 */
export async function createProduct(input: ProductFormValues) {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid product data", issues: parsed.error.issues };
  }

  // TODO: Check authorization (product.create).
  // TODO: Resolve tenant scope server-side.
  // TODO: Persist product via service/database.

  return { success: true };
}

export async function updateProduct(id: string, input: ProductFormValues) {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid product data", issues: parsed.error.issues };
  }

  // TODO: Check authorization (product.update).
  // TODO: Verify product belongs to current tenant.
  // TODO: Persist changes via service/database.

  return { success: true };
}

export async function deleteProduct(id: string) {
  // TODO: Check authorization (product.delete).
  // TODO: Verify product belongs to current tenant.
  // TODO: Delete via service/database.

  void id;
  return { success: true };
}