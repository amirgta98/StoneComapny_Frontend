"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { Badge } from "@/components/ui";
import { CINEMATIC_EASE } from "@/lib/motion";

import { Stars } from "../product-card";
import {
  STONE_FORM_LABELS,
  STONE_TYPE_LABELS,
  stoneLabel,
} from "../../constants";
import type { ProductPurchaseDetail } from "../../types";

type ProductDetailHeaderProps = {
  /** Serializable product view (features stripped — see ProductPurchaseDetail). */
  product: ProductPurchaseDetail;
  className?: string;
};

/** Fade/slide entrance; static (fully visible) when reduced motion is preferred. */
const reveal = (reduceMotion: boolean | null, delay: number) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay, ease: CINEMATIC_EASE },
      };

/**
 * Product-detail editorial page header (Client Component).
 *
 * Mirrors the site's editorial heroes (About/Contact): classification
 * badges → display-size H1 → short description → rating, with the same
 * staggered `CINEMATIC_EASE` entrance. Skipped entirely under
 * `prefers-reduced-motion` (content stays fully visible).
 *
 * Keeps the page's title hierarchy out of the purchase column so the
 * hero reads like the rest of the storefront instead of a generic
 * e-commerce template.
 */
export function ProductDetailHeader({
  product,
  className,
}: ProductDetailHeaderProps) {
  const reduceMotion = useReducedMotion();

  const typeLabel = stoneLabel(STONE_TYPE_LABELS, product.stoneType);
  const formLabel = stoneLabel(STONE_FORM_LABELS, product.form);

  return (
    <header className={className}>
      {/* Classification badges */}
      <motion.div
        {...reveal(reduceMotion, 0.05)}
        className="flex flex-wrap items-center gap-2"
      >
        {typeLabel && <Badge>{typeLabel}</Badge>}
        {formLabel && <Badge variant="outline">{formLabel}</Badge>}
        {product.quality && (
          <Badge variant="secondary">{product.quality}</Badge>
        )}
      </motion.div>

      {/* Display heading */}
      <motion.h1
        {...reveal(reduceMotion, 0.15)}
        className="mt-4 text-3xl font-bold leading-[1.2] text-foreground sm:text-4xl md:text-5xl"
      >
        {product.name}
      </motion.h1>

      {/* Short description */}
      {product.shortDescription && (
        <motion.p
          {...reveal(reduceMotion, 0.3)}
          className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground"
        >
          {product.shortDescription}
        </motion.p>
      )}

      {/* Rating */}
      {product.rating !== undefined && (
        <motion.div
          {...reveal(reduceMotion, 0.45)}
          className="mt-5 flex flex-wrap items-center gap-2"
        >
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
        </motion.div>
      )}
    </header>
  );
}