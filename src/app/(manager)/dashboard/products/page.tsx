"use client";

import { Suspense } from "react";
import { ProductsManagerView } from "@/features/products";
import { withAuthGuard } from "@/auth";

/**
 * /dashboard/products — Stone Products & Slabs Catalog Management for Factory Owner / Manager.
 *
 * Scoped strictly to the active tenant. Allows filtering, adding, editing, duplicating, and deleting products.
 */
function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری کاتالوگ سنگ‌ها...
        </div>
      }
    >
      <ProductsManagerView />
    </Suspense>
  );
}

export const GuardedProductsPage = withAuthGuard(ProductsPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedProductsPage;
