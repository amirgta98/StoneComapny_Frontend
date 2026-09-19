"use client";

import { Suspense } from "react";
import { ProductForm } from "@/features/products";
import { withAuthGuard } from "@/auth";

/**
 * /dashboard/products/new — Create New Stone Product page.
 */
function NewProductPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری فرم ثبت سنگ...
        </div>
      }
    >
      <ProductForm />
    </Suspense>
  );
}

export const GuardedNewProductPage = withAuthGuard(NewProductPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedNewProductPage;
