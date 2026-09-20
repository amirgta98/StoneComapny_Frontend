import type {
  NavigationPageItem,
  NavigationStats,
  NavFilterSection,
  NavFilterVisibility,
  NavSortOption,
} from "../types";
import { MOCK_NAVIGATION_PAGES } from "./mock-navigation-pages";

const STORAGE_KEY = "stone_company_navigation_pages_v1";

/**
 * Normalizes Persian/Arabic digits and lowers case for consistent searching.
 */
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .trim();
}

/**
 * Computes high-level statistics for the navigation configuration.
 */
export function calculateNavigationStats(
  pages: NavigationPageItem[]
): NavigationStats {
  const total = pages.length;
  let visibleCount = 0;
  let headerCount = 0;
  let footerCount = 0;
  let mobileCount = 0;

  for (const page of pages) {
    if (page.isVisible) {
      visibleCount += 1;
    }
    if (page.section === "header") {
      headerCount += 1;
    } else if (
      page.section === "footer_main" ||
      page.section === "footer_stones"
    ) {
      footerCount += 1;
    } else if (page.section === "mobile_account") {
      mobileCount += 1;
    }
  }

  const hiddenCount = total - visibleCount;
  const visibilityRatio = total > 0 ? Math.round((visibleCount / total) * 100) : 0;

  return {
    total,
    visibleCount,
    hiddenCount,
    headerCount,
    footerCount,
    mobileCount,
    visibilityRatio,
  };
}

/**
 * Filters and sorts navigation pages based on criteria.
 */
export function filterAndSortPages(
  pages: NavigationPageItem[],
  filters: {
    searchQuery: string;
    sectionFilter: NavFilterSection;
    visibilityFilter: NavFilterVisibility;
    sortBy?: NavSortOption;
  }
): NavigationPageItem[] {
  const { searchQuery, sectionFilter, visibilityFilter, sortBy = "order" } =
    filters;
  const q = normalizeQuery(searchQuery);

  const filtered = pages.filter((item) => {
    // Section filter
    if (sectionFilter !== "all" && item.section !== sectionFilter) {
      return false;
    }

    // Visibility filter
    if (visibilityFilter === "visible" && !item.isVisible) {
      return false;
    }
    if (visibilityFilter === "hidden" && item.isVisible) {
      return false;
    }

    // Search query match
    if (q) {
      const matchTitle = normalizeQuery(item.title).includes(q);
      const matchTitleEn = item.titleEn.toLowerCase().includes(q);
      const matchPath = item.path.toLowerCase().includes(q);
      const matchDesc = item.description
        ? normalizeQuery(item.description).includes(q)
        : false;
      const matchBadge = item.badge
        ? normalizeQuery(item.badge).includes(q)
        : false;

      if (
        !matchTitle &&
        !matchTitleEn &&
        !matchPath &&
        !matchDesc &&
        !matchBadge
      ) {
        return false;
      }
    }

    return true;
  });

  return filtered.sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title, "fa");
    }
    if (sortBy === "path") {
      return a.path.localeCompare(b.path);
    }
    if (sortBy === "section") {
      return a.section.localeCompare(b.section) || a.order - b.order;
    }
    // Default: by section order then internal order
    if (a.section !== b.section) {
      const sectionPriority = {
        header: 1,
        footer_main: 2,
        footer_stones: 3,
        mobile_account: 4,
      };
      return sectionPriority[a.section] - sectionPriority[b.section];
    }
    return a.order - b.order;
  });
}

/**
 * Storage helpers for persisting state across browser refreshes.
 */
export const navigationStorage = {
  load(): NavigationPageItem[] {
    if (typeof window === "undefined") return MOCK_NAVIGATION_PAGES;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse/quota errors
    }
    return MOCK_NAVIGATION_PAGES;
  },

  save(pages: NavigationPageItem[]): boolean {
    if (typeof window === "undefined") return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
      return true;
    } catch {
      return false;
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  },
};
