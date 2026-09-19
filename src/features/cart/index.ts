/**
 * Cart feature.
 *
 * Client cart state lives in `stores/cart-store` (Zustand + persist).
 * `lib/cart-totals` holds the pure cart math (subtotal / shipping / tax)
 * so it can later be replaced by real backend values without touching
 * any UI component. The drawer and trigger are the only entry points.
 */
export { CartTrigger } from "./components/cart-trigger";
export { CartDrawer } from "./components/cart-drawer";
export { CartItemRow } from "./components/cart-item-row";
export { CartSummary } from "./components/cart-summary";
export { CartEmptyState } from "./components/cart-empty-state";
export {
  getCartLineTotal,
  getCartSubtotal,
  getCartShipping,
  getCartTax,
  getCartTotals,
  type CartTotals,
} from "./lib/cart-totals";
export type { CartItem } from "@/stores";