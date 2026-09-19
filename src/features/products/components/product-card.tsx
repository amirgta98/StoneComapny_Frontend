import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { STONE_TYPE_LABELS, stoneLabel } from "../constants";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  variant?: "default" | "featured" | "compact" | "horizontal" | "offer";
  showRating?: boolean;
  showPrice?: boolean;
  className?: string;
};

/**
 * Reusable RTL star-rating display.
 *
 * Rendered 5 stars and fills them proportionally to support
 * fractional values (e.g. 4.5). The filled layer is clipped by
 * width percentage; in RTL it anchors to the start edge automatically.
 * Exported for reuse by the product-detail page (info/reviews).
 */
export function Stars({ value }: { value: number }) {
  const clamped = Math.min(5, Math.max(0, value));

  return (
    <div
      className="relative inline-flex"
      role="img"
      aria-label={`امتیاز ${clamped.toLocaleString("fa-IR")} از ۵`}
    >
      {/* Empty track */}
      <div className="flex gap-0.5 text-muted-foreground/40">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-3.5" strokeWidth={1.5} />
        ))}
      </div>

      {/* Filled layer, clipped proportionally */}
      <div
        className="absolute inset-0 overflow-hidden text-amber-500"
        style={{ width: `${(clamped / 5) * 100}%` }}
      >
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-3.5 fill-current" strokeWidth={0} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Discount percentage between compare-at price and current price. */
function discountPercent(product: Product): number {
  const { price, compareAtPrice } = product;
  if (!price || !compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function ProductCard({
  product,
  variant = "default",
  showRating = false,
  showPrice = true,
  className,
}: ProductCardProps) {
  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];
  const offPercent = discountPercent(product);

  /* ------------------------------------------------------------------
   * HORIZONTAL VARIANT — image on the start side, info on the end side.
   * ------------------------------------------------------------------ */
  if (variant === "horizontal") {
    return (
      <Link
        href={`/stones/${product.slug}`}
        className={cn("group block", className)}
      >
        <div className="flex h-full gap-4 rounded-lg border border-border bg-card p-3 transition-shadow duration-300 group-hover:shadow-md">
          {/* Image */}
          <div className="relative w-28 shrink-0 overflow-hidden rounded-md sm:w-32 md:w-36">
            <div className="relative aspect-square w-full">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt || product.name}
                  fill
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  unoptimized={primaryImage.url.endsWith(".svg")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  بدون تصویر
                </div>
              )}
            </div>

            {offPercent > 0 && (
              <Badge className="absolute right-2 top-2 bg-destructive px-1.5 py-0 text-[11px] font-bold text-destructive-foreground">
                ٪{offPercent.toLocaleString("fa-IR")} تخفیف
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
            <div className="min-w-0 space-y-1.5">
              {product.stoneType && (
                <p className="text-xs text-muted-foreground">
                  {stoneLabel(STONE_TYPE_LABELS, product.stoneType)}
                </p>
              )}
              <h3 className="truncate font-semibold leading-snug">
                {product.name}
              </h3>

              {showRating && product.rating !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Stars value={product.rating} />
                  {product.reviewCount !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      ({product.reviewCount.toLocaleString("fa-IR")})
                    </span>
                  )}
                </div>
              )}
            </div>

            {showPrice && product.price !== undefined && (
              <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {product.compareAtPrice &&
                  product.compareAtPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/60">
                      {product.compareAtPrice.toLocaleString("fa-IR")}
                    </span>
                  )}
                <span className="text-base font-bold tabular-nums">
                  {product.price.toLocaleString("fa-IR")}
                </span>
                <span className="text-xs text-muted-foreground">تومان</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  /* ------------------------------------------------------------------
   * OFFER VARIANT — compact card for special-offer sliders.
   * Only: image, name, discount %, special price, old price.
   * ------------------------------------------------------------------ */
  if (variant === "offer") {
    return (
      <Link
        href={`/stones/${product.slug}`}
        className={cn("group block", className)}
        aria-label={product.name}
      >
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {/* Image (slightly vertical) */}
          <div className="relative aspect-[4/5] w-full bg-muted">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                unoptimized={primaryImage.url.endsWith(".svg")}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                بدون تصویر
              </div>
            )}

            {offPercent > 0 && (
              <Badge className="absolute left-2 top-2 rounded-md bg-destructive px-1.5 py-0.5 text-[11px] font-bold text-destructive-foreground">
                ٪{offPercent.toLocaleString("fa-IR")}
              </Badge>
            )}
          </div>

          {/* Name + prices */}
          <div className="space-y-1.5 p-3">
            <h3 className="truncate text-sm font-semibold leading-snug">
              {product.name}
            </h3>

            <div className="flex items-baseline justify-between gap-x-2">
              <span className="text-base font-bold tabular-nums">
                {product.price?.toLocaleString("fa-IR")}
                <span className="mr-1 text-[11px] font-normal text-muted-foreground">
                  تومان
                </span>
              </span>

              {product.compareAtPrice &&
                product.price !== undefined &&
                product.compareAtPrice > product.price && (
                  <del className="text-xs tabular-nums text-muted-foreground decoration-muted-foreground/60">
                    {product.compareAtPrice.toLocaleString("fa-IR")}
                  </del>
                )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  /* ------------------------------------------------------------------
   * DEFAULT / FEATURED / COMPACT VARIANTS — vertical image-led card.
   * ------------------------------------------------------------------ */
  return (
    <Link
      href={`/stones/${product.slug}`}
      className={cn("group block", className)}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          variant === "featured" ? "aspect-[4/5]" : "aspect-square"
        )}
      >
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={primaryImage.url.endsWith(".svg")}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
        {product.stoneType && (
          <Badge className="absolute left-3 top-3 bg-background/80 backdrop-blur">
            {product.stoneType}
          </Badge>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-medium leading-tight">{product.name}</h3>
        {product.origin && (
          <p className="text-sm text-muted-foreground">{product.origin}</p>
        )}
        {showRating && product.rating !== undefined && (
          <Stars value={product.rating} />
        )}
        {showPrice && product.price !== undefined && (
          <p className="text-sm font-medium">
            {product.price.toLocaleString("fa-IR")}
            {product.pricingUnit ? ` / ${product.pricingUnit}` : ""}
          </p>
        )}
      </div>
    </Link>
  );
}