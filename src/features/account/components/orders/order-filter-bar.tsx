"use client";

import {
  Search,
  X,
  ArrowUpDown,
  ChevronsUpDown,
  SlidersHorizontal,
} from "lucide-react";
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
import type { OrderCategory } from "../../data/mock-data";

export type OrderSortOption =
  | "newest"
  | "oldest"
  | "highest_price"
  | "lowest_price";

interface OrderFilterBarProps {
  activeCategory: OrderCategory;
  onSelectCategory: (category: OrderCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: Record<OrderCategory, number>;
  sortOrder: OrderSortOption;
  onSortChange: (sort: OrderSortOption) => void;
  allExpanded: boolean;
  onToggleExpandAll: () => void;
}

const CATEGORY_TABS: { key: OrderCategory; label: string }[] = [
  { key: "all", label: "همه سفارش‌ها" },
  { key: "processing", label: "در حال پردازش و برش" },
  { key: "shipping", label: "در حال ارسال و باربری" },
  { key: "completed", label: "تحویل‌شده به پروژه" },
  { key: "cancelled", label: "لغو یا مرجوعی" },
];

export function OrderFilterBar({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  counts,
  sortOrder,
  onSortChange,
  allExpanded,
  onToggleExpandAll,
}: OrderFilterBarProps) {
  return (
    <div className="space-y-3.5">
      {/* Category Tabs */}
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

      {/* Controls Bar: Search + Sort + Expand/Collapse All */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="جستجو بر اساس شماره سفارش، نام سنگ یا بارنامه..."
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

        {/* Filters and Controls Group */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Sort Selector */}
          <div className="w-[140px] sm:w-[155px]">
            <Select
              value={sortOrder}
              onValueChange={(val) => onSortChange(val as OrderSortOption)}
            >
              <SelectTrigger className="h-9 text-xs rounded-xl border-border">
                <div className="flex items-center gap-1.5 truncate">
                  <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <SelectValue placeholder="مرتب‌سازی" />
                </div>
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="newest">جدیدترین سفارش</SelectItem>
                <SelectItem value="oldest">قدیمی‌ترین سفارش</SelectItem>
                <SelectItem value="highest_price">بیشترین مبلغ</SelectItem>
                <SelectItem value="lowest_price">کمترین مبلغ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toggle Expand / Collapse All Accordions */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleExpandAll}
            className="h-9 gap-1.5 rounded-xl border-border px-3 text-xs text-muted-foreground hover:text-foreground"
            title={allExpanded ? "بستن همه کارت‌ها" : "باز کردن همه کارت‌ها"}
          >
            <ChevronsUpDown className="h-3.5 w-3.5" />
            <span className="hidden xs:inline sm:inline">
              {allExpanded ? "بستن همه" : "باز کردن همه"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
