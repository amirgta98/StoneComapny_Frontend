export const PERMISSIONS = {
  PRODUCT_READ: "product.read",
  PRODUCT_CREATE: "product.create",
  PRODUCT_UPDATE: "product.update",
  PRODUCT_DELETE: "product.delete",

  ORDER_READ: "order.read",
  ORDER_UPDATE: "order.update",

  THEME_READ: "theme.read",
  THEME_UPDATE: "theme.update",

  TENANT_READ: "tenant.read",
  TENANT_CREATE: "tenant.create",
  TENANT_UPDATE: "tenant.update",
  TENANT_DELETE: "tenant.delete",

  USER_READ: "user.read",
  USER_CREATE: "user.create",
  USER_UPDATE: "user.update",
  USER_DELETE: "user.delete",

  CATEGORY_READ: "category.read",
  CATEGORY_CREATE: "category.create",
  CATEGORY_UPDATE: "category.update",
  CATEGORY_DELETE: "category.delete",

  INVENTORY_READ: "inventory.read",
  INVENTORY_UPDATE: "inventory.update",

  CUSTOMER_READ: "customer.read",
  CUSTOMER_UPDATE: "customer.update",

  REVIEW_READ: "review.read",
  REVIEW_MODERATE: "review.moderate",

  MEDIA_READ: "media.read",
  MEDIA_UPLOAD: "media.upload",
  MEDIA_DELETE: "media.delete",

  PAGE_READ: "page.read",
  PAGE_CREATE: "page.create",
  PAGE_UPDATE: "page.update",
  PAGE_DELETE: "page.delete",

  NAVIGATION_READ: "navigation.read",
  NAVIGATION_UPDATE: "navigation.update",

  SEO_READ: "seo.read",
  SEO_UPDATE: "seo.update",

  DISCOUNT_READ: "discount.read",
  DISCOUNT_CREATE: "discount.create",
  DISCOUNT_UPDATE: "discount.update",
  DISCOUNT_DELETE: "discount.delete",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];