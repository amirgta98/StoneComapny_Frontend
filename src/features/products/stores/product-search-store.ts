"use client";

import { create } from "zustand";

import {
  DEFAULT_PRODUCT_SORT,
  EMPTY_PRODUCT_FILTERS,
  type ProductFilters,
  type ProductSortOption,
} from "../types";

/**
 * Shared search/filter/sort state for the product experience.
 *
 * A single Zustand store is the single source of truth shared between
 * the product list and the search modal, so:
 * - the query persists when the modal closes,
 * - reopening the modal restores the latest query and filters,
 * - search, filters and sorting always operate on the same state.
 */
type ProductSearchState = {
  /** Free-text search query. */
  query: string;
  /** Structured stone filters. */
  filters: ProductFilters;
  /** Active sort order. */
  sort: ProductSortOption;
  setQuery: (query: string) => void;
  /** Set one filter key; `undefined` clears that criterion. */
  setFilter: <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => void;
  /** Set the active sort order. */
  setSort: (sort: ProductSortOption) => void;
  /** Clear all filters (keeps the query). */
  clearFilters: () => void;
  /** Clear query + filters. */
  reset: () => void;
};

export const useProductSearchStore = create<ProductSearchState>()((set) => ({
  query: "",
  filters: EMPTY_PRODUCT_FILTERS,
  sort: DEFAULT_PRODUCT_SORT,
  setQuery: (query) => set({ query }),
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  setSort: (sort) => set({ sort }),
  clearFilters: () => set({ filters: EMPTY_PRODUCT_FILTERS }),
  reset: () => set({ query: "", filters: EMPTY_PRODUCT_FILTERS }),
}));