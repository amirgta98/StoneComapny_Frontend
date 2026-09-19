export const STONE_TYPES = [
  "marble",
  "travertine",
  "granite",
  "limestone",
  "onyx",
  "quartzite",
  "slate",
  "sandstone",
  "basalt",
  "porcelain",
] as const;

export type StoneType = (typeof STONE_TYPES)[number];

export const STONE_FINISHES = [
  "polished",
  "honed",
  "brushed",
  "leathered",
  "flamed",
  "sandblasted",
  "tumbled",
  "split",
  "natural",
  "satin",
] as const;

export type StoneFinish = (typeof STONE_FINISHES)[number];

export const STONE_FORMS = [
  "slab",
  "tile",
  "block",
  "cut-to-size",
  "countertop",
  "vanity",
  "mosaic",
  "veneer",
] as const;

export type StoneForm = (typeof STONE_FORMS)[number];

export const STONE_APPLICATIONS = [
  "countertop",
  "flooring",
  "wall-cladding",
  "facade",
  "bathroom",
  "kitchen",
  "fireplace",
  "outdoor",
  "landscaping",
  "staircase",
  "feature-wall",
] as const;

export type StoneApplication = (typeof STONE_APPLICATIONS)[number];

export const PRICING_UNITS = ["per-sqm", "per-slab", "per-ton", "per-piece"] as const;
export type PricingUnit = (typeof PRICING_UNITS)[number];

export const INVENTORY_UNITS = ["sqm", "slab", "ton", "piece"] as const;
export type InventoryUnit = (typeof INVENTORY_UNITS)[number];

export const STONE_COLORS = [
  "white",
  "cream",
  "beige",
  "grey",
  "black",
  "brown",
  "gold",
  "green",
  "blue",
  "red",
  "pink",
  "multicolor",
] as const;

export type StoneColor = (typeof STONE_COLORS)[number];