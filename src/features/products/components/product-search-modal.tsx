"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib/utils";

import {
  STONE_APPLICATION_LABELS,
  STONE_COLOR_LABELS,
  STONE_FINISH_LABELS,
  STONE_FORM_LABELS,
  STONE_TYPE_LABELS,
} from "../constants";
import { isInStock } from "../lib/product-search";
import { useProductSearch } from "../hooks/use-product-search";
import type { ProductFilters } from "../types";
import type { Product } from "@/types";

type ProductSearchModalProps = {
  products: Product[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** One dropdown filter row inside the modal. */
function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options: Record<string, string>;
  onChange: (value: string | undefined) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select
        value={value ?? "all"}
        onValueChange={(v) => onChange(v === "all" ? undefined : v)}
      >
        <SelectTrigger className="h-8 w-full text-xs">
          <SelectValue placeholder={`همه ${label} ها`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">همه</SelectItem>
          {Object.entries(options).map(([key, labelText]) => (
            <SelectItem key={key} value={key}>
              {labelText}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Advanced product search modal.
 *
 * - Auto-focuses the search input when opened.
 * - Restores the latest shared query + filters (single Zustand store).
 * - Shows live results while typing.
 * - Stone-specific filters: type, color, finish, application, form,
 *   price range and availability — all combinable.
 * - Active-filter chips + clear-filters action.
 */
export function ProductSearchModal({
  products,
  open,
  onOpenChange,
}: ProductSearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    setQuery,
    filters,
    setFilter,
    clearFilters,
    results,
    activeFilterCount,
  } = useProductSearch(products);

  // Auto-focus the input whenever the modal opens.
  useEffect(() => {
    if (open) {
      // Wait one frame so Radix has mounted the content.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const hasQuery = query.trim().length > 0;

  /** Human-readable chip labels for active filters. */
  const activeChips: { key: keyof ProductFilters; label: string }[] = [];
  if (filters.stoneType)
    activeChips.push({
      key: "stoneType",
      label: STONE_TYPE_LABELS[filters.stoneType as keyof typeof STONE_TYPE_LABELS] ?? filters.stoneType,
    });
  if (filters.color)
    activeChips.push({
      key: "color",
      label: STONE_COLOR_LABELS[filters.color as keyof typeof STONE_COLOR_LABELS] ?? filters.color,
    });
  if (filters.finish)
    activeChips.push({
      key: "finish",
      label: STONE_FINISH_LABELS[filters.finish as keyof typeof STONE_FINISH_LABELS] ?? filters.finish,
    });
  if (filters.application)
    activeChips.push({
      key: "application",
      label:
        STONE_APPLICATION_LABELS[
          filters.application as keyof typeof STONE_APPLICATION_LABELS
        ] ?? filters.application,
    });
  if (filters.form)
    activeChips.push({
      key: "form",
      label: STONE_FORM_LABELS[filters.form as keyof typeof STONE_FORM_LABELS] ?? filters.form,
    });
  if (filters.minPrice !== undefined)
    activeChips.push({
      key: "minPrice",
      label: `از ${filters.minPrice.toLocaleString("fa-IR")} تومان`,
    });
  if (filters.maxPrice !== undefined)
    activeChips.push({
      key: "maxPrice",
      label: `تا ${filters.maxPrice.toLocaleString("fa-IR")} تومان`,
    });
  if (filters.inStockOnly) activeChips.push({ key: "inStockOnly", label: "فقط موجود" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {/* Search input */}
        <div className="border-b border-border p-4">
          <DialogTitle className="sr-only">جستجوی محصولات</DialogTitle>
          <DialogDescription className="sr-only">
            جستجو در محصولات و اعمال فیلترهای سنگ
          </DialogDescription>

          <div className="relative">
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در سنگ ها… (نام، نوع، رنگ، معدن و…)"
              className="h-11 pr-9 pl-24"
              aria-label="عبارت جستجو"
            />
            {hasQuery && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="پاک کردن عبارت جستجو"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable body: filters + live results */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {/* Filters */}
          <div className="mb-4 space-y-3 rounded-lg border border-border bg-muted/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                فیلترهای سنگ
              </p>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                >
                  پاک کردن فیلترها ({activeFilterCount.toLocaleString("fa-IR")})
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <FilterSelect
                label="نوع سنگ"
                value={filters.stoneType}
                options={STONE_TYPE_LABELS}
                onChange={(v) => setFilter("stoneType", v)}
              />
              <FilterSelect
                label="رنگ"
                value={filters.color}
                options={STONE_COLOR_LABELS}
                onChange={(v) => setFilter("color", v)}
              />
              <FilterSelect
                label="پرداخت سطح"
                value={filters.finish}
                options={STONE_FINISH_LABELS}
                onChange={(v) => setFilter("finish", v)}
              />
              <FilterSelect
                label="کاربرد"
                value={filters.application}
                options={STONE_APPLICATION_LABELS}
                onChange={(v) => setFilter("application", v)}
              />
              <FilterSelect
                label="فرم / ابعاد"
                value={filters.form}
                options={STONE_FORM_LABELS}
                onChange={(v) => setFilter("form", v)}
              />

              {/* Price range */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  محدوده قیمت (تومان)
                </Label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="از"
                    value={filters.minPrice ?? ""}
                    onChange={(e) =>
                      setFilter(
                        "minPrice",
                        e.target.value === "" ? undefined : Number(e.target.value)
                      )
                    }
                    className="h-8 text-xs"
                    aria-label="حداقل قیمت"
                  />
                  <span className="text-xs text-muted-foreground">—</span>
                  <Input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="تا"
                    value={filters.maxPrice ?? ""}
                    onChange={(e) =>
                      setFilter(
                        "maxPrice",
                        e.target.value === "" ? undefined : Number(e.target.value)
                      )
                    }
                    className="h-8 text-xs"
                    aria-label="حداکثر قیمت"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <label className="flex w-fit cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.inStockOnly ?? false}
                onChange={(e) => setFilter("inStockOnly", e.target.checked || undefined)}
                className="size-4 accent-[var(--primary)]"
              />
              فقط کالاهای موجود
            </label>

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {activeChips.map((chip) => (
                  <Badge
                    key={chip.key}
                    variant="secondary"
                    className="gap-1 pr-1.5 font-normal"
                  >
                    {chip.label}
                    <button
                      type="button"
                      aria-label={`حذف فیلتر ${chip.label}`}
                      onClick={() => setFilter(chip.key, undefined)}
                      className="rounded-full p-0.5 transition-colors hover:bg-foreground/10"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Results header */}
          <p className="mb-2 text-xs text-muted-foreground">
            {results.length.toLocaleString("fa-IR")} نتیجه
          </p>

          {/* No-result state */}
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Search className="size-8 text-muted-foreground/50" />
              <p className="text-sm font-medium">نتیجه ای یافت نشد</p>
              <p className="text-xs text-muted-foreground">
                عبارت دیگری را امتحان کنید یا فیلترها را تغییر دهید.
              </p>
              {(hasQuery || activeFilterCount > 0) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  پاک کردن فیلترها
                </Button>
              )}
            </div>
          ) : (
            /* Live results */
            <ul className="space-y-2">
              {results.map((product) => {
                const image =
                  product.images.find((img) => img.isPrimary) ?? product.images[0];
                return (
                  <li key={product.id}>
                    <Link
                      href={`/stones/${product.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="group flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-border hover:bg-accent/50"
                    >
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                        {image && (
                          <Image
                            src={image.url}
                            alt={image.alt || product.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {product.origin}
                        </p>
                      </div>
                      <div className="shrink-0 text-left">
                        {product.price !== undefined && (
                          <p className="text-sm font-bold tabular-nums">
                            {product.price.toLocaleString("fa-IR")}
                          </p>
                        )}
                        <p
                          className={cn(
                            "text-[11px]",
                            isInStock(product)
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground"
                          )}
                        >
                          {isInStock(product) ? "موجود" : "ناموجود"}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}