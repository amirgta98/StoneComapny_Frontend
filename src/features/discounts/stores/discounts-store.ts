import { create } from "zustand";
import type { Discount, DiscountFormData, DiscountStats } from "../types";
import { MOCK_DISCOUNTS } from "../data/mock-discounts";
import { calculateDiscountStats, isDiscountExpired } from "../lib/discount-utils";

interface DiscountsState {
  discounts: Discount[];
  activeTenantId: string;
  searchQuery: string;
  statusFilter: "all" | "active" | "inactive" | "expired";
  typeFilter: "all" | "PERCENTAGE" | "FIXED";

  // Dialog states
  isFormOpen: boolean;
  isDeleteDialogOpen: boolean;
  isTargetDialogOpen: boolean;
  editingDiscount: Discount | null;
  deletingDiscount: Discount | null;
  targetingDiscount: Discount | null;

  // Filter & Search
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: "all" | "active" | "inactive" | "expired") => void;
  setTypeFilter: (type: "all" | "PERCENTAGE" | "FIXED") => void;

  // Dialog triggers
  openCreateDialog: () => void;
  openEditDialog: (discount: Discount) => void;
  closeFormDialog: () => void;
  openDeleteDialog: (discount: Discount) => void;
  closeDeleteDialog: () => void;
  openTargetDialog: (discount: Discount) => void;
  closeTargetDialog: () => void;

  // CRUD & Operations
  addDiscount: (data: DiscountFormData, tenantId?: string) => { success: boolean; error?: string; newId?: string };
  updateDiscount: (id: string, data: Partial<DiscountFormData>) => { success: boolean; error?: string };
  deleteDiscount: (id: string) => { success: boolean; error?: string };
  toggleStatus: (id: string) => { success: boolean; newStatus?: string; error?: string };
  assignTargets: (
    id: string,
    targets: { scope: Discount["scope"]; categoryIds?: string[]; productIds?: string[] }
  ) => { success: boolean; error?: string };

  getStats: () => DiscountStats;
  resetToMockData: () => void;
}

export const useDiscountsStore = create<DiscountsState>((set, get) => ({
  discounts: MOCK_DISCOUNTS,
  activeTenantId: "tenant-001",
  searchQuery: "",
  statusFilter: "all",
  typeFilter: "all",

  isFormOpen: false,
  isDeleteDialogOpen: false,
  isTargetDialogOpen: false,
  editingDiscount: null,
  deletingDiscount: null,
  targetingDiscount: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTypeFilter: (type) => set({ typeFilter: type }),

  openCreateDialog: () => set({ isFormOpen: true, editingDiscount: null }),
  openEditDialog: (discount) => set({ isFormOpen: true, editingDiscount: discount }),
  closeFormDialog: () => set({ isFormOpen: false, editingDiscount: null }),

  openDeleteDialog: (discount) => set({ isDeleteDialogOpen: true, deletingDiscount: discount }),
  closeDeleteDialog: () => set({ isDeleteDialogOpen: false, deletingDiscount: null }),

  openTargetDialog: (discount) => set({ isTargetDialogOpen: true, targetingDiscount: discount }),
  closeTargetDialog: () => set({ isTargetDialogOpen: false, targetingDiscount: null }),

  addDiscount: (data, tenantId = "tenant-001") => {
    // Basic validation
    if (!data.name?.trim()) {
      return { success: false, error: "عنوان تخفیف الزامی است" };
    }
    if (!data.code?.trim()) {
      return { success: false, error: "کد تخفیف الزامی است" };
    }
    const cleanCode = data.code.trim().toUpperCase();
    const existing = get().discounts.find((d) => d.code === cleanCode);
    if (existing) {
      return { success: false, error: "کد تخفیف وارد شده تکراری است" };
    }

    const newId = `disc-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const newDiscount: Discount = {
      id: newId,
      tenantId,
      name: data.name.trim(),
      code: cleanCode,
      description: data.description?.trim() || null,
      type: data.type,
      value: Number(data.value) || 0,
      status: data.status,
      startAt: data.startAt || now,
      endAt: data.endAt || now,
      usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
      usedCount: 0,
      perCustomerLimit: data.perCustomerLimit ? Number(data.perCustomerLimit) : null,
      minQuantity: data.minQuantity ? Number(data.minQuantity) : null,
      minPurchaseAmount: data.minPurchaseAmount ? Number(data.minPurchaseAmount) : null,
      priority: data.priority ? Number(data.priority) : 0,
      scope: data.scope || "ALL",
      productIds: data.productIds || [],
      categoryIds: data.categoryIds || [],
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      discounts: [newDiscount, ...state.discounts],
      isFormOpen: false,
      editingDiscount: null,
    }));

    return { success: true, newId };
  },

  updateDiscount: (id, data) => {
    const discounts = get().discounts;
    const target = discounts.find((d) => d.id === id);
    if (!target) {
      return { success: false, error: "تخفیف مورد نظر یافت نشد" };
    }

    if (data.code) {
      const cleanCode = data.code.trim().toUpperCase();
      const duplicate = discounts.find((d) => d.id !== id && d.code === cleanCode);
      if (duplicate) {
        return { success: false, error: "کد تخفیف وارد شده برای تخفیف دیگری استفاده شده است" };
      }
      data.code = cleanCode;
    }

    const now = new Date().toISOString();
    set((state) => ({
      discounts: state.discounts.map((d) =>
        d.id === id
          ? {
              ...d,
              ...data,
              code: data.code ? data.code.trim().toUpperCase() : d.code,
              value: data.value !== undefined ? Number(data.value) : d.value,
              updatedAt: now,
            }
          : d
      ),
      isFormOpen: false,
      editingDiscount: null,
    }));

    return { success: true };
  },

  deleteDiscount: (id) => {
    const discounts = get().discounts;
    const exists = discounts.some((d) => d.id === id);
    if (!exists) {
      return { success: false, error: "تخفیف برای حذف یافت نشد" };
    }

    set((state) => ({
      discounts: state.discounts.filter((d) => d.id !== id),
      isDeleteDialogOpen: false,
      deletingDiscount: null,
    }));

    return { success: true };
  },

  toggleStatus: (id) => {
    const discounts = get().discounts;
    const target = discounts.find((d) => d.id === id);
    if (!target) {
      return { success: false, error: "تخفیف یافت نشد" };
    }

    // Check if expired
    if (isDiscountExpired(target)) {
      return { success: false, error: "این تخفیف منقضی شده است و امکان فعال‌سازی مجدد ندارد" };
    }

    const newStatus: Discount["status"] = target.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const now = new Date().toISOString();

    set((state) => ({
      discounts: state.discounts.map((d) =>
        d.id === id ? { ...d, status: newStatus, updatedAt: now } : d
      ),
    }));

    return { success: true, newStatus };
  },

  assignTargets: (id, targets) => {
    const discounts = get().discounts;
    const target = discounts.find((d) => d.id === id);
    if (!target) {
      return { success: false, error: "تخفیف یافت نشد" };
    }

    const now = new Date().toISOString();
    set((state) => ({
      discounts: state.discounts.map((d) =>
        d.id === id
          ? {
              ...d,
              scope: targets.scope,
              categoryIds: targets.categoryIds ?? d.categoryIds,
              productIds: targets.productIds ?? d.productIds,
              updatedAt: now,
            }
          : d
      ),
      isTargetDialogOpen: false,
      targetingDiscount: null,
    }));

    return { success: true };
  },

  getStats: () => {
    return calculateDiscountStats(get().discounts);
  },

  resetToMockData: () => {
    set({
      discounts: MOCK_DISCOUNTS,
      searchQuery: "",
      statusFilter: "all",
      typeFilter: "all",
      isFormOpen: false,
      isDeleteDialogOpen: false,
      isTargetDialogOpen: false,
      editingDiscount: null,
      deletingDiscount: null,
      targetingDiscount: null,
    });
  },
}));
