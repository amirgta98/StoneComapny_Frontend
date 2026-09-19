import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Banner Skeleton */}
      <div className="h-24 w-full rounded-2xl bg-secondary/50 animate-pulse" />

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-secondary/50 animate-pulse" />
        ))}
      </div>

      {/* Pipeline Skeleton */}
      <div className="h-40 w-full rounded-2xl bg-secondary/50 animate-pulse" />

      {/* Chart and Inquiries Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-96 rounded-2xl bg-secondary/50 animate-pulse" />
        <div className="h-96 rounded-2xl bg-secondary/50 animate-pulse" />
      </div>

      {/* Orders Table Skeleton */}
      <div className="h-80 w-full rounded-2xl bg-secondary/50 animate-pulse" />
    </div>
  );
}
