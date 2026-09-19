"use client";

import { Suspense } from "react";
import { StockAdjustmentsView } from "@/features/inventory";
import { withAuthGuard } from "@/auth";

function StockAdjustmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری اسناد تعدیل موجودی و ضایعات...
        </div>
      }
    >
      <StockAdjustmentsView />
    </Suspense>
  );
}

export const GuardedStockAdjustmentsPage = withAuthGuard(StockAdjustmentsPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedStockAdjustmentsPage;
