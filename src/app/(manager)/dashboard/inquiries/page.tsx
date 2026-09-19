"use client";

import { Suspense } from "react";
import { InquiriesManagerView } from "@/features/inquiries";
import { withAuthGuard } from "@/auth";

/**
 * /dashboard/inquiries — Factory Owner & Tenant Manager Architectural RFQ Management.
 *
 * Dedicated to managing stone quotation requests, volume inquiries from architects
 * and contractors, issuing formal pre-invoices, and conversion to active orders.
 */
function InquiriesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری کارتابل استعلام‌های کارخانه...
        </div>
      }
    >
      <InquiriesManagerView />
    </Suspense>
  );
}

export const GuardedInquiriesPage = withAuthGuard(InquiriesPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedInquiriesPage;
