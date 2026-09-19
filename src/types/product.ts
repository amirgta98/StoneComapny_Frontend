import type {
  StoneType,
  StoneFinish,
  StoneForm,
  StoneApplication,
  StoneColor,
  PricingUnit,
  InventoryUnit,
} from "@/constants";

export type ProductStatus = "draft" | "published" | "archived";

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
  isPrimary?: boolean;
};

export type ProductAttribute = {
  id: string;
  name: string;
  value: string;
  unit?: string;
};

export type ProductVariant = {
  id: string;
  sku: string;
  name?: string;
  attributes: ProductAttribute[];
  price?: number;
  compareAtPrice?: number;
  inventory?: number;
  images?: ProductImage[];
};

export type Product = {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  status: ProductStatus;
  stoneType?: StoneType;
  color?: StoneColor;
  finish?: StoneFinish;
  form?: StoneForm;
  application?: StoneApplication;
  origin?: string;
  quarry?: string;
  grade?: string;
  thickness?: number;
  dimensions?: string;
  pricingUnit?: PricingUnit;
  inventoryUnit?: InventoryUnit;
  price?: number;
  compareAtPrice?: number;
  /** Average customer rating (1–5, supports fractional values). */
  rating?: number;
  /** Total number of reviews the rating is based on. */
  reviewCount?: number;
  images: ProductImage[];
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  categories: string[];
  collections: string[];
  createdAt: string;
  updatedAt: string;
};