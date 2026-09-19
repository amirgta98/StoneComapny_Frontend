export type UserRole = "admin" | "user" | "super_admin";
export type UserStatus = "active" | "inactive" | "suspended";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  tenantId: string;
  tenantName?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
};
