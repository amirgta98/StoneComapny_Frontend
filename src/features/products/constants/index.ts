import type { ProductSortOption } from "../types";
import type { StoneApplication, StoneColor, StoneFinish, StoneForm, StoneType, PricingUnit } from "@/constants";

/**
 * Persian display labels for stone domain enums.
 *
 * The domain stores English enum values; the UI renders these labels.
 * Keep the maps exhaustive over their source unions.
 */
export const STONE_TYPE_LABELS: Record<StoneType, string> = {
  marble: "مرمر",
  travertine: "تراورتن",
  granite: "گرانیت",
  limestone: "سنگ آهک",
  onyx: "آنیکس",
  quartzite: "کوارتزیت",
  slate: "سنگ لوح",
  sandstone: "ماسه سنگ",
  basalt: "بازالت",
  porcelain: "پرسلان",
};

export const STONE_COLOR_LABELS: Record<StoneColor, string> = {
  white: "سفید",
  cream: "کرم",
  beige: "بژ",
  grey: "خاکستری",
  black: "مشکی",
  brown: "قهوه‌ای",
  gold: "طلایی",
  green: "سبز",
  blue: "آبی",
  red: "قرمز",
  pink: "صورتی",
  multicolor: "چندرنگ",
};

export const STONE_FINISH_LABELS: Record<StoneFinish, string> = {
  polished: "پولیش",
  honed: "مات (هون)",
  brushed: "برس‌خورده",
  leathered: "چرمی",
  flamed: "شعله‌ور",
  sandblasted: "سندبلاست",
  tumbled: "کهنه",
  split: "شکافته",
  natural: "طبیعی",
  satin: "ساتن",
};

export const STONE_APPLICATION_LABELS: Record<StoneApplication, string> = {
  countertop: "صفحه کابینت",
  flooring: "کف‌سازی",
  "wall-cladding": "دیوارپوش",
  facade: "نما",
  bathroom: "حمام",
  kitchen: "آشپزخانه",
  fireplace: "شومینه",
  outdoor: "فضای باز",
  landscaping: "محوطه‌سازی",
  staircase: "پله",
  "feature-wall": "دیوار ویژه",
};

export const STONE_FORM_LABELS: Record<StoneForm, string> = {
  slab: "اسلب",
  tile: "تایل",
  block: "کلوخه",
  "cut-to-size": "برش سفارشی",
  countertop: "صفحه کابینت",
  vanity: "روشویی",
  mosaic: "موزاییک",
  veneer: "روکش",
};

/** Safe label lookup — falls back to the raw value when unmapped. */
export function stoneLabel(
  map: Record<string, string>,
  value: string | undefined
): string | undefined {
  if (!value) return undefined;
  return map[value] ?? value;
}

/** Persian labels for the product listing sort options. */
export const PRODUCT_SORT_LABELS: Record<ProductSortOption, string> = {
  newest: "جدیدترین",
  oldest: "قدیمی‌ترین",
  popular: "محبوب‌ترین",
  "name-asc": "نام (الف به ی)",
  "name-desc": "نام (ی به الف)",
  "price-asc": "ارزان‌ترین",
  "price-desc": "گران‌ترین",
};

/** All sort options, in display order. */
export const PRODUCT_SORT_OPTIONS = Object.keys(
  PRODUCT_SORT_LABELS
) as ProductSortOption[];

/** Persian labels for pricing units (price-per and quantity unit). */
export const PRICING_UNIT_LABELS: Record<PricingUnit, string> = {
  "per-sqm": "متر مربع",
  "per-slab": "اسلب",
  "per-ton": "تن",
  "per-piece": "عدد",
};

/** All pricing units, in display order. */
export const PRICING_UNIT_OPTIONS = Object.keys(
  PRICING_UNIT_LABELS
) as PricingUnit[];

/**
 * Visual swatch (CSS `background` value) per stone color, used by the
 * color filter. Plain CSS colors/gradients keep the swatches dependency-
 * free and theme-independent.
 */
export const STONE_COLOR_SWATCHES: Record<StoneColor, string> = {
  white: "#f5f5f4",
  cream: "#f1e8d6",
  beige: "#d9c7a9",
  grey: "#a8a29e",
  black: "#292524",
  brown: "#8b5e34",
  gold: "#c9a44a",
  green: "#6b8f71",
  blue: "#64748b",
  red: "#b0524d",
  pink: "#d8a7a7",
  multicolor:
    "linear-gradient(135deg, #f1e8d6 0%, #c9a44a 30%, #8b5e34 60%, #292524 100%)",
};