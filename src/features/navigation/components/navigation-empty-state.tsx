import { SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationEmptyStateProps {
  searchQuery: string;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function NavigationEmptyState({
  searchQuery,
  hasActiveFilters,
  onClearFilters,
}: NavigationEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3.5">
        <SearchX className="h-7 w-7" />
      </div>

      <h3 className="text-sm sm:text-base font-bold text-foreground">
        هیچ صفحه‌ای با شرایط جستجو یافت نشد
      </h3>

      <p className="mt-1.5 text-xs text-muted-foreground max-w-md leading-relaxed">
        {searchQuery ? (
          <>
            هیچ صفحه‌ای با عبارت «
            <span className="font-semibold text-foreground">{searchQuery}</span>
            » مطابقت ندارد.
          </>
        ) : (
          "با فیلترهای بخش یا وضعیت دیده‌بانی فعلی، موردی برای نمایش وجود ندارد."
        )}
      </p>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="mt-4 gap-1.5 text-xs font-semibold"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>پاک‌کردن فیلترها و نمایش همه صفحات</span>
        </Button>
      )}
    </div>
  );
}
