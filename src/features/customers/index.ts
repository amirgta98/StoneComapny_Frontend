/**
 * Customers feature.
 *
 * Manages customer accounts, B2B contractors, architectural clients,
 * credit limits, checks, financial ledger, and interactions.
 */

export * from "./types";
export * from "./stores/factory-customers-store";
export * from "./lib/export-customers";
export * from "./components/manager/customers-manager-view";
export * from "./components/manager/customer-detail-view";
export * from "./components/manager/customer-form-dialog";
export * from "./components/manager/customer-statement-print-dialog";