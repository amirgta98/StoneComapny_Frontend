"use client";

import { Suspense } from "react";
import { AttributesManagerView } from "@/features/attributes";
import { withAuthGuard } from "@/auth";

/**
 * /dashboard/attributes — Extensible Stone Attributes & Finishes Management for Factory Owner / Manager.
 *
 * Manages surface finishes, ASTM lab physical test specs, thickness & dimensions standards,
 * sorting grades, and pricing variant drivers.
 * Guarded by RBAC: only MANAGER (and SUPER_ADMIN) are permitted.
 */
function AttributesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری مشخصات فنی و فینیش‌های کاتالوگ سنگ...
        </div>
      }
    >
      <AttributesManagerView />
    </Suspense>
  );
}

export const GuardedAttributesPage = withAuthGuard(AttributesPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedAttributesPage;
