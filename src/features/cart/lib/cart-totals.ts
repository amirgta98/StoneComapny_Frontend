import type { CartItem } from "@/stores/cart-store";

/**
 * Pure cart math, intentionally kept separate from UI components.
 *
 * When the backend is ready, only these functions need to be re-implemented
 * (or delegated to the cart/checkout API) — no component changes required.
 */

/** Subtotal of a single cart line (unit price × quantity). */
export function getCartLineTotal(item: CartItem): number {
  return (item.price ?? 0) * item.quantity;
}

/** Sum of every line in the cart. */
export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getCartLineTotal(item), 0);
}

/* ---------------------------------------------------------------------- */
/*  Shipping & tax — placeholders until the backend exposes real values    */
/* ---------------------------------------------------------------------- */

/**
 * Placeholder shipping fee (in Toman).
 *
 * TODO(backend): replace with the value returned by the real cart/checkout
 * API once available.
 */
export function getCartShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  // Mock rule: free shipping on orders ≥ 5,000,000 تومان, flat fee otherwise.
  return subtotal >= 5_000_000 ? 0 : 250_000;
}

/**
 * Placeholder tax amount (in Toman).
 *
 * TODO(backend): replace with the value returned by the real cart/checkout
 * API once available.
 */
export function getCartTax(subtotal: number): number {
  if (subtotal <= 0) return 0;
  // Mock rule: 9% value-added tax, rounded to the nearest Toman.
  return Math.round(subtotal * 0.09);
}

export type CartTotals = {
  /** جمع جزء — sum of all line totals. */
  subtotal: number;
  /** هزینه ارسال. */
  shipping: number;
  /** مالیات. */
  tax: number;
  /** جمع نهایی = subtotal + shipping + tax. */
  total: number;
};

/** Full order summary used by the cart sidebar. */
export function getCartTotals(items: CartItem[]): CartTotals {
  const subtotal = getCartSubtotal(items);
  const shipping = getCartShipping(subtotal);
  const tax = getCartTax(subtotal);

  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}