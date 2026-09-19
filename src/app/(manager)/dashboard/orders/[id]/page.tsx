"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { OrderDetailView } from "@/features/orders";
import { withAuthGuard } from "@/auth";

function OrderDetailPageInner() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  return <OrderDetailView orderId={id} />;
}

/**
 * /dashboard/orders/[id] — Dedicated Order Details & Production Stepper view.
 */
function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری جزئیات سفارش سنگ...
        </div>
      }
    >
      <OrderDetailPageInner />
    </Suspense>
  );
}

export const GuardedOrderDetailPage = withAuthGuard(OrderDetailPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedOrderDetailPage;
