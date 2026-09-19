"use client";

import Link from "next/link";
import { ShoppingBag, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyCartView() {
  return (
    <div className="mx-auto max-w-2xl py-16 sm:py-24 text-center px-4">
      <div className="rounded-3xl border border-dashed border-border bg-card p-8 sm:p-14 shadow-xs space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            سبد خرید شما در حال حاضر خالی است
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            محصول سنگی برای ثبت سفارش و پرداخت در سبد خرید یافت نشد. می‌توانید از کاتالوگ سنگ‌های طبیعی، اسلب‌ها و تایل‌های ساختمانی دیدن فرمایید.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild size="lg" className="w-full sm:w-auto gap-2 text-sm shadow-xs">
            <Link href="/stones">
              <Layers className="h-4 w-4" />
              <span>مشاهده کاتالوگ سنگ‌ها</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-sm">
            <Link href="/">
              <span>بازگشت به صفحه اصلی</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
