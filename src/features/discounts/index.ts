/**
 * Discounts feature.
 *
 * Manages discounts, coupons, and promotional campaigns for the stone factory platform.
 */

export * from "./types";
export * from "./lib/discount-utils";
export * from "./data/mock-discounts";
export * from "./stores/discounts-store";
export { DiscountsStats } from "./components/discounts-stats";
export { DiscountFormDialog } from "./components/discount-form-dialog";
export { DiscountDeleteDialog } from "./components/discount-delete-dialog";
export { DiscountTargetDialog } from "./components/discount-target-dialog";
export { DiscountsManagerView } from "./components/discounts-manager-view";