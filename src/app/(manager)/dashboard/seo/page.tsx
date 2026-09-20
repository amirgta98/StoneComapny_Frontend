"use client";

import { Suspense } from "react";
import { SeoManagerView, SeoSkeleton } from "@/features/seo";
import { withAuthGuard } from "@/auth";

/**
 * /dashboard/seo — Search Engine Optimization & SERP Manager.
 *
 * Provides factory owners and managers with direct control over page and stone
 * catalog metadata, Google SERP desktop and mobile previews, OpenGraph social
 * sharing tags, XML sitemap generation, and robots.txt crawler directives.
 *
 * Guarded by RBAC: permits SUPER_ADMIN and MANAGER roles.
 */
function SeoDashboardPage() {
  return (
    <Suspense fallback={<SeoSkeleton />}>
      <SeoManagerView />
    </Suspense>
  );
}

export const GuardedSeoDashboardPage = withAuthGuard(SeoDashboardPage, {
  roles: ["SUPER_ADMIN", "MANAGER"],
});

export default GuardedSeoDashboardPage;
