import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function NavigationTableSkeleton() {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-7 w-64 rounded-lg" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-96 max-w-full rounded" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border border-border/70 bg-card p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            <Skeleton className="mt-3 h-8 w-16 rounded-md" />
            <Skeleton className="mt-2 h-1.5 w-full rounded-full" />
          </Card>
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto flex-1">
          <Skeleton className="h-9 w-full sm:w-72 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Table Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs">
        <div className="border-b border-border/70 bg-secondary/30 p-4">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 p-4">
              <Skeleton className="h-4 w-4 rounded shrink-0" />
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
              </div>
              <Skeleton className="h-6 w-32 rounded-md shrink-0 hidden md:block" />
              <Skeleton className="h-6 w-28 rounded-md shrink-0" />
              <Skeleton className="h-5 w-9 rounded-full shrink-0" />
              <Skeleton className="h-6 w-20 rounded-full shrink-0" />
              <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
