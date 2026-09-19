"use client";

import Link from "next/link";
import { PackageOpen, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderEmptyStateProps {
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export function OrderEmptyState({
  isFiltered = false,
  onResetFilters,
}: OrderEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/15 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground shadow-inner">
        <PackageOpen className="h-8 w-8 stroke-[1.5]" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-foreground sm:text-lg">
        {isFiltered
          ? "سفارشی با این مشخصات یافت نشد"
          : "هنوز سفارشی در این بخش ثبت نکرده‌اید"}
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
        {isFiltered
          ? "می‌توانید عبارت جستجو یا دسته‌بندی فیلتر را تغییر دهید تا سفارش‌های خود را مشاهده کنید."
          : "انواع سنگ‌های ساختمانی مرغوب، اسلب و تایل را در کاتالوگ جامع سنگ بررسی کرده و سفارش دهید."}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {isFiltered && onResetFilters ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            پاک کردن فیلترها
          </Button>
        ) : null}

        <Button asChild size="sm" className="gap-1.5 text-xs">
          <Link href="/stones">
            مشاهده محصولات و شروع خرید
            <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
