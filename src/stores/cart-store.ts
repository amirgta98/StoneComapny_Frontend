"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PricingUnit } from "@/constants";

export type CartItem = {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  image?: string;
  price?: number;
  quantity: number;
  unit?: string;
  /** Machine key of the selected selling unit (e.g. `per-sqm`), if any. */
  sellUnit?: PricingUnit;
};

type CartState = {
  items: CartItem[];
  /** Whether the cart sidebar/drawer is currently open. */
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                : i
            ),
          });
        } else {
          set({
            items: [...get().items, { ...item, quantity: item.quantity ?? 1 }],
          });
        }
      },
      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        });
      },
      updateQuantity: (productId, quantity, variantId) => {
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.max(0, quantity) }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "stone-cart",
      // Only cart contents survive a reload — drawer visibility is UI state.
      partialize: (state) => ({ items: state.items }),
    }
  )
);