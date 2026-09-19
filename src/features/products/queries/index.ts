import type { Product } from "@/types";

/**
 * Product queries.
 *
 * These are server-side query functions. The actual database
 * implementation should be added when the backend is ready.
 */
export async function getProducts(): Promise<Product[]> {
  // TODO: Implement server-side product query.
  return [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // TODO: Implement server-side product query.
  void slug;
  return null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // TODO: Implement server-side product query.
  return [];
}