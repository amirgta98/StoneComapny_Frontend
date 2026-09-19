import type { AuthUser } from "../types";

/**
 * Mock users for every role + multiple tenants (access-control skill §7).
 *
 * - 1x SUPER_ADMIN  → global, tenantId: null
 * - 2x MANAGER      → bound to two DIFFERENT tenants so cross-tenant
 *                     isolation is testable today
 * - 1x USER         → own account / own orders only
 *
 * Tenant IDs match the project's existing mock tenant data
 * (src/lib/mock-data/tenants.ts) so QA can verify isolation on real screens.
 *
 * MOCK-ONLY: deleted entirely during backend integration (skill §11.5).
 */
export const mockUsers: AuthUser[] = [
  {
    id: "u-super",
    role: "SUPER_ADMIN",
    tenantId: null,
    name: "مدیر پلتفرم",
    phone: "09120000001",
  },
  {
    id: "u-manager-a",
    role: "MANAGER",
    tenantId: "tenant-001", // سنگ و سرامیک صنعت
    name: "علی محمدی",
    phone: "09120000002",
  },
  {
    id: "u-manager-b",
    role: "MANAGER",
    tenantId: "tenant-002", // تجارت سنگ‌های قیمتی
    name: "سارا شریفی",
    phone: "09120000003",
  },
  {
    id: "u-user-1",
    role: "USER",
    tenantId: null,
    name: "مشتری نمونه",
    phone: "09120000004",
  },
];
