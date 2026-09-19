"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

import { useProductSearch } from "../hooks/use-product-search";
import { ProductSearchModal } from "./product-search-modal";
import type { Product } from "@/types";

type ProductSearchBarProps = {
  products: Product[];
  className?: string;
};

/**
 * Visible search bar at the top of the product list.
 *
 * Clicking or focusing the bar opens the advanced search modal with
 * the input auto-focused and the previous query/filters restored.
 * The bar itself reflects the shared state: current query text and
 * the number of active filters.
 */
export function ProductSearchBar({ products, className }: ProductSearchBarProps) {
  const [open, setOpen] = useState(false);

  const { query, setQuery, activeFilterCount } = useProductSearch(products);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        aria-label="جستجوی محصولات و فیلترها"
        className={cn(
          "group flex h-11 w-full cursor-text items-center gap-2 rounded-lg border border-input bg-background px-3 text-start shadow-sm transition-colors hover:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          className
        )}
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />

        {/* Mirrors the shared query so it persists across modal open/close */}
        {query ? (
          <span className="min-w-0 flex-1 truncate text-sm">{query}</span>
        ) : (
          <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
            جستجو در سنگ ها… (نام، نوع، رنگ، معدن و…)
          </span>
        )}

        {query && (
          <span
            role="button"
            tabIndex={0}
            aria-label="پاک کردن عبارت جستجو"
            onClick={(e) => {
              e.stopPropagation();
              setQuery("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                setQuery("");
              }
            }}
            className="rounded-sm p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </span>
        )}

        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="shrink-0 gap-1 font-normal">
            <SlidersHorizontal className="size-3" />
            {activeFilterCount.toLocaleString("fa-IR")} فیلتر فعال
          </Badge>
        )}
      </button>

      <ProductSearchModal products={products} open={open} onOpenChange={setOpen} />
    </>
  );
}