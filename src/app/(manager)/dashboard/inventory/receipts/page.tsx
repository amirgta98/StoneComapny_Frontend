"use client";

import { Suspense } from "react";
import { StockReceiptsView } from "@/features/inventory";
import { withAuthGuard } from "@/auth";

function StockReceiptsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری رسیدهای ورود به انبار...
        </div>
      }
    >
      <StockReceiptsView />
    </Suspense>
  );
}

export const GuardedStockReceiptsPage = withAuthGuard(StockReceiptsPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedStockReceiptsPage;
