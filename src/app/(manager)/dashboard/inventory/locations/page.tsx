"use client";

import { Suspense } from "react";
import { WarehouseLocationsView } from "@/features/inventory";
import { withAuthGuard } from "@/auth";

function WarehouseLocationsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری موقعیت‌ها و سوله‌های انبار...
        </div>
      }
    >
      <WarehouseLocationsView />
    </Suspense>
  );
}

export const GuardedWarehouseLocationsPage = withAuthGuard(WarehouseLocationsPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedWarehouseLocationsPage;
