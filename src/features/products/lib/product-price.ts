import type { Product, ProductVariant } from "@/types";
import type { ProductSellUnit } from "../types";

/**
 * Pricing state for a product (or a selected variant).
 *
 * The UI must clearly distinguish the four supported states:
 * - `regular`     → single active price
 * - `discounted`  → active price + compare-at (original) price + percent
 * - `contact`     → no price; "برای استعلام قیمت تماس بگیرید"
 * - `unavailable` → price exists but the (selected) variant is out of stock
 */
export type ProductPriceState = {
  kind: "regular" | "discounted" | "contact" | "unavailable";
  /** Active price in Toman (absent only in the `contact` state). */
  price?: number;
  /** Original/compare-at price, present only when discounted. */
  compareAtPrice?: number;
  /** Rounded discount percent (0 when not discounted). */
  offPercent: number;
  /** The sell unit this price belongs to (when a sell unit was selected. */
  unit?: ProductSellUnit["unit"];
};

/**
 * Resolve the pricing state from the product and (optionally) the
 * selected variant. Variant prices take precedence over product prices.
 * Stock is judged from the variant inventory when a variant is given.
 */
export function getPriceState(
  product: Pick<Product, "price" | "compareAtPrice">,
  variant?: Pick<ProductVariant, "price" | "compareAtPrice" | "inventory">,
  sellUnit?: ProductSellUnit
): ProductPriceState {
  const price = sellUnit?.price ?? variant?.price ?? product.price;

  /* When a sell unit is selected, only that unit's own compare-at price is
     meaningful — never fall back to another unit's discount. */
  const compareAtPrice = sellUnit
    ? sellUnit.compareAtPrice
    : variant?.compareAtPrice ?? product.compareAtPrice;
  const outOfStock = variant !== undefined && variant.inventory === 0;

  if (price === undefined) {
    return { kind: "contact", offPercent: 0, unit: sellUnit?.unit };
  }

  if (outOfStock) {
    return { kind: "unavailable", price, offPercent: 0, unit: sellUnit?.unit };
  }

  const offPercent =
    compareAtPrice !== undefined && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  return {
    kind: offPercent > 0 ? "discounted" : "regular",
    price,
    compareAtPrice: offPercent > 0 ? compareAtPrice : undefined,
    offPercent,
    unit: sellUnit?.unit,
  };
}

/** Persian-formatted price digits (e.g. ۲٫۴۵۰٫۰۰۰). */
export function formatPrice(value: number): string {
  return value.toLocaleString("fa-IR");
}

/** Whether a product (optionally per-variant) is purchasable right now. */
export type PurchasablePriceState = ProductPriceState & {
  kind: "regular" | "discounted";
};

export function isPurchasable(
  state: ProductPriceState
): state is PurchasablePriceState {
  return state.kind === "regular" || state.kind === "discounted";
}