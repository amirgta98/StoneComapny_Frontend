"use client";

import Link from "next/link";
import { MessageSquareOff, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InquiriesEmptyStateProps {
  isFiltered: boolean;
  onResetFilters?: () => void;
}

export function InquiriesEmptyState({
  isFiltered,
  onResetFilters,
}: InquiriesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/60 px-4 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/70 text-muted-foreground">
        <MessageSquareOff className="h-7 w-7 stroke-[1.5]" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-foreground sm:text-base">
        {isFiltered
          ? "استعلامی با فیلترهای مشخص‌شده یافت نشد"
          : "هنوز استعلام سنگی ثبت نکرده‌اید"}
      </h3>

      <p className="mt-1.5 max-w-md text-xs text-muted-foreground leading-relaxed">
        {isFiltered
          ? "عبارت جستجو یا تب وضعیت انتخاب‌شده را تغییر دهید یا بازنشانی کنید."
          : "اگر سنگ، اسلب یا تایل موردنظر شما در کاتالوگ سایت موجود نیست، می‌توانید مشخصات و متراژ مورد نیاز خود را ثبت کنید تا کارشناسان فروش قیمت و شرایط تأمین را بررسی و به شما اعلام نمایند."}
      </p>

      <div className="mt-5 flex items-center gap-2.5">
        {isFiltered ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="gap-1.5 rounded-xl text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            پاک‌کردن فیلترها
          </Button>
        ) : (
          <Button asChild size="sm" className="gap-1.5 rounded-xl text-xs">
            <Link href="/account/inquiries/new">
              <Plus className="h-4 w-4" />
              ثبت استعلام جدید
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
