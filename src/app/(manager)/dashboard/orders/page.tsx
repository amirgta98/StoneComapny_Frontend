"use client";

import { Suspense } from "react";
import { OrdersManagerView } from "@/features/orders";
import { withAuthGuard } from "@/auth";

/**
 * /dashboard/orders — Factory Owner & Tenant Manager Orders Management.
 *
 * Dedicated to tracking and managing stone orders, production stages (sourcing, cutting,
 * surface processing, palletizing, shipping), dispatch waybills, and logistics scoping.
 */
function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری لیست سفارش‌های کارخانه...
        </div>
      }
    >
      <OrdersManagerView />
    </Suspense>
  );
}

export const GuardedOrdersPage = withAuthGuard(OrdersPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedOrdersPage;
