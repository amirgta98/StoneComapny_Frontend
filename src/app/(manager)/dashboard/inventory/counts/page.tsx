"use client";

import { Suspense } from "react";
import { StockCountsView } from "@/features/inventory";
import { withAuthGuard } from "@/auth";

function StockCountsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری انبارگردانی و تطبیق فیزیکی...
        </div>
      }
    >
      <StockCountsView />
    </Suspense>
  );
}

export const GuardedStockCountsPage = withAuthGuard(StockCountsPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedStockCountsPage;
