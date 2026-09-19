"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FavoriteItem = {
  productId: string;
  name: string;
  slug: string;
  image?: string;
  tenantName?: string;
  tenantId?: string;
};

type FavoritesState = {
  items: FavoriteItem[];
  addItem: (item: FavoriteItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: FavoriteItem) => void;
  isFavorite: (productId: string) => boolean;
  clearAll: () => void;
};

/**
 * Favorites (wishlist) store — zustand + persist, same pattern as cart-store.
 * Persisted to localStorage so favorites survive a reload.
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (get().items.some((i) => i.productId === item.productId)) return;
        set({ items: [...get().items, item] });
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },
      toggleItem: (item) => {
        if (get().items.some((i) => i.productId === item.productId)) {
          set({ items: get().items.filter((i) => i.productId !== item.productId) });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      isFavorite: (productId) => get().items.some((i) => i.productId === productId),
      clearAll: () => set({ items: [] }),
    }),
    {
      name: "stone-favorites",
    }
  )
);
