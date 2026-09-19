"use client";

import { ShoppingCart } from "lucide-react";

import { useCartStore } from "@/stores";
import { useMounted } from "@/hooks";
import { formatPrice } from "@/features/products/lib/product-price";
import { getCartSubtotal } from "../lib/cart-totals";

/**
 * Navbar cart button — opens the cart drawer.
 *
 * Shows the total item count as a badge and the cart subtotal next to the
 * icon. Values are only rendered after mount because the cart is persisted
 * in the browser (zustand/persist) and would otherwise mismatch SSR output.
 */
export function CartTrigger() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const openCart = useCartStore((s) => s.openCart);
  const totalItems = useCartStore((s) => s.totalItems);
  const mounted = useMounted();

  const count = mounted ? totalItems() : 0;
  const subtotal = mounted ? getCartSubtotal(items) : 0;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="باز کردن سبد خرید"
      aria-expanded={isOpen}
      className="relative flex items-center gap-2 rounded-md bg-primary px-2 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
    >
      <span className="relative">
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
        {count > 0 && (
          <span className="absolute -left-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-foreground px-1 text-[10px] font-bold leading-none text-primary shadow-sm">
            {count.toLocaleString("fa-IR")}
          </span>
        )}
      </span>

      <span className="hidden text-sm tabular-nums sm:inline">
        {formatPrice(subtotal)} تومان
      </span>
    </button>
  );
}