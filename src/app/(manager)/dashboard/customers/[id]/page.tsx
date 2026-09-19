"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { CustomerDetailView } from "@/features/customers";
import { withAuthGuard } from "@/auth";

function CustomerDetailPageInner() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const id = rawId ? decodeURIComponent(rawId) : "";

  return <CustomerDetailView customerId={id} />;
}

/**
 * /dashboard/customers/[id] — Dedicated Customer & B2B Contractor Profile.
 */
function CustomerDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری پرونده مشتری...
        </div>
      }
    >
      <CustomerDetailPageInner />
    </Suspense>
  );
}

export const GuardedCustomerDetailPage = withAuthGuard(CustomerDetailPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedCustomerDetailPage;
