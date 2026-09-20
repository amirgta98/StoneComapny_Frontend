/**
 * Navigation Visibility & Access Manager Type Definitions.
 */

export type NavSectionKey =
  | "header"
  | "footer_main"
  | "footer_stones"
  | "mobile_account";

export interface NavSectionMeta {
  id: NavSectionKey;
  label: string;
  description: string;
  badgeClass: string;
}

export interface NavigationPageItem {
  id: string;
  title: string;
  titleEn: string;
  path: string;
  section: NavSectionKey;
  sectionLabel: string;
  isVisible: boolean;
  order: number;
  isSystem: boolean;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "warning" | "destructive" | "outline";
  icon?: string;
  target?: "_self" | "_blank";
  updatedAt?: string;
  description?: string;
}

export type NavFilterSection = "all" | NavSectionKey;
export type NavFilterVisibility = "all" | "visible" | "hidden";
export type NavSortOption = "order" | "title" | "path" | "section";

export interface NavigationStats {
  total: number;
  visibleCount: number;
  hiddenCount: number;
  headerCount: number;
  footerCount: number;
  mobileCount: number;
  visibilityRatio: number;
}
