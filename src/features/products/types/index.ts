export type {
  Product,
  ProductStatus,
  ProductImage,
  ProductAttribute,
  ProductVariant,
} from "@/types";

import type { Product } from "@/types";
import type { PricingUnit, StoneApplication } from "@/constants";
import type { LucideIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Product detail (storefront product page)                                   */
/* -------------------------------------------------------------------------- */

/** A single customer review attached to a product. */
export type ProductReview = {
  id: string;
  /** Display name of the reviewer. */
  author: string;
  /** Rating from 1 to 5 (integer or fractional). */
  rating: number;
  /** ISO date string of when the review was written. */
  date: string;
  /** Optional short review headline. */
  title?: string;
  /** Review body text. */
  content: string;
};

/**
 * One structured specification row.
 *
 * The specification system is intentionally open (label/value pairs) so
 * different stone types can expose different technical fields without
 * schema changes.
 */
export type ProductSpecification = {
  label: string;
  value: string;
};

/** A selling-point / service feature shown with the product. */
export type ProductFeatureItem = {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
};

/** A configurable contact/order action (quick order, call, quotation…). */
export type ProductQuickAction = {
  id: string;
  label: string;
  /** `link` renders an anchor, `tel` renders a `tel:` call link. */
  kind: "link" | "tel";
  href: string;
};

/** Purchase constraints for the quantity/pricing panel. */
export type ProductPurchaseConfig = {
  /** Minimum purchasable quantity (minimum order). */
  minQuantity?: number;
  /** Maximum purchasable quantity; falls back to available inventory. */
  maxQuantity?: number;
  /** Quantity increment used by the stepper. */
  step?: number;
};

/**
 * One sellable unit of a stone at order time.
 *
 * The same stone can be sold by area (متراژ،`per-sqm``), by count
 * (`per-piece`), by slab (`per-slab`) or by weight (`per-ton`) — with a
 * per-unit price for each. The purchase panel lets the customer pick the
 * unit (defaults to the product's `pricingUnit`) and computes the final
 * price as `per-unit price × quantity` in that unit.
 */
export type ProductSellUnit = {
  /** Sale/pricing unit (متر مربع، اسلب، تن، عدد). */
  unit: PricingUnit;
  /** Per-unit price in Toman for this sell unit. */
  price?: number;
  /** Per-unit original/compare-at price (drives the discount percent. */
  compareAtPrice?: number;
};

/** Summary of the seller/factory (tenant) behind a product. */
export type ProductSeller = {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  location?: string;
  /** Whether the platform has verified this seller. */
  verified?: boolean;
  phone?: string;
};

/**
 * Full product-page data — everything the product details view renders.
 *
 * Extends the domain `Product` with presentation/detail content
 * (gallery-adjacent copy, applications, features, specs, reviews, tags
 * and purchase/quick-action configuration) so the view stays purely
 * data-driven. When the backend is ready, this shape is what the
 * product-detail query should return.
 */
export type ProductDetail = Product & {
  /** Quality label (e.g. "درجه یک / پریمیوم") — separate from grade. */
  quality?: string;
  /** Concise highlight text shown under the product name. */
  shortDescription?: string;
  /** Full description, paragraph by paragraph. */
  descriptionParagraphs?: string[];
  /** Important notes rendered as a bullet list after the description. */
  descriptionNotes?: string[];
  /** Where this stone can be used. */
  applications: StoneApplication[];
  /** Service/selling-point features. */
  features: ProductFeatureItem[];
  /** Structured technical specifications. */
  specifications: ProductSpecification[];
  /** Customer reviews (empty until reviews exist). */
  reviews: ProductReview[];
  /** Seller/factory (tenant) summary; optional until tenants are queryable. */
  seller?: ProductSeller;
  /** Quantity/pricing constraints. */
  purchase?: ProductPurchaseConfig;
  /**
   * Sellable units of this stone at order time (optional).
   *
   * When present, the purchase panel shows a sell-unit selector (e.g.
   * متر مربع، اسلب، تن، عدد) and prices/quantity resolve against the
   * selected unit. When absent, the panel falls back to the product's
   * single `pricingUnit` + `price` (current behavior).
   */
  sellUnits?: ProductSellUnit[];
  /** Configurable quick contact/order actions. */
  quickActions: ProductQuickAction[];
};

/**
 * Serializable subset of `ProductDetail` that is safe to pass from
 * Server Components into Client Components. `features` is omitted
 * because it carries Lucide icon component references, which cannot
 * cross the server/client boundary.
 */
export type ProductPurchaseDetail = Omit<ProductDetail, "features">;

/**
 * Stone-specific filter criteria for product search.
 *
 * All fields are optional; an empty object means "no filters".
 * Values mirror the domain enums stored on `Product`.
 */
export type ProductFilters = {
  /** Stone category/type (e.g. "marble"). */
  stoneType?: string;
  /** Stone color (e.g. "cream"). */
  color?: string;
  /** Surface/finish (e.g. "polished"). */
  finish?: string;
  /** Usage/application (e.g. "facade"). */
  application?: string;
  /** Form/size family (e.g. "slab", "tile"). */
  form?: string;
  /** Minimum price in Toman (inclusive). */
  minPrice?: number;
  /** Maximum price in Toman (inclusive). */
  maxPrice?: number;
  /** When true, only products with stock are returned. */
  inStockOnly?: boolean;
};

/** Empty-filters sentinel — use instead of scattering `undefined` checks. */
export const EMPTY_PRODUCT_FILTERS: ProductFilters = {};

/**
 * Available sort orders for the product listing.
 *
 * Price sorts are only meaningful when products carry a price; products
 * without a price always sort to the end regardless of direction.
 */
export type ProductSortOption =
  | "newest"
  | "oldest"
  | "popular"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

/** Default sort applied on first load. */
export const DEFAULT_PRODUCT_SORT: ProductSortOption = "newest";