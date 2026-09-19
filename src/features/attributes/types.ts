import type { StoneType } from "@/constants";

/**
 * 6 primary attribute groups for stone factory catalog:
 * - finishes: Surface processing (ساب صیقلی، مات هوند، چرمی، بوش‌همر، سندبلاست...)
 * - physical: Mechanical & lab properties (جذب آب، مقاومت فشاری، سختی موس...)
 * - dimensions: Sizing & cut specs (ضخامت اسلب، ابعاد تایل، قد و قواره)
 * - grading: Sorting & quality standards (سوپر صادراتی، ممتاز، درجه یک)
 * - application: Installation areas & conditions (نما، کف، محوطه، اسیدپذیری)
 * - commercial: Packaging & logistics (نوع مهار، پالت چوبی، خرک فلزی)
 */
export type AttributeGroup =
  | "finishes"
  | "physical"
  | "dimensions"
  | "grading"
  | "application"
  | "commercial";

export interface AttributeGroupMetadata {
  id: AttributeGroup;
  title: string;
  titleEn: string;
  description: string;
  badgeClass: string;
  iconName: string;
}

export type AttributeDataType =
  | "select"
  | "multiselect"
  | "number"
  | "text"
  | "boolean"
  | "range";

export interface AttributeOption {
  id: string;
  label: string;
  labelEn?: string;
  value: string;
  colorHex?: string;
  glossLevel?: string;
  slipRating?: string;
  description?: string;
  isDefault?: boolean;
}

export interface AttributeDefinition {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  nameEn: string;
  group: AttributeGroup;
  dataType: AttributeDataType;
  unit?: string;
  description?: string;
  options?: AttributeOption[];
  applicableStoneTypes?: StoneType[];
  /** Flag: Does this attribute create product variations / SKUs? (e.g. Finish, Thickness) */
  isVariantDriver: boolean;
  /** Flag: Display as a faceted filter in storefront & search */
  isFilterable: boolean;
  /** Flag: Mandatory field when drafting a new stone catalog product */
  isRequired: boolean;
  isActive: boolean;
  sortOrder: number;
  /** How many stone products are currently using this attribute */
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AttributeFormData {
  code: string;
  name: string;
  nameEn: string;
  group: AttributeGroup;
  dataType: AttributeDataType;
  unit?: string;
  description?: string;
  options: AttributeOption[];
  applicableStoneTypes?: StoneType[];
  isVariantDriver: boolean;
  isFilterable: boolean;
  isRequired: boolean;
  isActive: boolean;
}

export interface AttributeStats {
  totalAttributes: number;
  activeAttributes: number;
  variantDrivers: number;
  filterableCount: number;
  totalProductsAssigned: number;
  groupCounts: Record<AttributeGroup, number>;
}
