import type { TenantStatus } from "@/types";

export const tenantStatusVariant: Record<TenantStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  pending: "secondary",
  suspended: "destructive",
  deleted: "outline",
};

export const tenantStatusLabel: Record<TenantStatus, string> = {
  active: "فعال",
  pending: "در انتظار",
  suspended: "مسدود",
  deleted: "حذف‌شده",
};