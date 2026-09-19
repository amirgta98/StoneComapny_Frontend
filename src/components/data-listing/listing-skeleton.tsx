import { Skeleton } from "@/components/ui";

type ListingSkeletonProps = {
  count?: number;
};

/**
 * Skeleton loader for data listings.
 * Shows placeholder cards while data is loading.
 */
export function ListingSkeleton({ count = 5 }: ListingSkeletonProps) {
  return (
    <div className="grid gap-3 md:hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
