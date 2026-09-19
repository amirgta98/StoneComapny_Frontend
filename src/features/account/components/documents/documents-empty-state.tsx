"use client";

import { FileX2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentsEmptyStateProps {
  isFiltered: boolean;
  onResetFilters: () => void;
}

export function DocumentsEmptyState({
  isFiltered,
  onResetFilters,
}: DocumentsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 px-4 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
        <FileX2 className="h-7 w-7 stroke-[1.5]" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-foreground sm:text-base">
        {isFiltered
          ? "هیچ سندی با فیلترهای مشخص‌شده یافت نشد"
          : "هنوز سندی برای محصولات خریداری‌شده صادر نشده است"}
      </h3>

      <p className="mt-1.5 max-w-sm text-xs text-muted-foreground">
        {isFiltered
          ? "عبارت جستجو یا فیلتر دسته‌بندی و محصول را تغییر دهید."
          : "پس از نهایی‌سازی برش، فرآوری و آزمایش‌های کنترل کیفیت سفارش، گواهینامه‌ها در این بخش قرار می‌گیرند."}
      </p>

      {isFiltered && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="mt-4 gap-1.5 rounded-xl text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          پاک‌کردن فیلترها
        </Button>
      )}
    </div>
  );
}
