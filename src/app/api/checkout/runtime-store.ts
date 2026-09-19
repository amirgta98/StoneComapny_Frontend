import type { CustomerOrder } from "@/features/account/data/mock-data";
import { mockOrders } from "@/features/account/data/mock-data";

export interface PendingPaymentSession {
  orderId: string;
  orderNumber: string;
  token: string;
  amount: number;
  gateway: string;
  createdAt: number;
  expiresAt: number;
}

// In-memory runtime storage for checkout orders and payment sessions
export const runtimeOrders = new Map<string, CustomerOrder>();
export const runtimePaymentSessions = new Map<string, PendingPaymentSession>();

// Preload existing mock orders into runtime store
mockOrders.forEach((o) => {
  runtimeOrders.set(o.id, o);
  if (o.orderNumber) {
    runtimeOrders.set(o.orderNumber, o);
  }
});
