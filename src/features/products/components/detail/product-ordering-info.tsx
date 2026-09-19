import { Package, Ruler, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { InventoryUnit } from "@/constants";

import { PRICING_UNIT_LABELS, stoneLabel } from "../../constants";
import type { ProductDetail } from "../../types";

const INVENTORY_UNIT_LABELS: Record<InventoryUnit, string> = {
  sqm: "متر مربع",
  slab: "اسلب",
  ton: "تن",
  piece: "عدد",
};

type OrderingRow = {
  icon: LucideIcon;
  label: string;
  value: string;
};

type ProductOrderingInfoProps = {
  product: ProductDetail;
  className?: string;
};

/**
 * Ordering / shipping information.
 *
 * Renders only the commercial facts that actually exist in the data
 * model (minimum order, sales unit, stock) — nothing is fabricated.
 * Hides itself entirely when no ordering data is present.
 */
export function ProductOrderingInfo({
  product,
  className,
}: ProductOrderingInfoProps) {
  const pricingUnitLabel = stoneLabel(PRICING_UNIT_LABELS, product.pricingUnit);
  const stock = product.variants[0]?.inventory;
  const inventoryUnitLabel = stoneLabel(
    INVENTORY_UNIT_LABELS as Record<string, string>,
    product.inventoryUnit
  );

  const rows: OrderingRow[] = [];
  if (product.purchase?.minQuantity) {
    rows.push({
      icon: Scale,
      label: "حداقل سفارش",
      value: `${product.purchase.minQuantity.toLocaleString("fa-IR")}${
        pricingUnitLabel ? ` ${pricingUnitLabel}` : ""
      }`,
    });
  }
  if (pricingUnitLabel) {
    rows.push({
      icon: Ruler,
      label: "واحد فروش",
      value: pricingUnitLabel,
    });
  }
  if (stock !== undefined) {
    rows.push({
      icon: Package,
      label: "موجودی انبار",
      value: `${stock.toLocaleString("fa-IR")}${
        inventoryUnitLabel ? ` ${inventoryUnitLabel}` : ""
      }`,
    });
  }

  if (rows.length === 0) return null;

  return (
    <ul className={"grid gap-4 sm:grid-cols-2 lg:grid-cols-3 " + (className ?? "")}>
      {rows.map((row) => (
        <li
          key={row.label}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
        >
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary"
          >
            <row.icon className="size-5" strokeWidth={1.75} />
          </span>
          <span>
            <span className="block text-xs text-muted-foreground">
              {row.label}
            </span>
            <span className="mt-0.5 block text-sm font-bold tabular-nums">
              {row.value}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}