/**
 * Natural Stone Inventory & Warehouse Management Feature
 * Clean Architecture - Presentation & Feature Layer
 */

// Types & DTOs
export * from "./types/inventory.types";

// Hooks
export * from "./hooks/use-inventory";

// Sub Navigation
export * from "./components/inventory-sub-nav";

// Badges & Common UI
export * from "./components/common/inventory-badges";

// Main Views
export * from "./components/inventory-dashboard-view";
export * from "./components/products/inventory-products-view";
export * from "./components/products/inventory-detail-dialog";
export * from "./components/receipts/stock-receipts-view";
export * from "./components/receipts/new-receipt-dialog";
export * from "./components/issues/stock-issues-view";
export * from "./components/issues/new-issue-dialog";
export * from "./components/movements/inventory-kardex-view";
export * from "./components/reservations/stock-reservations-view";
export * from "./components/locations/warehouse-locations-view";
export * from "./components/locations/new-location-dialog";
export * from "./components/transfers/stock-transfers-view";
export * from "./components/transfers/new-transfer-dialog";
export * from "./components/counts/stock-counts-view";
export * from "./components/counts/new-count-dialog";
export * from "./components/counts/count-detail-dialog";
export * from "./components/adjustments/stock-adjustments-view";
export * from "./components/adjustments/new-adjustment-dialog";
export * from "./components/alerts/inventory-alerts-view";
export * from "./components/reports/inventory-reports-view";