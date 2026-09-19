"use client";

import { Search, X, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { TechnicalDocumentType } from "../../types/document";

export type DocumentCategoryFilter = "all" | TechnicalDocumentType;

interface ProductOption {
  id: string;
  name: string;
}

interface DocumentFilterBarProps {
  activeCategory: DocumentCategoryFilter;
  onSelectCategory: (category: DocumentCategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedProductId: string;
  onProductChange: (productId: string) => void;
  productOptions: ProductOption[];
  counts: Record<DocumentCategoryFilter, number>;
}

const CATEGORY_TABS: { key: DocumentCategoryFilter; label: string }[] = [
  { key: "all", label: "همه اسناد" },
  { key: "quality_certificate", label: "گواهی کیفیت و اصالت (QC)" },
  { key: "spec_sheet", label: "برگه مشخصات فنی (TDS)" },
];

export function DocumentFilterBar({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedProductId,
  onProductChange,
  productOptions,
  counts,
}: DocumentFilterBarProps) {
  return (
    <div className="space-y-3.5">
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.key;
          const count = counts[tab.key] ?? 0;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectCategory(tab.key)}
              className={cn(
                "relative inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background/80 text-foreground"
                )}
              >
                {count.toLocaleString("fa-IR")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input & Product Selector */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="جستجو بر اساس نام سنگ، کد سند، شماره سفارش یا معدن..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 pe-8 ps-9 text-xs rounded-xl"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onSearchChange("")}
              className="absolute end-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">پاک کردن جستجو</span>
            </Button>
          )}
        </div>

        {/* Product Filter Selector */}
        {productOptions.length > 0 && (
          <div className="w-full sm:w-[220px]">
            <Select value={selectedProductId} onValueChange={onProductChange}>
              <SelectTrigger className="h-9 text-xs rounded-xl border-border">
                <div className="flex items-center gap-1.5 truncate">
                  <Layers className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <SelectValue placeholder="همه سنگ‌های خریداری‌شده" />
                </div>
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="all">همه سنگ‌های خریداری‌شده</SelectItem>
                {productOptions.map((prod) => (
                  <SelectItem key={prod.id} value={prod.id}>
                    {prod.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
