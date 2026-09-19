"use client";

import { useMemo, useState } from "react";
import { Check, FileText, Heart, Minus, Phone, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button, Badge, Input } from "@/components/ui";
import { useCartStore, useFavoritesStore } from "@/stores";
import { cn } from "@/lib/utils";
import type { PricingUnit } from "@/constants";
import { PRICING_UNIT_LABELS, stoneLabel } from "../../constants";
import { formatPrice, getPriceState, isPurchasable } from "../../lib/product-price";
import { ProductPrice } from "./product-price";
import type { ProductPurchaseDetail, ProductSellUnit } from "../../types";

type ProductPurchasePanelProps = {
  /** Serializable product view (features stripped — see ProductPurchaseDetail). */
  product: ProductPurchaseDetail;
  className?: string;
};

/**
 * Purchase panel (Client Component) — the commercial heart of the page.
 *
 * - Variant selection: data-driven chips built from the variants'
 *   attributes; the selection drives SKU, price and availability.
 * - Quantity stepper honoring `purchase` constraints (min/step/max).
 * - Primary CTA wired to the shared cart store; when no price exists
 *   the CTA becomes "استعلام قیمت" (contact-for-price state).
 * - Configurable quick actions (tel/link) from product data.
 */
export function ProductPurchasePanel({
  product,
  className,
}: ProductPurchasePanelProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleFavorite = useFavoritesStore((s) => s.toggleItem);
  const favorites = useFavoritesStore((s) => s.items);

  const variants = product.variants;

  /* Sell units at order time. When `sellUnits` is absent, fall back to the
     product's single unit + price so the panel behaves exactly as before. */
  const sellUnitOptions: ProductSellUnit[] =
    product.sellUnits ??
    (product.pricingUnit
      ? [{ unit: product.pricingUnit, price: product.price, compareAtPrice: product.compareAtPrice }]
      : []);

  /* Default selected unit — the one matching the product's base pricing unit,
     else the first available unit. */
  const defaultUnit =
    sellUnitOptions.find((u) => u.unit === product.pricingUnit) ??
    sellUnitOptions[0];
  const [selectedUnitKey, setSelectedUnitKey] = useState<PricingUnit | undefined>(defaultUnit?.unit);
  const selectedSellUnit =
    sellUnitOptions.find((u) => u.unit === selectedUnitKey) ?? defaultUnit;

  /* Display label of the currently selected sell unit (fallback: product unit). */
  const unitLabel = stoneLabel(PRICING_UNIT_LABELS, selectedSellUnit?.unit ?? product.pricingUnit);

  /* Option groups derived from variant attributes (any attribute name). */
  const optionGroups = useMemo(() => {
    const groups = new Map<string, string[]>();
    for (const variant of variants) {
      for (const attribute of variant.attributes) {
        const values = groups.get(attribute.name) ?? [];
        if (!values.includes(attribute.value)) values.push(attribute.value);
        groups.set(attribute.name, values);
      }
    }
    return [...groups.entries()].map(([name, values]) => ({ name, values }));
  }, [variants]);

  /* Selection state — pre-filled with the first variant's attributes. */
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (variants[0]?.attributes ?? []).map((a) => [a.name, a.value])
    )
  );

  const selectedVariant =
    variants.find((variant) =>
      variant.attributes.every((a) => selected[a.name] === a.value)
    ) ?? variants[0];

  const priceState = getPriceState(product, selectedVariant, selectedSellUnit);
  const purchasable = isPurchasable(priceState);

  const stock = selectedVariant?.inventory;
  const minQuantity = product.purchase?.minQuantity ?? 1;
  const step = product.purchase?.step ?? 1;
  const maxQuantity = product.purchase?.maxQuantity ?? stock;

  const [quantity, setQuantity] = useState(minQuantity);

  const clampQuantity = (value: number) => {
    const upper = maxQuantity ?? Number.MAX_SAFE_INTEGER;
    return Math.min(upper, Math.max(minQuantity, value));
  };

  const updateQuantity = (value: number) => {
    if (Number.isNaN(value)) return;
    setQuantity(clampQuantity(Math.round(value)));
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      slug: product.slug,
      image: product.images.find((img) => img.isPrimary)?.url,
      price: priceState.price,
      quantity,
      unit: unitLabel,
      sellUnit: selectedSellUnit?.unit,
    });
    toast.success("به سبد خرید اضافه شد", {
      description: `${product.name} — ${quantity.toLocaleString("fa-IR")}${
        unitLabel ? ` ${unitLabel}` : ""
      }`,
    });
  };

  /* Contact-for-price CTA target: first link-type quick action. */
  const inquiryAction = product.quickActions.find((a) => a.kind === "link");

  return (
    <div
      className={
        "rounded-lg border border-border bg-card p-5 sm:p-6 " + (className ?? "")
      }
    >
      {/* Price */}
      <ProductPrice
        state={priceState}
        pricingUnit={selectedSellUnit?.unit ?? product.pricingUnit}
        size="lg"
      />

      {/* Sell-unit selector — متراژ / تعداد / اسلب / وزن (only when data defines it) */}
      {sellUnitOptions.length > 1 && (
        <fieldset className="mt-5">
          <legend className="text-sm font-medium">واحد فروش</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {sellUnitOptions.map((sellUnit) => {
              const active = selectedSellUnit?.unit === sellUnit.unit;
              const label = stoneLabel(PRICING_UNIT_LABELS, sellUnit.unit);
              const unitPrice =
                sellUnit.unit === selectedSellUnit?.unit ? priceState.price : sellUnit.price;

              return (
                <button
                  key={sellUnit.unit}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedUnitKey(sellUnit.unit)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-primary bg-secondary font-medium text-foreground"
                      : "border-border bg-background hover:bg-accent"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{label}</span>
                    {unitPrice !== undefined && (
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {formatPrice(unitPrice)}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Variant options (rendered only when the data defines them) */}
      {optionGroups.map((group) => (
        <fieldset key={group.name} className="mt-5">
          <legend className="text-sm font-medium">{group.name}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.values.map((value) => {
              const active = selected[group.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setSelected((prev) => ({ ...prev, [group.name]: value }))
                  }
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-primary bg-secondary font-medium text-foreground"
                      : "border-border bg-background hover:bg-accent"
                  )}
                >
                  <span dir="auto">{value}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      {/* SKU + availability (variant-driven) */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-sm">
        {selectedVariant?.sku && (
          <span className="text-muted-foreground">
            کد محصول:{" "}
            <span dir="ltr" className="font-medium tabular-nums text-foreground">
              {selectedVariant.sku}
            </span>
          </span>
        )}
        {stock !== undefined && stock > 0 && (
          <Badge variant="outline" className="gap-1 bg-background">
            <Check className="size-3.5 text-primary" aria-hidden="true" />
            {stock.toLocaleString("fa-IR")}
            {unitLabel ? ` ${unitLabel}` : ""} موجود در انبار
          </Badge>
        )}
        {stock === 0 && <Badge variant="destructive">ناموجود</Badge>}
      </div>

      {/* Quantity stepper */}
      {purchasable && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium">تعداد</span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="کاهش تعداد"
              disabled={quantity <= minQuantity}
              onClick={() => updateQuantity(quantity - step)}
            >
              <Minus className="size-4" aria-hidden="true" />
            </Button>
            <Input
              type="number"
              inputMode="numeric"
              dir="ltr"
              min={minQuantity}
              max={maxQuantity}
              step={step}
              value={quantity}
              onChange={(event) => updateQuantity(event.target.valueAsNumber)}
              aria-label="تعداد سفارش"
              className="w-16 text-center tabular-nums"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="افزایش تعداد"
              disabled={maxQuantity !== undefined && quantity >= maxQuantity}
              onClick={() => updateQuantity(quantity + step)}
            >
              <Plus className="size-4" aria-hidden="true" />
            </Button>
          </div>
          {minQuantity > 1 && (
            <span className="text-xs text-muted-foreground">
              حداقل سفارش: {minQuantity.toLocaleString("fa-IR")}
              {unitLabel ? ` ${unitLabel}` : ""}
            </span>
          )}
        </div>
      )}

      {/* Final price — per-unit price × quantity, in the selected sell unit */}
      {purchasable && priceState.price !== undefined && (
        <div className="mt-5 flex items-baseline justify-between gap-4 rounded-lg border border-border bg-muted/40 px-4 py-3">
          <span className="text-sm font-medium text-foreground">قیمت نهایی سفارش</span>
          <span className="text-lg font-bold tabular-nums text-foreground">
            {formatPrice(priceState.price * quantity)}
            <span className="mr-1 text-xs font-normal text-muted-foreground">تومان</span>
            {unitLabel ? (
              <span className="mr-1 text-xs font-normal text-muted-foreground">
                ({quantity.toLocaleString("fa-IR")} {unitLabel})
              </span>
            ) : null}
          </span>
        </div>
      )}

      {/* Primary actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {purchasable ? (
          <Button
            size="lg"
            className="flex-1 sm:flex-none sm:px-10"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            افزودن به سبد خرید
          </Button>
        ) : priceState.kind === "contact" ? (
          <Button size="lg" asChild className="flex-1 sm:flex-none sm:px-10">
            <a href={inquiryAction?.href ?? "#contact"}>
              <FileText className="size-4" aria-hidden="true" />
              {inquiryAction?.label ?? "استعلام قیمت"}
            </a>
          </Button>
        ) : (
          <Button size="lg" disabled className="flex-1 sm:flex-none sm:px-10">
            ناموجود
          </Button>
        )}

        {/* Favorite (wishlist) toggle — strong visual shift when active:
            filled red heart + solid red background so the state is obvious. */}
        {(() => {
          const isFav = favorites.some((f) => f.productId === product.id);
          return (
        <Button
          type="button"
          size="lg"
          variant={isFav ? "default" : "outline"}
          aria-label={isFav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          aria-pressed={isFav}
          className={cn(
            "flex-1 sm:flex-none sm:px-6 transition-colors",
            isFav &&
              "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-destructive"
          )}
          onClick={() => {
            toggleFavorite({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              image: product.images[0]?.url,
              tenantName: product.seller?.name,
              tenantId: product.tenantId,
            });
            toast.success(
              isFav
                ? "از علاقه‌مندی‌ها حذف شد"
                : "به علاقه‌مندی‌ها اضافه شد"
            );
          }}
        >
          <Heart
            className={cn(
              "size-4",
              isFav
                ? "fill-destructive-foreground text-destructive-foreground"
                : "text-muted-foreground"
            )}
            aria-hidden="true"
          />
          <span className="hidden sm:inline">
            {isFav ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی‌ها"}
          </span>
        </Button>
          );
        })()}

        {/* Quick actions (tel/link) from product data */}
        {product.quickActions.map((action) =>
          action.kind === "tel" ? (
            <Button
              key={action.id}
              size="lg"
              variant="outline"
              asChild
              className="flex-1 sm:flex-none"
            >
              <a href={`tel:${action.href}`}>
                <Phone className="size-4" aria-hidden="true" />
                {action.label}
              </a>
            </Button>
          ) : (
            <Button
              key={action.id}
              size="lg"
              variant="outline"
              asChild
              className="flex-1 sm:flex-none"
            >
              <a href={action.href}>
                <FileText className="size-4" aria-hidden="true" />
                {action.label}
              </a>
            </Button>
          )
        )}
      </div>
    </div>
  );
}