import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Layout, Percent } from "lucide-react";
import type { NavigationStats } from "../types";

interface NavigationStatsCardsProps {
  stats: NavigationStats;
}

export function NavigationStatsCards({ stats }: NavigationStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Total Pages */}
      <Card className="border border-border/70 bg-card p-4 shadow-2xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            مجموع صفحات سایت
          </p>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layout className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {stats.total.toLocaleString("fa-IR")}
          </span>
          <span className="text-[11px] text-muted-foreground">صفحه تعریف‌شده</span>
        </div>
      </Card>

      {/* Visible Pages */}
      <Card className="border border-border/70 bg-card p-4 shadow-2xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            فعال و نمایان در منو
          </p>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
            <Eye className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
            {stats.visibleCount.toLocaleString("fa-IR")}
          </span>
          <span className="text-[11px] text-muted-foreground">لینک در دسترس</span>
        </div>
      </Card>

      {/* Hidden Pages */}
      <Card className="border border-border/70 bg-card p-4 shadow-2xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            مخفی از ناوبری
          </p>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400">
            <EyeOff className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-700 dark:text-amber-400 tabular-nums">
            {stats.hiddenCount.toLocaleString("fa-IR")}
          </span>
          <span className="text-[11px] text-muted-foreground">صفحه غیرفعال</span>
        </div>
      </Card>

      {/* Visibility Ratio */}
      <Card className="border border-border/70 bg-card p-4 shadow-2xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            نرخ انتشار در ناوبری
          </p>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15 text-sky-700 dark:text-sky-400">
            <Percent className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-sky-700 dark:text-sky-400 tabular-nums">
            {stats.visibilityRatio.toLocaleString("fa-IR")}٪
          </span>
        </div>
        {/* Progress Bar */}
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-sky-500 transition-all duration-500"
            style={{ width: `${stats.visibilityRatio}%` }}
          />
        </div>
      </Card>
    </div>
  );
}
