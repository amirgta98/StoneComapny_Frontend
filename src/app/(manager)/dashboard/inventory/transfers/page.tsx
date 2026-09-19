"use client";

import { Suspense } from "react";
import { StockTransfersView } from "@/features/inventory";
import { withAuthGuard } from "@/auth";

function StockTransfersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری انتقالات بین موقعیت‌های انبار...
        </div>
      }
    >
      <StockTransfersView />
    </Suspense>
  );
}

export const GuardedStockTransfersPage = withAuthGuard(StockTransfersPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedStockTransfersPage;
