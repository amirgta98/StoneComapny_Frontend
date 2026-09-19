import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { PricingUnit } from "@/constants";

import { PRICING_UNIT_LABELS, stoneLabel } from "../../constants";
import { formatPrice, type ProductPriceState } from "../../lib/product-price";

type ProductPriceProps = {
  /** Resolved pricing state (see `getPriceState`). */
  state: ProductPriceState;
  /** Price unit shown after the amount (e.g. «متر مربع»). */
  pricingUnit?: PricingUnit;
  /** Visual size of the active price. */
  size?: "md" | "lg";
  className?: string;
};

/**
 * Presentational pricing block covering all four pricing states:
 * regular, discounted (original + final + percent), contact-for-price
 * and unavailable. Pure display — no hooks — so it can be used from
 * both server and client components (info panel, sticky mobile bar).
 */
export function ProductPrice({
  state,
  pricingUnit,
  size = "md",
  className,
}: ProductPriceProps) {
  const unitLabel = stoneLabel(PRICING_UNIT_LABELS, pricingUnit);

  /* Contact-for-price: no amount exists in the data. */
  if (state.kind === "contact") {
    return (
      <div className={className}>
        <p className={cn("font-bold", size === "lg" ? "text-xl" : "text-lg")}>
          برای استعلام قیمت تماس بگیرید
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          قیمت این محصول به‌صورت استعلامی محاسبه می‌شود.
        </p>
      </div>
    );
  }

  /* Unavailable: price exists but the selected variant is out of stock. */
  if (state.kind === "unavailable") {
    return (
      <div className={className}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            className={cn(
              "font-bold text-muted-foreground line-through decoration-muted-foreground/60",
              size === "lg" ? "text-xl" : "text-lg"
            )}
          >
            {formatPrice(state.price ?? 0)}
          </span>
          <Badge variant="destructive">ناموجود</Badge>
        </div>
        {unitLabel && (
          <p className="mt-1 text-xs text-muted-foreground">
            قیمت هر {unitLabel}
          </p>
        )}
      </div>
    );
  }

  /* Regular / discounted. */
  return (
    <div className={className}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className={cn(
            "font-bold tabular-nums",
            size === "lg" ? "text-2xl" : "text-xl"
          )}
        >
          {formatPrice(state.price ?? 0)}
          <span className="mr-1.5 text-xs font-normal text-muted-foreground">
            تومان
          </span>
        </span>

        {unitLabel && (
          <span className="text-xs text-muted-foreground">/ {unitLabel}</span>
        )}

        {state.compareAtPrice !== undefined && (
          <del className="text-sm tabular-nums text-muted-foreground decoration-muted-foreground/60">
            {formatPrice(state.compareAtPrice)}
          </del>
        )}

        {state.offPercent > 0 && (
          <Badge className="rounded-md bg-destructive px-1.5 py-0.5 text-[11px] font-bold text-destructive-foreground">
            ٪{state.offPercent.toLocaleString("fa-IR")}
          </Badge>
        )}
      </div>
    </div>
  );
}