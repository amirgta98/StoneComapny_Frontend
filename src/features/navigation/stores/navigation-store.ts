import { create } from "zustand";
import { toast } from "sonner";
import type {
  NavigationPageItem,
  NavigationStats,
  NavFilterSection,
  NavFilterVisibility,
  NavSortOption,
} from "../types";
import { MOCK_NAVIGATION_PAGES } from "../data/mock-navigation-pages";
import {
  calculateNavigationStats,
  filterAndSortPages,
  navigationStorage,
} from "../data/navigation-service";

interface NavigationState {
  pages: NavigationPageItem[];
  savedPages: NavigationPageItem[];
  autoSave: boolean;
  isLoading: boolean;
  isSaving: boolean;
  searchQuery: string;
  sectionFilter: NavFilterSection;
  visibilityFilter: NavFilterVisibility;
  sortBy: NavSortOption;
  selectedIds: string[];

  // Initialization & Reload
  initFromStorage: () => void;
  simulateReload: () => Promise<void>;
  resetToDefaults: () => void;

  // Filters & Search
  setSearchQuery: (query: string) => void;
  setSectionFilter: (section: NavFilterSection) => void;
  setVisibilityFilter: (visibility: NavFilterVisibility) => void;
  setSortBy: (sort: NavSortOption) => void;
  clearFilters: () => void;

  // Selection
  toggleSelectPage: (id: string) => void;
  selectAllVisible: (ids: string[]) => void;
  clearSelection: () => void;

  // Visibility Toggles & Persistence
  toggleAutoSave: () => void;
  togglePageVisibility: (id: string) => void;
  bulkSetVisibility: (isVisible: boolean) => Promise<void>;
  saveChanges: () => Promise<boolean>;
  discardChanges: () => void;

  // Computed / Helpers
  hasUnsavedChanges: () => boolean;
  getStats: () => NavigationStats;
  getFilteredPages: () => NavigationPageItem[];
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  pages: MOCK_NAVIGATION_PAGES,
  savedPages: MOCK_NAVIGATION_PAGES,
  autoSave: true,
  isLoading: false,
  isSaving: false,
  searchQuery: "",
  sectionFilter: "all",
  visibilityFilter: "all",
  sortBy: "order",
  selectedIds: [],

  initFromStorage: () => {
    const loaded = navigationStorage.load();
    set({
      pages: loaded,
      savedPages: loaded,
    });
  },

  simulateReload: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 600));
    const loaded = navigationStorage.load();
    set({
      pages: loaded,
      savedPages: loaded,
      isLoading: false,
      selectedIds: [],
    });
    toast.info("لیست صفحات ناوبری با موفقیت به‌روزرسانی شد.");
  },

  resetToDefaults: () => {
    navigationStorage.clear();
    set({
      pages: MOCK_NAVIGATION_PAGES,
      savedPages: MOCK_NAVIGATION_PAGES,
      selectedIds: [],
    });
    toast.success("پیکربندی منوها به مقادیر پیش‌فرض کارخانه بازنشانی شد.");
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSectionFilter: (sectionFilter) => set({ sectionFilter }),
  setVisibilityFilter: (visibilityFilter) => set({ visibilityFilter }),
  setSortBy: (sortBy) => set({ sortBy }),

  clearFilters: () => {
    set({
      searchQuery: "",
      sectionFilter: "all",
      visibilityFilter: "all",
      sortBy: "order",
    });
  },

  toggleSelectPage: (id) => {
    set((state) => {
      const exists = state.selectedIds.includes(id);
      return {
        selectedIds: exists
          ? state.selectedIds.filter((item) => item !== id)
          : [...state.selectedIds, id],
      };
    });
  },

  selectAllVisible: (ids) => {
    set((state) => {
      const allSelected = ids.every((id) => state.selectedIds.includes(id));
      if (allSelected) {
        return {
          selectedIds: state.selectedIds.filter((id) => !ids.includes(id)),
        };
      }
      return {
        selectedIds: Array.from(new Set([...state.selectedIds, ...ids])),
      };
    });
  },

  clearSelection: () => set({ selectedIds: [] }),

  toggleAutoSave: () => {
    const nextMode = !get().autoSave;
    set({ autoSave: nextMode });
    if (nextMode) {
      // If switching to auto-save, immediately commit any dirty state
      const { pages } = get();
      navigationStorage.save(pages);
      set({ savedPages: pages });
      toast.success("حالت ذخیره خودکار فعال شد. تغییرات بلافاصله اعمال می‌شوند.");
    } else {
      toast.info(
        "حالت ذخیره دستی فعال شد. پس از اعمال تغییرات، دکمه «ذخیره تغییرات» را بزنید."
      );
    }
  },

  togglePageVisibility: (id) => {
    const { pages, autoSave } = get();
    const targetPage = pages.find((p) => p.id === id);
    if (!targetPage) return;

    const nextVisibility = !targetPage.isVisible;
    const nowPersian = new Date().toLocaleDateString("fa-IR");

    const updatedPages = pages.map((page) =>
      page.id === id
        ? {
            ...page,
            isVisible: nextVisibility,
            updatedAt: nowPersian,
          }
        : page
    );

    if (autoSave) {
      navigationStorage.save(updatedPages);
      set({
        pages: updatedPages,
        savedPages: updatedPages,
      });
      toast.success(
        `صفحه «${targetPage.title}» در منو ${
          nextVisibility ? "فعال و نمایان" : "غیرفعال و مخفی"
        } شد.`
      );
    } else {
      set({ pages: updatedPages });
    }
  },

  bulkSetVisibility: async (isVisible) => {
    const { pages, selectedIds, autoSave } = get();
    if (selectedIds.length === 0) return;

    const nowPersian = new Date().toLocaleDateString("fa-IR");
    const updatedPages = pages.map((page) =>
      selectedIds.includes(page.id)
        ? {
            ...page,
            isVisible,
            updatedAt: nowPersian,
          }
        : page
    );

    if (autoSave) {
      navigationStorage.save(updatedPages);
      set({
        pages: updatedPages,
        savedPages: updatedPages,
        selectedIds: [],
      });
      toast.success(
        `وضعیت ${selectedIds.length} صفحه انتخاب‌شده به «${
          isVisible ? "نمایش در منو" : "مخفی از منو"
        }» تغییر یافت.`
      );
    } else {
      set({
        pages: updatedPages,
        selectedIds: [],
      });
      toast.info(
        `${selectedIds.length} صفحه انتخاب‌شده تغییر یافتند. جهت ذخیره‌سازی، دکمه «ذخیره تغییرات» را بزنید.`
      );
    }
  },

  saveChanges: async () => {
    const { pages } = get();
    set({ isSaving: true });
    try {
      // Simulate network / API persistence delay
      await new Promise((resolve) => setTimeout(resolve, 400));
      navigationStorage.save(pages);
      set({
        savedPages: pages,
        isSaving: false,
      });
      toast.success("تمامی تغییرات دیده‌بانی منوها با موفقیت در سیستم ذخیره شد.");
      return true;
    } catch {
      set({ isSaving: false });
      toast.error("خطا در ذخیره‌سازی تغییرات ناوبری. لطفا مجددا تلاش کنید.");
      return false;
    }
  },

  discardChanges: () => {
    const { savedPages } = get();
    set({
      pages: savedPages,
      selectedIds: [],
    });
    toast.info("تغییرات ذخیره‌نشده لغو شدند و منوها به آخرین وضعیت ذخیره‌شده بازگشتند.");
  },

  hasUnsavedChanges: () => {
    const { pages, savedPages } = get();
    if (pages.length !== savedPages.length) return true;
    for (let i = 0; i < pages.length; i++) {
      if (
        pages[i].id !== savedPages[i].id ||
        pages[i].isVisible !== savedPages[i].isVisible
      ) {
        return true;
      }
    }
    return false;
  },

  getStats: () => {
    return calculateNavigationStats(get().pages);
  },

  getFilteredPages: () => {
    const { pages, searchQuery, sectionFilter, visibilityFilter, sortBy } =
      get();
    return filterAndSortPages(pages, {
      searchQuery,
      sectionFilter,
      visibilityFilter,
      sortBy,
    });
  },
}));
