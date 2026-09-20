"use client";

import { Suspense } from "react";
import {
  NavigationManagerView,
  NavigationTableSkeleton,
} from "@/features/navigation";
import { withAuthGuard } from "@/auth";

/**
 * /dashboard/navigation — Navigation Visibility & Access Manager.
 *
 * Allows factory owners and managers to control which pages appear in
 * site navigation (Header, Footer Quick Links, Stone Categories, and Mobile).
 * Guarded by RBAC: permits SUPER_ADMIN and MANAGER roles.
 */
function NavigationPage() {
  return (
    <Suspense fallback={<NavigationTableSkeleton />}>
      <NavigationManagerView />
    </Suspense>
  );
}

export const GuardedNavigationPage = withAuthGuard(NavigationPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedNavigationPage;
