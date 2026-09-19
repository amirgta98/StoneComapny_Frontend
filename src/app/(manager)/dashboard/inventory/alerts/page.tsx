"use client";

import { Suspense } from "react";
import { InventoryAlertsView } from "@/features/inventory";
import { withAuthGuard } from "@/auth";

function InventoryAlertsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری مرکز پایش و هشدارهای انبار...
        </div>
      }
    >
      <InventoryAlertsView />
    </Suspense>
  );
}

export const GuardedInventoryAlertsPage = withAuthGuard(InventoryAlertsPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedInventoryAlertsPage;
