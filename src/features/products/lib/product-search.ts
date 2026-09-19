import {
  STONE_APPLICATION_LABELS,
  STONE_COLOR_LABELS,
  STONE_FINISH_LABELS,
  STONE_FORM_LABELS,
  STONE_TYPE_LABELS,
} from "../constants";
import type { Product } from "@/types";
import type { ProductFilters, ProductSortOption } from "../types";

/**
 * Normalize a Persian/English search term:
 * - lowercase
 * - unify Arabic Yeh/Kaf with Persian forms
 * - collapse whitespace
 */
function normalizeTerm(term: string): string {
  return term
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim();
}

/** A product is in stock when any variant reports inventory > 0. */
export function isInStock(product: Product): boolean {
  return product.variants.some((v) => (v.inventory ?? 0) > 0);
}

/**
 * Build the haystack of searchable text for one product.
 * Includes the Persian labels of enum fields so users can
 * search by e.g. "مرمر" or "پولیش" as well as raw values.
 */
function searchableText(product: Product): string {
  return normalizeTerm(
    [
      product.name,
      product.description,
      product.origin,
      product.quarry,
      product.grade,
      product.dimensions,
      product.stoneType,
      (STONE_TYPE_LABELS as Record<string, string>)[product.stoneType ?? ""] ?? "",
      product.color,
      (STONE_COLOR_LABELS as Record<string, string>)[product.color ?? ""] ?? "",
      product.finish,
      (STONE_FINISH_LABELS as Record<string, string>)[product.finish ?? ""] ?? "",
      product.form,
      (STONE_FORM_LABELS as Record<string, string>)[product.form ?? ""] ?? "",
      product.application,
      (STONE_APPLICATION_LABELS as Record<string, string>)[
        product.application ?? ""
      ] ?? "",
      // Variant SKUs/names let users search by product code (e.g. "ST-001").
      ...product.variants.flatMap((variant) => [variant.sku, variant.name ?? ""]),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

/** True when every active filter criterion matches the product. */
function matchesFilters(product: Product, filters: ProductFilters): boolean {
  if (filters.stoneType && product.stoneType !== filters.stoneType) return false;
  if (filters.color && product.color !== filters.color) return false;
  if (filters.finish && product.finish !== filters.finish) return false;
  if (filters.application && product.application !== filters.application)
    return false;
  if (filters.form && product.form !== filters.form) return false;

  if (
    filters.minPrice !== undefined &&
    (product.price === undefined || product.price < filters.minPrice)
  )
    return false;

  if (
    filters.maxPrice !== undefined &&
    (product.price === undefined || product.price > filters.maxPrice)
  )
    return false;

  if (filters.inStockOnly && !isInStock(product)) return false;

  return true;
}

/**
 * Pure product search/filter.
 *
 * Combines a free-text query (matched against name and other relevant
 * fields) with structured stone filters. Both must pass.
 */
export function filterProducts(
  products: Product[],
  query: string,
  filters: ProductFilters
): Product[] {
  const normalizedQuery = normalizeTerm(query);

  return products.filter((product) => {
    if (!matchesFilters(product, filters)) return false;
    if (!normalizedQuery) return true;
    return searchableText(product).includes(normalizedQuery);
  });
}

/** Number of currently active filter criteria (query excluded). */
export function countActiveFilters(filters: ProductFilters): number {
  let count = 0;
  if (filters.stoneType) count += 1;
  if (filters.color) count += 1;
  if (filters.finish) count += 1;
  if (filters.application) count += 1;
  if (filters.form) count += 1;
  if (filters.minPrice !== undefined) count += 1;
  if (filters.maxPrice !== undefined) count += 1;
  if (filters.inStockOnly) count += 1;
  return count;
}

/**
 * Pure, non-mutating sort for product listings.
 *
 * Products without a price always sort to the end for both price
 * directions; name sorting uses the Persian collation so the ordering
 * matches the RTL UI.
 */
export function sortProducts(
  products: Product[],
  sort: ProductSortOption
): Product[] {
  const list = [...products];

  switch (sort) {
    case "newest":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "oldest":
      return list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "popular":
      return list.sort(
        (a, b) =>
          (b.reviewCount ?? 0) - (a.reviewCount ?? 0) ||
          (b.rating ?? 0) - (a.rating ?? 0)
      );
    case "name-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name, "fa"));
    case "name-desc":
      return list.sort((a, b) => b.name.localeCompare(a.name, "fa"));
    case "price-asc":
      return list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    case "price-desc":
      return list.sort(
        (a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity)
      );
  }
}