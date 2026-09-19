"use client";

import { Suspense } from "react";
import { CustomersManagerView } from "@/features/customers";
import { withAuthGuard } from "@/auth";

/**
 * /dashboard/customers — Factory Owner & Tenant Manager Customers & B2B Contractors.
 *
 * Hybrid management of project contractors, architectural designers, stone showrooms,
 * and retail buyers with credit limits, financial ledgers, and preferred stone varieties.
 */
function CustomersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری کارتابل مشتریان و پیمانکاران کارخانه...
        </div>
      }
    >
      <CustomersManagerView />
    </Suspense>
  );
}

export const GuardedCustomersPage = withAuthGuard(CustomersPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedCustomersPage;
