"use client";

import { Suspense } from "react";
import { StockIssuesView } from "@/features/inventory";
import { withAuthGuard } from "@/auth";

function StockIssuesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری حواله‌های خروج انبار...
        </div>
      }
    >
      <StockIssuesView />
    </Suspense>
  );
}

export const GuardedStockIssuesPage = withAuthGuard(StockIssuesPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedStockIssuesPage;
