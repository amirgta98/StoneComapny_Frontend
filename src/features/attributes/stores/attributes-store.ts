import { create } from "zustand";
import type {
  AttributeDefinition,
  AttributeFormData,
  AttributeGroup,
  AttributeDataType,
  AttributeOption,
  AttributeStats,
} from "../types";
import { mockAttributes } from "../data/mock-attributes";

interface AttributesState {
  attributes: AttributeDefinition[];
  activeTenantId: string;
  searchQuery: string;
  selectedGroup: AttributeGroup | "all";
  statusFilter: "all" | "active" | "inactive";
  typeFilter: AttributeDataType | "all";
  viewMode: "table" | "grid";

  // Actions
  initForTenant: (tenantId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGroup: (group: AttributeGroup | "all") => void;
  setStatusFilter: (status: "all" | "active" | "inactive") => void;
  setTypeFilter: (type: AttributeDataType | "all") => void;
  setViewMode: (mode: "table" | "grid") => void;

  addAttribute: (
    data: AttributeFormData,
    tenantId: string
  ) => { success: boolean; error?: string; newId?: string };

  updateAttribute: (
    id: string,
    data: Partial<AttributeFormData>
  ) => { success: boolean; error?: string };

  deleteAttribute: (id: string) => { success: boolean; error?: string };
  toggleStatus: (id: string) => void;
  duplicateAttribute: (id: string) => { success: boolean; error?: string; newId?: string };

  addOption: (attributeId: string, option: Omit<AttributeOption, "id">) => void;
  removeOption: (attributeId: string, optionId: string) => void;

  resetToFactoryDefaults: (tenantId: string) => void;
  getStats: () => AttributeStats;
}

export const useAttributesStore = create<AttributesState>((set, get) => ({
  attributes: mockAttributes,
  activeTenantId: "tenant-001",
  searchQuery: "",
  selectedGroup: "all",
  statusFilter: "all",
  typeFilter: "all",
  viewMode: "table",

  initForTenant: (tenantId: string) => {
    set((state) => {
      if (state.activeTenantId === tenantId) return state;
      return {
        activeTenantId: tenantId,
        attributes: mockAttributes.map((a) => ({ ...a, tenantId })),
      };
    });
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTypeFilter: (type) => set({ typeFilter: type }),
  setViewMode: (mode) => set({ viewMode: mode }),

  addAttribute: (data, tenantId) => {
    const { attributes } = get();

    // Check code uniqueness
    const code = data.code.trim().toLowerCase().replace(/[\s-]+/g, "_");
    const exists = attributes.some(
      (a) => a.code.toLowerCase() === code && a.tenantId === tenantId
    );
    if (exists) {
      return {
        success: false,
        error: `ویژگی دیگری با کد شناسه «${code}» قبلاً ثبت شده است.`,
      };
    }

    const newId = `attr-${Date.now()}`;
    const now = new Date().toISOString();

    const newAttr: AttributeDefinition = {
      id: newId,
      tenantId,
      code,
      name: data.name.trim(),
      nameEn: data.nameEn.trim(),
      group: data.group,
      dataType: data.dataType,
      unit: data.unit?.trim() || undefined,
      description: data.description?.trim() || undefined,
      options: data.options.length > 0 ? data.options : undefined,
      applicableStoneTypes: data.applicableStoneTypes,
      isVariantDriver: data.isVariantDriver,
      isFilterable: data.isFilterable,
      isRequired: data.isRequired,
      isActive: data.isActive,
      sortOrder: attributes.length + 1,
      productCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    set({ attributes: [newAttr, ...attributes] });
    return { success: true, newId };
  },

  updateAttribute: (id, data) => {
    const { attributes } = get();
    const index = attributes.findIndex((a) => a.id === id);
    if (index === -1) {
      return { success: false, error: "ویژگی مورد نظر یافت نشد." };
    }

    const existing = attributes[index];

    // If code is being changed, ensure uniqueness
    if (data.code && data.code !== existing.code) {
      const code = data.code.trim().toLowerCase().replace(/[\s-]+/g, "_");
      const exists = attributes.some(
        (a) => a.id !== id && a.code.toLowerCase() === code && a.tenantId === existing.tenantId
      );
      if (exists) {
        return {
          success: false,
          error: `کد شناسه «${code}» قبلاً برای ویژگی دیگری ثبت شده است.`,
        };
      }
    }

    const updated: AttributeDefinition = {
      ...existing,
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.nameEn !== undefined && { nameEn: data.nameEn.trim() }),
      ...(data.code !== undefined && {
        code: data.code.trim().toLowerCase().replace(/[\s-]+/g, "_"),
      }),
      ...(data.group !== undefined && { group: data.group }),
      ...(data.dataType !== undefined && { dataType: data.dataType }),
      ...(data.unit !== undefined && { unit: data.unit?.trim() || undefined }),
      ...(data.description !== undefined && {
        description: data.description?.trim() || undefined,
      }),
      ...(data.options !== undefined && { options: data.options }),
      ...(data.applicableStoneTypes !== undefined && {
        applicableStoneTypes: data.applicableStoneTypes,
      }),
      ...(data.isVariantDriver !== undefined && {
        isVariantDriver: data.isVariantDriver,
      }),
      ...(data.isFilterable !== undefined && {
        isFilterable: data.isFilterable,
      }),
      ...(data.isRequired !== undefined && { isRequired: data.isRequired }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      updatedAt: new Date().toISOString(),
    };

    const newAttributes = [...attributes];
    newAttributes[index] = updated;

    set({ attributes: newAttributes });
    return { success: true };
  },

  deleteAttribute: (id) => {
    const { attributes } = get();
    const target = attributes.find((a) => a.id === id);
    if (!target) {
      return { success: false, error: "ویژگی مورد نظر یافت نشد." };
    }

    set({
      attributes: attributes.filter((a) => a.id !== id),
    });
    return { success: true };
  },

  toggleStatus: (id) => {
    const { attributes } = get();
    set({
      attributes: attributes.map((a) =>
        a.id === id ? { ...a, isActive: !a.isActive, updatedAt: new Date().toISOString() } : a
      ),
    });
  },

  duplicateAttribute: (id) => {
    const { attributes } = get();
    const source = attributes.find((a) => a.id === id);
    if (!source) {
      return { success: false, error: "ویژگی مبدأ یافت نشد." };
    }

    const newId = `attr-${Date.now()}`;
    const newCode = `${source.code}_copy_${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    const clone: AttributeDefinition = {
      ...source,
      id: newId,
      code: newCode,
      name: `${source.name} (رونوشت)`,
      nameEn: `${source.nameEn} (Copy)`,
      productCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    set({ attributes: [clone, ...attributes] });
    return { success: true, newId };
  },

  addOption: (attributeId, option) => {
    const { attributes } = get();
    const newOption: AttributeOption = {
      ...option,
      id: `opt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    set({
      attributes: attributes.map((attr) => {
        if (attr.id !== attributeId) return attr;
        const currentOptions = attr.options ?? [];
        return {
          ...attr,
          options: [...currentOptions, newOption],
          updatedAt: new Date().toISOString(),
        };
      }),
    });
  },

  removeOption: (attributeId, optionId) => {
    const { attributes } = get();
    set({
      attributes: attributes.map((attr) => {
        if (attr.id !== attributeId) return attr;
        return {
          ...attr,
          options: (attr.options ?? []).filter((opt) => opt.id !== optionId),
          updatedAt: new Date().toISOString(),
        };
      }),
    });
  },

  resetToFactoryDefaults: (tenantId) => {
    set({
      attributes: mockAttributes.map((a) => ({ ...a, tenantId })),
      searchQuery: "",
      selectedGroup: "all",
      statusFilter: "all",
      typeFilter: "all",
    });
  },

  getStats: () => {
    const { attributes } = get();

    const groupCounts: Record<AttributeGroup, number> = {
      finishes: 0,
      physical: 0,
      dimensions: 0,
      grading: 0,
      application: 0,
      commercial: 0,
    };

    let activeCount = 0;
    let variantCount = 0;
    let filterableCount = 0;
    let totalProductsAssigned = 0;

    for (const attr of attributes) {
      if (groupCounts[attr.group] !== undefined) {
        groupCounts[attr.group]++;
      }
      if (attr.isActive) activeCount++;
      if (attr.isVariantDriver) variantCount++;
      if (attr.isFilterable) filterableCount++;
      totalProductsAssigned += attr.productCount;
    }

    return {
      totalAttributes: attributes.length,
      activeAttributes: activeCount,
      variantDrivers: variantCount,
      filterableCount,
      totalProductsAssigned,
      groupCounts,
    };
  },
}));
