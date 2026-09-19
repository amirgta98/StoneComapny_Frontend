"use client";

import { Suspense } from "react";
import { InventoryReportsView } from "@/features/inventory";
import { withAuthGuard } from "@/auth";

function InventoryReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری گزارشات مالی و ارزش‌گذاری انبار...
        </div>
      }
    >
      <InventoryReportsView />
    </Suspense>
  );
}

export const GuardedInventoryReportsPage = withAuthGuard(InventoryReportsPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedInventoryReportsPage;
