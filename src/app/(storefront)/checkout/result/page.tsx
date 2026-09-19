"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function ResultPageInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const reason =
    searchParams.get("reason") ||
    "تراکنش توسط کاربر لغو گردید یا ارتباط با درگاه بانکی برقرار نشد.";

  return (
    <div className="mx-auto max-w-2xl py-12 sm:py-16 px-4 text-center">
      <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 sm:p-12 shadow-xs space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <XCircle className="h-12 w-12 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            پرداخت انجام نشد
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            {reason}
          </p>
          {orderId && (
            <p className="text-xs text-muted-foreground pt-1 font-mono">
              شناسه سفارش: {orderId}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild size="lg" className="w-full sm:w-auto gap-2 text-xs sm:text-sm shadow-xs">
            <Link href="/checkout">
              <RotateCcw className="h-4 w-4" />
              <span>تلاش مجدد برای پرداخت سفارش</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-xs sm:text-sm">
            <Link href="/account/orders">
              <span>مشاهده سفارش‌ها در پنل</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ResultPageInner />
    </Suspense>
  );
}
