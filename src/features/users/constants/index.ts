import type { UserRole, UserStatus } from "@/types";

export const userRoleLabel: Record<UserRole, string> = {
  admin: "مدیر",
  user: "کاربر",
  super_admin: "سوپر ادمین",
};

export const userRoleVariant: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
  admin: "destructive",
  user: "secondary",
  super_admin: "default",
};

export const userStatusLabel: Record<UserStatus, string> = {
  active: "فعال",
  inactive: "غیرفعال",
  suspended: "مسدود",
};

export const userStatusVariant: Record<UserStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  inactive: "secondary",
  suspended: "destructive",
};
