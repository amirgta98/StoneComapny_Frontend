import { Suspense } from "react";
import { AdminDashboard, DashboardSkeleton } from "@/features/admin";

export default function AdminPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminDashboard />
    </Suspense>
  );
}