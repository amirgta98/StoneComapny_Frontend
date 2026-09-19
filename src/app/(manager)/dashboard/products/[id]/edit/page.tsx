"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/features/products";
import { withAuthGuard } from "@/auth";

function EditProductPageInner() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  return <ProductForm productId={id} />;
}

/**
 * /dashboard/products/[id]/edit — Edit Stone Product page.
 */
function EditProductPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground" dir="rtl">
          در حال بارگذاری فرم ویرایش سنگ...
        </div>
      }
    >
      <EditProductPageInner />
    </Suspense>
  );
}

export const GuardedEditProductPage = withAuthGuard(EditProductPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedEditProductPage;
