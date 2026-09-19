/**
 * Manager Feature (صاحب / مدیر کارخانه سنگ).
 *
 * Dedicated dashboard, shell, navigation, and analytics for the MANAGER role.
 * Bound strictly to a single tenant (tenantId) with full RBAC isolation.
 */

export { ManagerDashboard } from "./components/manager-dashboard";
export { DashboardSkeleton } from "./components/dashboard-skeleton";
export { ManagerShell } from "./components/layout/manager-shell";
export { ManagerHeader } from "./components/layout/manager-header";
export { ManagerSidebar } from "./components/layout/manager-sidebar";
export { FactoryKpiCards } from "./components/factory-kpi-cards";
export { FactoryProductionPipeline } from "./components/factory-production-pipeline";
export { FactoryOrdersTable } from "./components/factory-orders-table";
export { FactoryInquiriesCard } from "./components/factory-inquiries-card";
export { FactoryInventoryOverview } from "./components/factory-inventory-overview";
export { FactorySalesChart } from "./components/factory-sales-chart";

export {
  getManagerDashboardData,
  mockManagerDashboards,
} from "./data/mock-manager-data";

export type {
  FactoryKpi,
  FactorySummary,
  ProductionStage,
  FactoryOrder,
  FactoryInquiry,
  FactoryInventoryItem,
  FactorySalesTrend,
  ManagerDashboardData,
} from "./types";
