"use client";

import { Suspense } from "react";
import { StockReservationsView } from "@/features/inventory";
import { withAuthGuard } from "@/auth";

function StockReservationsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری رزروهای سنگ و اسلب...
        </div>
      }
    >
      <StockReservationsView />
    </Suspense>
  );
}

export const GuardedStockReservationsPage = withAuthGuard(StockReservationsPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedStockReservationsPage;
