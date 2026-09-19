"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui";
import { useCartStore } from "@/stores";

/**
 * Empty-cart illustration with an action that points back to the catalog.
 */
export function CartEmptyState() {
  const closeCart = useCartStore((s) => s.closeCart);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <ShoppingBag className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>

      <div>
        <h3 className="text-base font-bold">سبد خرید شما خالی است</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          هنوز سنگی به سبد خرید اضافه نکرده‌اید. از میان محصولات ما انتخاب کنید.
        </p>
      </div>

      <Button size="lg" asChild onClick={closeCart}>
        <Link href="/collections">مشاهده محصولات</Link>
      </Button>
    </div>
  );
}