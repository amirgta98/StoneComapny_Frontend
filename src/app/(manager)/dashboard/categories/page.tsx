"use client";

import { Suspense } from "react";
import { CategoriesManagerView } from "@/features/categories";
import { withAuthGuard } from "@/auth";

/**
 * /dashboard/categories — Hierarchical Category Management for Factory Owner / Manager.
 *
 * Supports nested parent-child categories up to a maximum depth of 4 levels.
 * Guarded by RBAC: only MANAGER (and SUPER_ADMIN) are permitted.
 */
function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری درخت دسته‌بندی‌ها...
        </div>
      }
    >
      <CategoriesManagerView />
    </Suspense>
  );
}

export const GuardedCategoriesPage = withAuthGuard(CategoriesPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedCategoriesPage;
