import { create } from "zustand";
import type { CategoryNode, CategoryFormData, CategoryTreeStats } from "../types";
import { MAX_CATEGORY_DEPTH } from "../types";
import {
  mockHierarchicalCategories,
  canCategoryBeParent,
  getDescendantIds,
} from "../data/mock-hierarchical-categories";

interface CategoriesState {
  categories: CategoryNode[];
  expandedIds: string[];
  searchQuery: string;
  activeTenantId: string;

  // Actions
  initForTenant: (tenantId: string) => void;
  setSearchQuery: (query: string) => void;
  toggleExpand: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;

  addCategory: (
    data: CategoryFormData,
    tenantId: string
  ) => { success: boolean; error?: string; newId?: string };

  updateCategory: (
    id: string,
    data: Partial<CategoryFormData>
  ) => { success: boolean; error?: string };

  deleteCategory: (id: string) => { success: boolean; error?: string };
  toggleStatus: (id: string) => void;

  getStats: () => CategoryTreeStats;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: mockHierarchicalCategories,
  expandedIds: ["cat-1", "cat-1-1", "cat-1-1-1", "cat-2", "cat-3", "cat-4"],
  searchQuery: "",
  activeTenantId: "tenant-001",

  initForTenant: (tenantId: string) => {
    set((state) => {
      if (state.activeTenantId === tenantId) return state;
      // Filter mock or scope to tenant
      const filtered = mockHierarchicalCategories.filter(
        (c) => c.tenantId === tenantId || c.tenantId === "tenant-001"
      );
      return {
        activeTenantId: tenantId,
        categories: filtered.length > 0 ? filtered : mockHierarchicalCategories,
        expandedIds: ["cat-1", "cat-1-1", "cat-2"],
      };
    });
  },

  setSearchQuery: (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      set({ searchQuery: "" });
      return;
    }

    const { categories } = get();
    const matchingIds = new Set<string>();

    // Find all matching nodes and their parents so they are visible
    for (const cat of categories) {
      if (
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q)
      ) {
        matchingIds.add(cat.id);
        // Expand parents
        let currParentId = cat.parentId;
        while (currParentId) {
          matchingIds.add(currParentId);
          const p = categories.find((c) => c.id === currParentId);
          currParentId = p ? p.parentId : null;
        }
      }
    }

    set((state) => ({
      searchQuery: query,
      expandedIds: Array.from(new Set([...state.expandedIds, ...Array.from(matchingIds)])),
    }));
  },

  toggleExpand: (id: string) => {
    set((state) => {
      const isExpanded = state.expandedIds.includes(id);
      return {
        expandedIds: isExpanded
          ? state.expandedIds.filter((item) => item !== id)
          : [...state.expandedIds, id],
      };
    });
  },

  expandAll: () => {
    const { categories } = get();
    set({ expandedIds: categories.map((c) => c.id) });
  },

  collapseAll: () => {
    set({ expandedIds: [] });
  },

  addCategory: (data: CategoryFormData, tenantId: string) => {
    const { categories } = get();

    // Check depth constraint (MAX_CATEGORY_DEPTH = 4)
    const check = canCategoryBeParent(null, data.parentId, categories, MAX_CATEGORY_DEPTH);
    if (!check.allowed) {
      return { success: false, error: check.reason };
    }

    const newId = `cat-${Date.now()}`;
    const siblings = categories.filter((c) => c.parentId === data.parentId);
    const order = siblings.length + 1;

    const newCategory: CategoryNode = {
      id: newId,
      tenantId,
      name: data.name.trim(),
      slug: data.slug.trim() || `category-${Date.now()}`,
      description: data.description?.trim(),
      image: data.image || "/test_images/stones/test_1.jpg",
      parentId: data.parentId,
      depth: check.resultingDepth,
      order,
      isActive: data.isActive,
      productCount: 0,
      createdAt: new Date().toLocaleDateString("fa-IR"),
    };

    set((state) => ({
      categories: [...state.categories, newCategory],
      // If parent exists, auto expand it
      expandedIds: data.parentId
        ? Array.from(new Set([...state.expandedIds, data.parentId]))
        : state.expandedIds,
    }));

    return { success: true, newId };
  },

  updateCategory: (id: string, data: Partial<CategoryFormData>) => {
    const { categories } = get();
    const current = categories.find((c) => c.id === id);
    if (!current) {
      return { success: false, error: "دسته‌بندی یافت نشد." };
    }

    let nextDepth = current.depth;

    // If parent is changing, revalidate 4-level constraint
    if (data.parentId !== undefined && data.parentId !== current.parentId) {
      const check = canCategoryBeParent(id, data.parentId, categories, MAX_CATEGORY_DEPTH);
      if (!check.allowed) {
        return { success: false, error: check.reason };
      }
      nextDepth = check.resultingDepth;
    }

    const depthDiff = nextDepth - current.depth;
    const descendantIds = getDescendantIds(id, categories);

    set((state) => ({
      categories: state.categories.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            name: data.name !== undefined ? data.name.trim() : item.name,
            slug: data.slug !== undefined ? data.slug.trim() : item.slug,
            description: data.description !== undefined ? data.description.trim() : item.description,
            image: data.image !== undefined ? data.image : item.image,
            parentId: data.parentId !== undefined ? data.parentId : item.parentId,
            depth: nextDepth,
            isActive: data.isActive !== undefined ? data.isActive : item.isActive,
            updatedAt: new Date().toLocaleDateString("fa-IR"),
          };
        }

        // If child of modified node, adjust its depth accordingly
        if (descendantIds.has(item.id) && depthDiff !== 0) {
          return {
            ...item,
            depth: Math.min(Math.max(item.depth + depthDiff, 1), 4) as 1 | 2 | 3 | 4,
          };
        }

        return item;
      }),
      expandedIds:
        data.parentId && data.parentId !== current.parentId
          ? Array.from(new Set([...state.expandedIds, data.parentId]))
          : state.expandedIds,
    }));

    return { success: true };
  },

  deleteCategory: (id: string) => {
    const { categories } = get();
    const target = categories.find((c) => c.id === id);
    if (!target) return { success: false, error: "دسته یافت نشد." };

    const toDelete = new Set<string>([id, ...Array.from(getDescendantIds(id, categories))]);

    set((state) => ({
      categories: state.categories.filter((c) => !toDelete.has(c.id)),
      expandedIds: state.expandedIds.filter((expId) => !toDelete.has(expId)),
    }));

    return { success: true };
  },

  toggleStatus: (id: string) => {
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      ),
    }));
  },

  getStats: () => {
    const { categories } = get();
    const rootCategories = categories.filter((c) => c.parentId === null).length;
    const maxDepthUsed = categories.reduce((max, c) => Math.max(max, c.depth), 1);
    const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);
    const activeCategories = categories.filter((c) => c.isActive).length;

    return {
      totalCategories: categories.length,
      rootCategories,
      maxDepthUsed,
      totalProducts,
      activeCategories,
    };
  },
}));
