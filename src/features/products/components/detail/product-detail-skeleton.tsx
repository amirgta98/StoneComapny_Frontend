import { Skeleton } from "@/components/ui";

/**
 * Loading skeleton for the product detail page.
 *
 * Preserves the approximate final layout (breadcrumb, editorial header,
 * hero grid with gallery/info/purchase columns, and the section bands)
 * so the swap from skeleton to content causes minimal layout shift.
 */
export function ProductDetailSkeleton() {
  return (
    <div>
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-48" />

      {/* Editorial header — badges, display headings, description, rating */}
      <div className="mt-8 md:mt-10">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
        <Skeleton className="mt-4 h-10 w-2/3 sm:h-12 md:w-1/2" />
        <Skeleton className="mt-5 h-4 w-full max-w-xl" />
        <Skeleton className="mt-2.5 h-4 w-2/3 max-w-md" />
        <div className="mt-5 flex items-center gap-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Hero: gallery (framed) + key-facts + purchase cards */}
      <div className="mt-10 grid items-start gap-8 md:mt-12 lg:grid-cols-2 xl:grid-cols-[1.05fr_1fr] xl:gap-12">
        <div className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-2 md:justify-start">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="size-16 rounded-md" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Key-facts card */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-5 sm:p-6">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-1 gap-y-2.5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
          {/* Purchase panel card */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-5 sm:p-6">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Sections — alternating rhythm */}
      <div className="mt-14 md:mt-20">
        {/* Features — background container */}
        <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Technical data — muted band */}
        <div className="border-y bg-muted/40">
          <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="grid gap-x-10 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}