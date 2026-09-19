"use client";

import { useCartStore } from "@/stores";
import { formatPrice } from "@/features/products/lib/product-price";
import { getCartTotals } from "../lib/cart-totals";

/**
 * Order summary block: subtotal, shipping, tax and the grand total.
 * Values come from the pure `cart-totals` layer so they can later be
 * replaced by backend-computed figures without touching this component.
 */
export function CartSummary() {
  const items = useCartStore((s) => s.items);
  const totals = getCartTotals(items);

  return (
    <div className="border-t border-border px-4 py-4">
      <dl className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">جمع جزء</dt>
          <dd className="font-medium tabular-nums">
            {formatPrice(totals.subtotal)} تومان
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">هزینه ارسال</dt>
          <dd className="font-medium tabular-nums">
            {totals.shipping === 0 ? (
              <span className="text-primary">رایگان</span>
            ) : (
              `${formatPrice(totals.shipping)} تومان`
            )}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">مالیات</dt>
          <dd className="font-medium tabular-nums">
            {formatPrice(totals.tax)} تومان
          </dd>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-2 text-base font-bold">
          <dt>جمع نهایی</dt>
          <dd className="tabular-nums">{formatPrice(totals.total)} تومان</dd>
        </div>
      </dl>
    </div>
  );
}