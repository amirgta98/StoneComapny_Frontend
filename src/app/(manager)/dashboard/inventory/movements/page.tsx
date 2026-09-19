"use client";

import { Suspense } from "react";
import { InventoryKardexView } from "@/features/inventory";
import { withAuthGuard } from "@/auth";

function InventoryMovementsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری کاردکس و گردش انبار...
        </div>
      }
    >
      <InventoryKardexView />
    </Suspense>
  );
}

export const GuardedInventoryMovementsPage = withAuthGuard(InventoryMovementsPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedInventoryMovementsPage;
