"use client";

import { Suspense } from "react";
import { InventoryProductsView } from "@/features/inventory";
import { withAuthGuard } from "@/auth";

function InventoryProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری لیست موجودی سنگ‌ها و اسلب‌ها...
        </div>
      }
    >
      <InventoryProductsView />
    </Suspense>
  );
}

export const GuardedInventoryProductsPage = withAuthGuard(InventoryProductsPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedInventoryProductsPage;
