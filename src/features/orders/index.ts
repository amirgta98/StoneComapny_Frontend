/**
 * Orders feature.
 *
 * Manages orders, order items, and order lifecycle.
 */

// Stores
export { useOrdersStore } from "./stores/orders-store";
export {
  useFactoryOrdersStore,
  type ExtendedFactoryOrder,
  type FactoryOrdersStats,
  FACTORY_STATUS_LABELS,
  INITIAL_FACTORY_ORDERS,
} from "./stores/factory-orders-store";

// Manager Components
export { OrdersManagerView } from "./components/manager/orders-manager-view";
export { OrderDetailView } from "./components/manager/order-detail-view";
export { OrderQuickViewDialog } from "./components/manager/order-quick-view-dialog";
export { OrderStatusUpdateDialog } from "./components/manager/order-status-update-dialog";
export { OrderWaybillDialog } from "./components/manager/order-waybill-dialog";

// Types
export type {
  CustomerOrder,
  OrderItem,
  OrderDelivery,
  OrderSummary,
  OrderStatus,
  OrderCategory,
} from "@/features/account/data/mock-data";