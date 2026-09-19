"use client";

import { FileText, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { useCartStore } from "@/stores";

import {
  PRICING_UNIT_LABELS,
  stoneLabel,
} from "../../constants";
import { getPriceState, isPurchasable } from "../../lib/product-price";
import { ProductPrice } from "./product-price";
import type { ProductPurchaseDetail } from "../../types";

type MobileActionBarProps = {
  /** Serializable product view (features stripped — see ProductPurchaseDetail). */
  product: ProductPurchaseDetail;
};

/**
 * Mobile sticky action bar (Client Component, below `lg` only).
 *
 * Keeps the price and the primary conversion action reachable with the
 * thumb while scrolling. Respects the safe-area inset on notched
 * devices. Uses the same pricing logic and cart store as the main
 * purchase panel — no duplicated rules.
 */
export function MobileActionBar({ product }: MobileActionBarProps) {
  const addItem = useCartStore((s) => s.addItem);

  const defaultSellUnit =
    product.sellUnits?.find((u) => u.unit === product.pricingUnit) ??
    product.sellUnits?.[0];
  const unitLabel = stoneLabel(PRICING_UNIT_LABELS, defaultSellUnit?.unit ?? product.pricingUnit);
  const priceState = getPriceState(product, product.variants[0], defaultSellUnit);
  const purchasable = isPurchasable(priceState);
  const inquiryAction = product.quickActions.find((a) => a.kind === "link");

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: product.variants[0]?.id,
      name: product.name,
      slug: product.slug,
      image: product.images.find((img) => img.isPrimary)?.url,
      price: priceState.price,
      quantity: product.purchase?.minQuantity ?? 1,
      unit: unitLabel,
      sellUnit: defaultSellUnit?.unit,
    });
    toast.success("به سبد خرید اضافه شد", { description: product.name });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur lg:hidden">
      <div className="container mx-auto flex items-center gap-3 px-4 sm:px-6">
        {/* Price summary (compact) */}
        <div className="min-w-0 flex-1">
          <ProductPrice state={priceState} pricingUnit={defaultSellUnit?.unit ?? product.pricingUnit} />
        </div>

        {purchasable ? (
          <Button
            size="lg"
            className="shrink-0"
            onClick={handleAddToCart}
            aria-label="افزودن به سبد خرید"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            افزودن به سبد
          </Button>
        ) : priceState.kind === "contact" ? (
          <Button size="lg" asChild className="shrink-0">
            <a href={inquiryAction?.href ?? "#contact"}>
              <FileText className="size-4" aria-hidden="true" />
              استعلام قیمت
            </a>
          </Button>
        ) : (
          <Button size="lg" disabled className="shrink-0">
            ناموجود
          </Button>
        )}
      </div>
    </div>
  );
}