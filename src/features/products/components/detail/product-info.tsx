import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { Badge } from "@/components/ui";
import {
  STONE_COLOR_LABELS,
  STONE_COLOR_SWATCHES,
  STONE_FINISH_LABELS,
  STONE_FORM_LABELS,
  STONE_TYPE_LABELS,
  stoneLabel,
} from "../../constants";
import { Stars } from "../product-card";
import type { ProductDetail } from "../../types";

type ProductInfoProps = {
  product: ProductDetail;
  /**
   * `"full"` (default): editorial header block — classification badges,
   * H1, short description, rating, then the key metadata list.
   * `"summary"`: key metadata + verified-seller line inside the shared
   * card treatment — for the purchase column where the page-level
   * editorial header owns the title/rating.
   */
  variant?: "full" | "summary";
  className?: string;
};

/** One meta row (label + value) of the information list. */
function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <dt className="shrink-0 text-muted-foreground">{label}:</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}

/**
 * Product information — name, quality badge, short description, rating
 * and the key catalog metadata (SKU, type, color, finish, origin,
 * quarry, grade). Hierarchy-first: name and rating dominate, metadata
 * stays compact. Two variants share the same data and card language.
 */
export function ProductInfo({ product, variant = "full", className }: ProductInfoProps) {
  const typeLabel = stoneLabel(STONE_TYPE_LABELS, product.stoneType);
  const formLabel = stoneLabel(STONE_FORM_LABELS, product.form);
  const colorLabel = stoneLabel(STONE_COLOR_LABELS, product.color);
  const finishLabel = stoneLabel(STONE_FINISH_LABELS, product.finish);
  const sku = product.variants[0]?.sku;
  const isSummary = variant === "summary";

  /* Key metadata list — shared by both variants. */
  const metadata = (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
      {sku && (
        <MetaRow label="کد محصول">
          <span dir="ltr" className="tabular-nums">
            {sku}
          </span>
        </MetaRow>
      )}
      {typeLabel && <MetaRow label="دسته‌بندی">{typeLabel}</MetaRow>}
      {colorLabel && (
        <MetaRow label="رنگ">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-3.5 rounded-full border border-border shadow-sm"
              style={{
                background: product.color
                  ? STONE_COLOR_SWATCHES[product.color]
                  : undefined,
              }}
            />
            {colorLabel}
          </span>
        </MetaRow>
      )}
      {finishLabel && <MetaRow label="پرداخت سطح">{finishLabel}</MetaRow>}
      {product.origin && <MetaRow label="مبدا">{product.origin}</MetaRow>}
      {product.quarry && <MetaRow label="معدن">{product.quarry}</MetaRow>}
      {product.grade && <MetaRow label="گرید">{product.grade}</MetaRow>}
    </dl>
  );

  const verifiedSeller = product.seller?.verified ? (
    <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
      <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
      فروشنده تاییدشده: {product.seller.name}
    </p>
  ) : null;

  /* "summary" — key facts inside the shared card, beside the purchase panel. */
  if (isSummary) {
    return (
      <div
        className={
          "rounded-lg border border-border bg-card p-5 sm:p-6 " + (className ?? "")
        }
      >
        <h2 className="text-xs font-medium text-muted-foreground">
          مشخصات کلیدی
        </h2>
        <div className="mt-4">{metadata}</div>
        {verifiedSeller}
      </div>
    );
  }

  /* "full" — editorial header block (badges → H1 → short description → rating). */
  return (
    <div className={className}>
      {/* Classification badges */}
      <div className="flex flex-wrap items-center gap-2">
        {typeLabel && <Badge>{typeLabel}</Badge>}
        {formLabel && <Badge variant="outline">{formLabel}</Badge>}
        {product.quality && <Badge variant="secondary">{product.quality}</Badge>}
      </div>

      {/* Name + short description */}
      <h1 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">
        {product.name}
      </h1>

      {product.shortDescription && (
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>
      )}

      {/* Rating */}
      {product.rating !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          <Stars value={product.rating} />
          <span className="text-sm font-medium tabular-nums">
            {product.rating.toLocaleString("fa-IR")} از ۵
          </span>
          {product.reviewCount !== undefined && product.reviewCount > 0 && (
            <Link
              href="#reviews"
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              ({product.reviewCount.toLocaleString("fa-IR")} دیدگاه)
            </Link>
          )}
        </div>
      )}

      {/* Key metadata */}
      <div className="mt-6 border-t border-border pt-5">{metadata}</div>

      {verifiedSeller}
    </div>
  );
}