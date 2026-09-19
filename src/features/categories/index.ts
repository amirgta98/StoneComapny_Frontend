/**
 * Categories Feature.
 *
 * Storefront category cards and sliders + Manager hierarchical category tree (up to 4 levels).
 */

export * from "./types";
export * from "./components/category-card";
export * from "./components/category-slider";
export * from "./data/test-categories";

// Manager Hierarchical Categories (up to 4 levels)
export { CategoriesManagerView } from "./components/manager/categories-manager-view";
export { CategoryTreeItem } from "./components/manager/category-tree-item";
export { CategoryFormDialog } from "./components/manager/category-form-dialog";
export { CategoryDeleteDialog } from "./components/manager/category-delete-dialog";
export { CategoryAutocomplete } from "./components/category-autocomplete";
export { useCategoriesStore } from "./stores/categories-store";
export {
  mockHierarchicalCategories,
  buildCategoryTree,
  getDescendantIds,
  canCategoryBeParent,
  getSubtreeHeight,
} from "./data/mock-hierarchical-categories";