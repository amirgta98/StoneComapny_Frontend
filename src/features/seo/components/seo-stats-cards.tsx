"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  Globe,
  AlertTriangle,
  FileCode,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSeoStore } from "../stores/seo-store";

export function SeoStatsCards() {
  const getStats = useSeoStore((state) => state.getStats);
  const stats = useMemo(() => getStats(), [getStats]);

  const healthColor =
    stats.overallHealthScore >= 90
      ? "text-emerald-600 dark:text-emerald-400"
      : stats.overallHealthScore >= 75
      ? "text-amber-600 dark:text-amber-400"
      : "text-rose-600 dark:text-rose-400";

  const healthBadge =
    stats.overallHealthScore >= 90
      ? { label: "عالی و بهینه‌شده", variant: "default" as const, bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" }
      : stats.overallHealthScore >= 75
      ? { label: "قابل قبول", variant: "warning" as const, bg: "bg-amber-500/10 text-amber-600 border-amber-500/30" }
      : { label: "نیازمند بهبود فوری", variant: "destructive" as const, bg: "bg-rose-500/10 text-rose-600 border-rose-500/30" };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" dir="rtl">
      {/* 1. Overall Health Score */}
      <Card className="relative overflow-hidden border-border/60 bg-card shadow-xs transition-all hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              نمره جامع سلامت سئو
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight ${healthColor}`}>
              ٪{stats.overallHealthScore}
            </span>
            <Badge variant="outline" className={`text-[11px] px-2 py-0.5 ${healthBadge.bg}`}>
              {healthBadge.label}
            </Badge>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${stats.overallHealthScore}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            میانگین امتیاز عناوین، متای توضیحات و ساختار اسکیما
          </p>
        </CardContent>
      </Card>

      {/* 2. Indexed Pages in Search Engines */}
      <Card className="relative overflow-hidden border-border/60 bg-card shadow-xs transition-all hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              صفحات قابل ایندکس در گوگل
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Globe className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats.totalIndexedPages}
            </span>
            <span className="text-xs text-muted-foreground">
              از {stats.totalPagesCount} صفحه کل
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>
              {Math.round((stats.totalIndexedPages / (stats.totalPagesCount || 1)) * 100)}٪ صفحات در نتایج جستجو فعال هستند
            </span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            صفحات عمومی، کاتالوگ سنگ‌ها و گالری اسلب‌ها
          </p>
        </CardContent>
      </Card>

      {/* 3. Missing or Suboptimal Metadata */}
      <Card className="relative overflow-hidden border-border/60 bg-card shadow-xs transition-all hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              نیازمند بهینه‌سازی متادیتا
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats.warningPagesCount}
            </span>
            <span className="text-xs text-muted-foreground">صفحه یا محصول</span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>
              {stats.missingDescriptionCount > 0
                ? `${stats.missingDescriptionCount} صفحه بدون توضیحات متای استاندارد`
                : "تمام صفحات دارای توضیحات متای بهینه هستند"}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            بررسی طول تگ عنوان، جذابیت کلیک و کلمات کلیدی
          </p>
        </CardContent>
      </Card>

      {/* 4. Sitemap & Robots Status */}
      <Card className="relative overflow-hidden border-border/60 bg-card shadow-xs transition-all hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              نقشه سایت و دسترسی ربات‌ها
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <FileCode className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats.sitemapUrlsCount}
            </span>
            <span className="text-xs text-muted-foreground">پیوند در sitemap.xml</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[11px] px-2 py-0">
              robots.txt فعال
            </Badge>
            <span className="text-[11px] text-muted-foreground">همگام با سرچ کنسول</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            تولید خودکار نقشه سایت با اولویت‌بندی محصولات سنگ
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
