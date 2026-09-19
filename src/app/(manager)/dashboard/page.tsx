"use client";

import { Suspense } from "react";
import { ManagerDashboard, DashboardSkeleton } from "@/features/manager";
import { withAuthGuard } from "@/auth";

/**
 * /dashboard — Factory Owner / Tenant Manager dashboard.
 *
 * Dedicated to the MANAGER role (and accessible to SUPER_ADMIN for inspection).
 * Tenant isolation and scoping are enforced before rendering any factory resources.
 */
function ManagerDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ManagerDashboard />
    </Suspense>
  );
}

export const GuardedManagerDashboard = withAuthGuard(ManagerDashboardPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedManagerDashboard;
