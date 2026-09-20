import { create } from "zustand";
import { toast } from "sonner";
import type {
  PageSeoItem,
  GlobalSeoSettings,
  SeoAuditChecklist,
  SeoActiveTab,
  PageFilterCategory,
  PageFilterStatus,
  PageSortOption,
  SeoStats,
} from "../types";
import {
  MOCK_PAGE_SEO_ITEMS,
  DEFAULT_GLOBAL_SEO_SETTINGS,
  MOCK_SEO_AUDIT_ITEMS,
} from "../data/mock-seo-data";
import {
  calculateSeoStats,
  filterAndSortPages,
  generateSitemapXml,
  seoStorage,
} from "../data/seo-service";

interface SeoStoreState {
  pages: PageSeoItem[];
  savedPages: PageSeoItem[];
  globalSettings: GlobalSeoSettings;
  savedGlobalSettings: GlobalSeoSettings;
  auditItems: SeoAuditChecklist[];

  activeTab: SeoActiveTab;
  searchQuery: string;
  categoryFilter: PageFilterCategory;
  statusFilter: PageFilterStatus;
  sortBy: PageSortOption;

  serpPreviewPage: PageSeoItem | null;
  editingPage: PageSeoItem | null;

  isLoading: boolean;
  isSaving: boolean;

  // Lifecycle
  initFromStorage: () => void;
  resetToDefaults: () => void;
  saveAllChanges: () => Promise<boolean>;
  discardChanges: () => void;
  hasUnsavedChanges: () => boolean;

  // Tab & Filters
  setActiveTab: (tab: SeoActiveTab) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: PageFilterCategory) => void;
  setStatusFilter: (status: PageFilterStatus) => void;
  setSortBy: (sort: PageSortOption) => void;
  clearFilters: () => void;

  // Dialogs
  openSerpPreview: (page: PageSeoItem) => void;
  closeSerpPreview: () => void;
  openEditDialog: (page: PageSeoItem) => void;
  closeEditDialog: () => void;
  updateEditingDraft: (updates: Partial<PageSeoItem>) => void;
  saveEditingPage: () => void;

  // Page Operations
  togglePageIndexing: (id: string) => void;

  // Global & Sitemap Operations
  updateGlobalSettings: (updates: Partial<GlobalSeoSettings>) => void;
  updateRobotsTxt: (content: string) => void;
  regenerateSitemap: () => void;

  // Computed
  getStats: () => SeoStats;
  getFilteredPages: () => PageSeoItem[];
  getSitemapXml: () => string;
}

export const useSeoStore = create<SeoStoreState>((set, get) => ({
  pages: MOCK_PAGE_SEO_ITEMS,
  savedPages: MOCK_PAGE_SEO_ITEMS,
  globalSettings: DEFAULT_GLOBAL_SEO_SETTINGS,
  savedGlobalSettings: DEFAULT_GLOBAL_SEO_SETTINGS,
  auditItems: MOCK_SEO_AUDIT_ITEMS,

  activeTab: "pages",
  searchQuery: "",
  categoryFilter: "all",
  statusFilter: "all",
  sortBy: "health",

  serpPreviewPage: null,
  editingPage: null,

  isLoading: false,
  isSaving: false,

  initFromStorage: () => {
    const loaded = seoStorage.load();
    set({
      pages: JSON.parse(JSON.stringify(loaded.pages)),
      savedPages: JSON.parse(JSON.stringify(loaded.pages)),
      globalSettings: JSON.parse(JSON.stringify(loaded.globalSettings)),
      savedGlobalSettings: JSON.parse(JSON.stringify(loaded.globalSettings)),
    });
  },

  resetToDefaults: () => {
    seoStorage.clear();
    set({
      pages: JSON.parse(JSON.stringify(MOCK_PAGE_SEO_ITEMS)),
      savedPages: JSON.parse(JSON.stringify(MOCK_PAGE_SEO_ITEMS)),
      globalSettings: JSON.parse(JSON.stringify(DEFAULT_GLOBAL_SEO_SETTINGS)),
      savedGlobalSettings: JSON.parse(JSON.stringify(DEFAULT_GLOBAL_SEO_SETTINGS)),
      auditItems: MOCK_SEO_AUDIT_ITEMS,
      editingPage: null,
      serpPreviewPage: null,
    });
    toast.success("تنظیمات سئو و متادیتا به مقادیر پیش‌فرض کارخانه بازنشانی شد.");
  },

  saveAllChanges: async () => {
    set({ isSaving: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    const { pages, globalSettings } = get();
    seoStorage.save(pages, globalSettings);
    set({
      savedPages: JSON.parse(JSON.stringify(pages)),
      savedGlobalSettings: JSON.parse(JSON.stringify(globalSettings)),
      isSaving: false,
    });
    toast.success("تنظیمات سئو و متادیتای کارخانه با موفقیت ذخیره شد.");
    return true;
  },

  discardChanges: () => {
    const { savedPages, savedGlobalSettings } = get();
    set({
      pages: JSON.parse(JSON.stringify(savedPages)),
      globalSettings: JSON.parse(JSON.stringify(savedGlobalSettings)),
      editingPage: null,
    });
    toast.info("تغییرات ذخیره‌نشده لغو شدند.");
  },

  hasUnsavedChanges: () => {
    const { pages, savedPages, globalSettings, savedGlobalSettings } = get();
    const pagesChanged = JSON.stringify(pages) !== JSON.stringify(savedPages);
    const globalChanged =
      JSON.stringify(globalSettings) !== JSON.stringify(savedGlobalSettings);
    return pagesChanged || globalChanged;
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSortBy: (sort) => set({ sortBy: sort }),
  clearFilters: () =>
    set({
      searchQuery: "",
      categoryFilter: "all",
      statusFilter: "all",
      sortBy: "health",
    }),

  openSerpPreview: (page) => set({ serpPreviewPage: page }),
  closeSerpPreview: () => set({ serpPreviewPage: null }),

  openEditDialog: (page) => set({ editingPage: { ...page } }),
  closeEditDialog: () => set({ editingPage: null }),

  updateEditingDraft: (updates) => {
    const { editingPage } = get();
    if (!editingPage) return;

    // Recalculate health score dynamically
    const draft = { ...editingPage, ...updates };
    let score = 100;
    const issues: typeof draft.healthIssues = [];

    const titleLen = (draft.title || "").length;
    if (titleLen < 30) {
      score -= 20;
      issues.push({
        id: "short-title",
        level: "warning",
        message: "عنوان صفحه کوتاه است (حداقل ۳۰ کاراکتر توصیه می‌شود).",
      });
    } else if (titleLen > 65) {
      score -= 10;
      issues.push({
        id: "long-title",
        level: "warning",
        message: "عنوان صفحه ممکن است در نتایج جستجوی گوگل کوتاه یا شکسته شود (> ۶۵ کاراکتر).",
      });
    }

    const descLen = (draft.metaDescription || "").length;
    if (descLen < 80) {
      score -= 25;
      issues.push({
        id: "short-desc",
        level: "warning",
        message: "توضیحات متای صفحه بسیار کوتاه است (حداقل ۸۰ کاراکتر توصیه می‌شود).",
      });
    } else if (descLen > 165) {
      score -= 10;
      issues.push({
        id: "long-desc",
        level: "warning",
        message: "توضیحات متا در موبایل بریده خواهد شد (> ۱۶۵ کاراکتر).",
      });
    }

    if (!draft.keywords || draft.keywords.length === 0) {
      score -= 15;
      issues.push({
        id: "no-keywords",
        level: "warning",
        message: "هیچ کلمه کلیدی هدفی برای این صفحه ثبت نشده است.",
      });
    }

    draft.healthScore = Math.max(10, Math.min(100, score));
    draft.healthIssues = issues;

    set({ editingPage: draft });
  },

  saveEditingPage: () => {
    const { editingPage, pages } = get();
    if (!editingPage) return;

    const updatedPages = pages.map((p) =>
      p.id === editingPage.id
        ? {
            ...editingPage,
            lastModified: new Date().toLocaleDateString("fa-IR"),
          }
        : p
    );

    set({
      pages: updatedPages,
      editingPage: null,
    });
    toast.success(`متادیتای سئو «${editingPage.pageName}» به‌روزرسانی شد.`);
  },

  togglePageIndexing: (id) => {
    const { pages } = get();
    const target = pages.find((p) => p.id === id);
    if (!target) return;

    const nextIndexed = !target.isIndexed;
    const nextRobots = nextIndexed ? "index, follow" : "noindex, nofollow";

    const updatedPages = pages.map((p) =>
      p.id === id
        ? {
            ...p,
            isIndexed: nextIndexed,
            robotsDirective: nextRobots as PageSeoItem["robotsDirective"],
            lastModified: new Date().toLocaleDateString("fa-IR"),
          }
        : p
    );

    set({ pages: updatedPages });
    toast.info(
      `وضعیت ایندکس «${target.pageName}» به ${
        nextIndexed ? "ایندکس فعال (Index)" : "غیرفعال (NoIndex)"
      } تغییر یافت.`
    );
  },

  updateGlobalSettings: (updates) => {
    const { globalSettings } = get();
    set({
      globalSettings: { ...globalSettings, ...updates },
    });
  },

  updateRobotsTxt: (content) => {
    const { globalSettings } = get();
    set({
      globalSettings: { ...globalSettings, robotsTxtContent: content },
    });
    toast.success("دستورات robots.txt تغییر یافت.");
  },

  regenerateSitemap: () => {
    const { pages, globalSettings } = get();
    const xml = generateSitemapXml(pages, globalSettings.canonicalBaseUrl);
    toast.success(`نقشه سایت با ${pages.filter((p) => p.isIndexed).length} آدرس فعال بازسازی شد.`);
  },

  getStats: () => {
    const { pages } = get();
    return calculateSeoStats(pages);
  },

  getFilteredPages: () => {
    const { pages, searchQuery, categoryFilter, statusFilter, sortBy } = get();
    return filterAndSortPages(
      pages,
      searchQuery,
      categoryFilter,
      statusFilter,
      sortBy
    );
  },

  getSitemapXml: () => {
    const { pages, globalSettings } = get();
    return generateSitemapXml(pages, globalSettings.canonicalBaseUrl);
  },
}));
