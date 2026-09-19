"use client";

import { Suspense } from "react";
import { DiscountsManagerView } from "@/features/discounts";
import { withAuthGuard } from "@/auth";

/**
 * /dashboard/discounts — Promotional discounts, coupons, and seasonal sales management.
 *
 * Guarded by RBAC: permits SUPER_ADMIN and MANAGER roles.
 */
function DiscountsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری بخش تخفیف‌ها و کوپن‌ها...
        </div>
      }
    >
      <DiscountsManagerView />
    </Suspense>
  );
}

export const GuardedDiscountsPage = withAuthGuard(DiscountsPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedDiscountsPage;
