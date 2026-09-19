"use client";

import { Suspense } from "react";
import { InventoryDashboardView } from "@/features/inventory";
import { withAuthGuard } from "@/auth";

function InventoryDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری داشبورد انبار کارخانه...
        </div>
      }
    >
      <InventoryDashboardView />
    </Suspense>
  );
}

export const GuardedInventoryDashboardPage = withAuthGuard(InventoryDashboardPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedInventoryDashboardPage;
