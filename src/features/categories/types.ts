/**
 * Category domain types.
 */

export const MAX_CATEGORY_DEPTH = 4;

export type Category = {
  id: string;
  /** Display name (Persian). */
  name: string;
  /** URL-friendly identifier used for routing. */
  slug: string;
  /** Cover image URL. */
  image: string;
  /** Number of products inside this category. */
  productCount: number;
};

/**
 * Hierarchical Category Node with nested parent-child relationship.
 * Constrained strictly to maximum depth of 4 levels (1 to 4).
 */
export interface CategoryNode {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId: string | null;
  /** 1 = Root, 2 = Subcategory, 3 = Sub-subcategory, 4 = Final Leaf (MAX) */
  depth: 1 | 2 | 3 | 4;
  order: number;
  isActive: boolean;
  productCount: number;
  children?: CategoryNode[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId: string | null;
  isActive: boolean;
}

export interface CategoryTreeStats {
  totalCategories: number;
  rootCategories: number;
  maxDepthUsed: number;
  totalProducts: number;
  activeCategories: number;
}