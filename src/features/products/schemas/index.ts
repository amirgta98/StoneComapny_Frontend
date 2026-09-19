import { z } from "zod";
import {
  STONE_TYPES,
  STONE_FINISHES,
  STONE_FORMS,
  STONE_APPLICATIONS,
  STONE_COLORS,
  PRICING_UNITS,
  INVENTORY_UNITS,
} from "@/constants";

export const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url(),
  alt: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isPrimary: z.boolean().optional(),
});

export const productAttributeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().optional(),
});

export const productVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1),
  name: z.string().optional(),
  attributes: z.array(productAttributeSchema).default([]),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().optional(),
  inventory: z.number().int().min(0).optional(),
  images: z.array(productImageSchema).optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  stoneType: z.enum(STONE_TYPES).optional(),
  color: z.enum(STONE_COLORS).optional(),
  finish: z.enum(STONE_FINISHES).optional(),
  form: z.enum(STONE_FORMS).optional(),
  application: z.enum(STONE_APPLICATIONS).optional(),
  origin: z.string().optional(),
  quarry: z.string().optional(),
  grade: z.string().optional(),
  thickness: z.number().positive().optional(),
  dimensions: z.string().optional(),
  pricingUnit: z.enum(PRICING_UNITS).optional(),
  inventoryUnit: z.enum(INVENTORY_UNITS).optional(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().optional(),
  images: z.array(productImageSchema).default([]),
  attributes: z.array(productAttributeSchema).default([]),
  variants: z.array(productVariantSchema).default([]),
  categories: z.array(z.string()).default([]),
  collections: z.array(z.string()).default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;