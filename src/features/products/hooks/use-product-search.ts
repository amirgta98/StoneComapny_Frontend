"use client";

import { useMemo } from "react";

import { useDebounce } from "@/hooks";

import { countActiveFilters, filterProducts, sortProducts } from "../lib/product-search";
import { useProductSearchStore } from "../stores/product-search-store";
import type { Product } from "@/types";

/**
 * Shared product search/filter/sort hook.
 *
 * Wraps the shared Zustand store and derives the filtered + sorted
 * result list. The query is debounced so typing feels smooth while
 * results update dynamically. Both the product list and the search
 * modal consume this hook — there is exactly one source of state and
 * one filtering path.
 */
export function useProductSearch(products: Product[]) {
  const query = useProductSearchStore((s) => s.query);
  const filters = useProductSearchStore((s) => s.filters);
  const sort = useProductSearchStore((s) => s.sort);
  const setQuery = useProductSearchStore((s) => s.setQuery);
  const setFilter = useProductSearchStore((s) => s.setFilter);
  const setSort = useProductSearchStore((s) => s.setSort);
  const clearFilters = useProductSearchStore((s) => s.clearFilters);
  const reset = useProductSearchStore((s) => s.reset);

  // Debounce only the value used for filtering; the input keeps the
  // raw query so editing stays responsive.
  const debouncedQuery = useDebounce(query, 200);

  const results = useMemo(
    () => sortProducts(filterProducts(products, debouncedQuery, filters), sort),
    [products, debouncedQuery, filters, sort]
  );

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  return {
    /** Raw query (as typed). */
    query,
    setQuery,
    filters,
    setFilter,
    /** Active sort order. */
    sort,
    setSort,
    clearFilters,
    reset,
    /** Filtered + sorted products. */
    results,
    activeFilterCount,
    isFiltering: query !== debouncedQuery,
  };
}