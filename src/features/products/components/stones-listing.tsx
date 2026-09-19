"use client";

import { useCallback, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { EmptyState } from "@/components/data-listing";
import {
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib/utils";

import { useProductSearch } from "../hooks/use-product-search";
import {
  PRODUCT_SORT_LABELS,
  PRODUCT_SORT_OPTIONS,
  STONE_FORM_LABELS,
  STONE_TYPE_LABELS,
  stoneLabel,
} from "../constants";
import type { ProductSortOption } from "../types";
import type { Product } from "@/types";

import { ProductGrid } from "./product-grid";
import {
  FACET_KEYS,
  FACET_LABELS,
  FACET_LABEL_MAPS,
  StoneFilterPanel,
  type StoneFacetKey,
} from "./stone-filter-panel";

type StonesListingProps = {
  /** Products to list (server-provided; one source of truth for facets). */
  products: Product[];
  className?: string;
};

type ActiveChip = {
  id: string;
  label: string;
  onRemove: () => void;
};

/** Fixed quick-filter values per facet (only rendered when data has them). */
const QUICK_STONE_TYPES = ["travertine", "marble", "granite"];
const QUICK_FORMS = ["slab", "tile"];

/**
 * Stone products listing (client island).
 *
 * Composes the shared search/filter/sort infrastructure:
 * - one inline search field bound to the shared query,
 * - quick-filter chips (stone type / product form),
 * - active-filter chips with per-chip removal + clear all,
 * - product count + sort select,
 * - desktop filter sidebar (sticky) and a mobile filter dialog,
 * - the existing `ProductGrid`/`ProductCard` (unchanged).
 *
 * Facet options are derived from the actual product data, keeping the
 * architecture data-driven and multi-tenant safe.
 */
export function StonesListing({ products, className }: StonesListingProps) {
  const {
    query,
    setQuery,
    filters,
    setFilter,
    sort,
    setSort,
    clearFilters,
    reset,
    results,
    activeFilterCount,
    isFiltering,
  } = useProductSearch(products);

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  /** Available values per facet, derived from the product list. */
  const facets = useMemo(() => {
    const result = {} as Record<StoneFacetKey, string[]>;
    for (const facet of FACET_KEYS) {
      const values = new Set<string>();
      for (const product of products) {
        const value = product[facet];
        if (value) values.add(value);
      }
      result[facet] = [...values].sort((a, b) => {
        const labelA = stoneLabel(FACET_LABEL_MAPS[facet], a) ?? a;
        const labelB = stoneLabel(FACET_LABEL_MAPS[facet], b) ?? b;
        return labelA.localeCompare(labelB, "fa");
      });
    }
    return result;
  }, [products]);

  /** Quick-filter chips; "All" resets the two facet groups it represents. */
  const quickChips = useMemo(() => {
    const chips: {
      id: string;
      label: string;
      active: boolean;
      onSelect: () => void;
    }[] = [
      {
        id: "all",
        label: "همه",
        active: !filters.stoneType && !filters.form,
        onSelect: () => {
          setFilter("stoneType", undefined);
          setFilter("form", undefined);
        },
      },
    ];

    for (const value of QUICK_STONE_TYPES) {
      if (!facets.stoneType.includes(value)) continue;
      const active = filters.stoneType === value;
      chips.push({
        id: `type-${value}`,
        label: stoneLabel(STONE_TYPE_LABELS, value) ?? value,
        active,
        onSelect: () => setFilter("stoneType", active ? undefined : value),
      });
    }

    for (const value of QUICK_FORMS) {
      if (!facets.form.includes(value)) continue;
      const active = filters.form === value;
      chips.push({
        id: `form-${value}`,
        label: stoneLabel(STONE_FORM_LABELS, value) ?? value,
        active,
        onSelect: () => setFilter("form", active ? undefined : value),
      });
    }

    return chips;
  }, [facets, filters, setFilter]);

  /** One removable chip per active criterion. */
  const activeChips = useMemo(() => {
    const chips: ActiveChip[] = [];
    for (const facet of FACET_KEYS) {
      const value = filters[facet];
      if (!value) continue;
      chips.push({
        id: facet,
        label: `${FACET_LABELS[facet]}: ${stoneLabel(FACET_LABEL_MAPS[facet], value) ?? value}`,
        onRemove: () => setFilter(facet, undefined),
      });
    }
    if (filters.inStockOnly) {
      chips.push({
        id: "inStockOnly",
        label: "فقط کالاهای موجود",
        onRemove: () => setFilter("inStockOnly", undefined),
      });
    }
    return chips;
  }, [filters, setFilter]);

  /** Sidebar/drawer callbacks (stable identities). */
  const handleFacetChange = useCallback(
    (facet: StoneFacetKey, value: string | undefined) =>
      setFilter(facet, value),
    [setFilter]
  );
  const handleInStockChange = useCallback(
    (value: boolean) => setFilter("inStockOnly", value),
    [setFilter]
  );
  const handleClearAll = useCallback(() => clearFilters(), [clearFilters]);
  const handleResetAll = useCallback(() => reset(), [reset]);

  const hasQuery = query.trim().length > 0;

  const filterPanel = (
    <StoneFilterPanel
      facets={facets}
      filters={filters}
      onFacetChange={handleFacetChange}
      onInStockChange={handleInStockChange}
    />
  );

  return (
    <div className={className}>
      {/* -------------------------------------------------- Search -- */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="جستجو بر اساس نام سنگ، کد محصول یا نوع سنگ…"
          aria-label="جستجوی سنگ‌ها"
          className="h-11 rounded-lg bg-background pr-9 text-sm shadow-sm"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="پاک کردن عبارت جستجو"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ------------------------------------------ Quick filters -- */}
      <div
        className="mt-4 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="فیلترهای سریع"
      >
        {quickChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            aria-pressed={chip.active}
            onClick={chip.onSelect}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              chip.active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-accent"
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* ----------------------------------------- Active filters -- */}
      {activeChips.length > 0 && (
        <div
          className="mt-4 flex flex-wrap items-center gap-2"
          aria-label="فیلترهای فعال"
        >
          <span className="text-sm text-muted-foreground">فیلترهای فعال:</span>

          {activeChips.map((chip) => (
            <Badge
              key={chip.id}
              variant="secondary"
              className="gap-1 py-1 pl-2 pr-3 font-normal"
            >
              {chip.label}
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`حذف فیلتر ${chip.label}`}
                className="rounded-full p-0.5 transition-colors hover:bg-foreground/10"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </Badge>
          ))}

          <button
            type="button"
            onClick={handleClearAll}
            className="rounded-sm text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
          >
            پاک کردن همه
          </button>
        </div>
      )}

      {/* ------------------------------- Product count + sorting -- */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <span className="font-semibold text-foreground">
            {results.length.toLocaleString("fa-IR")}
          </span>{" "}
          محصول
        </p>

        <div className="flex items-center gap-2">
          {/* Mobile-only filter trigger (desktop uses the sidebar) */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setFilterDialogOpen(true)}
            aria-haspopup="dialog"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            فیلترها
            {activeFilterCount > 0 && (
              <Badge className="h-5 px-1.5 text-[11px]">
                {activeFilterCount.toLocaleString("fa-IR")}
              </Badge>
            )}
          </Button>

          <Select
            value={sort}
            onValueChange={(value) => setSort(value as ProductSortOption)}
          >
            <SelectTrigger aria-label="ترتیب نمایش" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_SORT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {PRODUCT_SORT_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ----------------------------- Sidebar + product grid -- */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
        {/* Desktop sidebar (first in DOM = start/right side in RTL) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">فیلترها</h2>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-medium text-primary underline-offset-4 transition-colors hover:underline"
                >
                  پاک کردن همه
                </button>
              )}
            </div>
            {filterPanel}
          </div>
        </aside>

        {/* Grid / empty state */}
        <div>
          {results.length === 0 ? (
            <EmptyState
              title={
                hasQuery && activeFilterCount === 0
                  ? "نتیجه‌ای برای جستجوی شما پیدا نشد"
                  : "سنگی مطابق فیلترهای انتخابی پیدا نشد"
              }
              description="هیچ سنگی با معیارهای فعلی مطابقت ندارد. عبارت جستجو یا فیلترها را تغییر دهید — مثلاً نام سنگ، کد محصول یا نوع سنگ را ساده‌تر وارد کنید."
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetAll}
                >
                  پاک کردن همه فیلترها و جستجو
                </Button>
              }
            />
          ) : (
            <div aria-busy={isFiltering}>
              <ProductGrid
                products={results}
                columns={3}
                mobileColumns={2}
                className={cn(
                  "transition-opacity duration-200",
                  isFiltering && "opacity-60"
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------- Mobile filter dialog -- */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="top-[6%] max-h-[88dvh] w-[94vw] max-w-md translate-y-0 gap-0 overflow-hidden rounded-2xl p-0"
        >
          <div className="flex items-center justify-between border-b px-12 py-4">
            <DialogTitle className="text-base font-semibold">
              فیلترها
              {activeFilterCount > 0 && (
                <Badge className="mr-2 align-middle" variant="secondary">
                  {activeFilterCount.toLocaleString("fa-IR")}
                </Badge>
              )}
            </DialogTitle>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-medium text-primary underline-offset-4 transition-colors hover:underline"
              >
                پاک کردن همه
              </button>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {filterPanel}
          </div>

          <div className="flex items-center gap-2 border-t px-5 py-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClearAll}
            >
              پاک کردن همه
            </Button>
            <DialogClose asChild>
              <Button type="button" className="flex-1">
                اعمال ({results.length.toLocaleString("fa-IR")} نتیجه)
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
