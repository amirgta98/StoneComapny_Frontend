/**
 * Type definitions for Discounts, Coupons, and Promotional Campaigns.
 */

export type DiscountType = "PERCENTAGE" | "FIXED";

export type DiscountStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";

export type DiscountScope = "ALL" | "CATEGORIES" | "PRODUCTS";

export interface Discount {
  id: string;
  tenantId?: string;
  name: string;
  code: string;
  description?: string | null;
  type: DiscountType;
  value: number; // e.g. 15 for 15% or 5,000,000 for 5,000,000 Tomans
  status: DiscountStatus;
  startAt: string; // ISO 8601 string
  endAt: string; // ISO 8601 string
  usageLimit?: number | null;
  usedCount: number;
  perCustomerLimit?: number | null;
  minQuantity?: number | null;
  minPurchaseAmount?: number | null; // in Tomans
  priority?: number;
  scope: DiscountScope;
  productIds?: string[];
  categoryIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DiscountStats {
  total: number;
  active: number;
  expired: number;
  averageRate: number;
}

export interface DiscountFormData {
  name: string;
  code: string;
  description?: string;
  type: DiscountType;
  value: number;
  startAt: string;
  endAt: string;
  status: DiscountStatus;
  usageLimit?: number | null;
  perCustomerLimit?: number | null;
  minQuantity?: number | null;
  minPurchaseAmount?: number | null;
  priority?: number;
  scope: DiscountScope;
  productIds?: string[];
  categoryIds?: string[];
}
