"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  mockOrders,
  type CustomerOrder,
  type OrderDelivery,
  type OrderStatus,
} from "@/features/account/data/mock-data";

interface OrdersState {
  orders: CustomerOrder[];
  addOrder: (order: CustomerOrder) => void;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    trackingInfo?: Partial<OrderDelivery>
  ) => void;
  getOrderById: (id: string, userId?: string) => CustomerOrder | undefined;
  getUserOrders: (userId?: string) => CustomerOrder[];
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,

      addOrder: (newOrder: CustomerOrder) => {
        // Also prepend to mockOrders in-memory for backwards compatibility with any component reading mockOrders directly
        const existsInMock = mockOrders.some((o) => o.id === newOrder.id);
        if (!existsInMock) {
          mockOrders.unshift(newOrder);
        }

        set((state) => {
          const exists = state.orders.some((o) => o.id === newOrder.id);
          if (exists) {
            return {
              orders: state.orders.map((o) =>
                o.id === newOrder.id ? newOrder : o
              ),
            };
          }
          return {
            orders: [newOrder, ...state.orders],
          };
        });
      },

      updateOrderStatus: (
        orderId: string,
        status: OrderStatus,
        trackingInfo?: Partial<OrderDelivery>
      ) => {
        // Update in mockOrders in-memory
        const mockTarget = mockOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
        if (mockTarget) {
          mockTarget.status = status;
          if (trackingInfo) {
            mockTarget.delivery = {
              ...mockTarget.delivery,
              ...(trackingInfo as OrderDelivery),
            };
          }
        }

        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId && order.orderNumber !== orderId) {
              return order;
            }
            return {
              ...order,
              status,
              delivery: trackingInfo
                ? {
                    ...(order.delivery as OrderDelivery),
                    ...trackingInfo,
                  }
                : order.delivery,
            };
          }),
        }));
      },

      getOrderById: (id: string, userId = "u-user-1") => {
        const effectiveUserId = userId || "u-user-1";
        return get().orders.find(
          (o) =>
            (o.id === id || o.orderNumber === id) &&
            (effectiveUserId === "all" || o.ownerId === effectiveUserId)
        );
      },

      getUserOrders: (userId = "u-user-1") => {
        const effectiveUserId = userId || "u-user-1";
        return get().orders.filter((o) => o.ownerId === effectiveUserId);
      },
    }),
    {
      name: "stone-customer-orders-storage",
    }
  )
);
