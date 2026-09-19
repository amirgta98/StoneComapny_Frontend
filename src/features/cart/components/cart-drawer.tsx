"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ShoppingCart, X } from "lucide-react";

import { Button } from "@/components/ui";
import { useCartStore } from "@/stores";
import { useMounted } from "@/hooks";
import { cn } from "@/lib/utils";

import { CartItemRow } from "./cart-item-row";
import { CartEmptyState } from "./cart-empty-state";
import { CartSummary } from "./cart-summary";

/**
 * Cart sidebar — slides in from the right (RTL) with a dimmed overlay.
 *
 * Mirrors the storefront `MobileNav` drawer pattern: fixed `right-0` panel,
 * closed state translated fully off-screen (`translate-x-full`), `duration-300`
 * transition, and body scroll locked while open. Content (items, summary,
 * checkout CTA) only renders after mount because the cart is persisted in
 * the browser and is unavailable during server/static rendering.
 */
export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems);
  const closeCart = useCartStore((s) => s.closeCart);
  const mounted = useMounted();
  const pathname = usePathname();

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  // Close when navigating to another route (e.g. a product inside the cart).
  const pathnameRef = useRef<string | null>(null);
  useEffect(() => {
    const previous = pathnameRef.current;
    pathnameRef.current = pathname;
    if (isOpen && previous !== null && previous !== pathname) closeCart();
  }, [pathname, isOpen, closeCart]);

  // Trigger keeps its own toggle; the drawer is hidden until the client opens it.
  const count = mounted ? totalItems() : 0;

  return (
    <>
      {/* Dimmed overlay (does not cover the panel) */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="سبد خرید"
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col shadow-xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-4 py-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            <h2 className="text-base font-bold">سبد خرید</h2>
            {count > 0 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                {count.toLocaleString("fa-IR")} قلم
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="بستن سبد خرید"
            className="rounded-md p-2 transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        {mounted && items.length === 0 ? (
          <CartEmptyState />
        ) : mounted ? (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {items.map((item) => (
                <CartItemRow
                  key={`${item.productId}-${item.variantId ?? "default"}`}
                  item={item}
                />
              ))}
            </ul>

            <CartSummary />

            {/* Checkout CTA (page is built separately) */}
            <div className="border-t border-border px-4 py-4">
              <Button size="lg" asChild className="w-full">
                <Link href="/checkout" onClick={closeCart}>
                  نهایی‌سازی خرید
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                پرداخت امن · ارسال سریع
              </p>
            </div>
          </>
        ) : (
          /* Pre-hydration placeholder — invisible while the drawer is closed. */
          <div className="flex-1" />
        )}
      </aside>
    </>
  );
}