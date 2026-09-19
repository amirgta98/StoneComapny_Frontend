"use client";

import {
  FileBarChart2,
  RefreshCw,
  Coins,
  Layers,
  Building,
  ArrowDownLeft,
  ArrowUpRight,
  PieChart,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryReports } from "../../hooks/use-inventory";

export function InventoryReportsView() {
  const { data, isLoading, error, refetch } = useInventoryReports();

  const summary = data?.summary || {
    totalPhysicalSqm: 0,
    totalValuation: 0,
    totalInflow: 0,
    totalOutflow: 0,
    activeStockItemsCount: 0,
    locationsCount: 0,
  };

  const valuationByType = data?.valuationByType || [];
  const stockByLocation = data?.stockByLocation || [];

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <FileBarChart2 className="h-6 w-6 text-amber-600 shrink-0" />
            ارزش‌گذاری دارایی و گزارشات تحلیلی انبار (Valuation & Auditing)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            ارزش ریالی سنگ‌های دپو شده در انبار، تفکیک بر اساس نوع سنگ (مرمریت، تراورتن، اونیکس) و ظرفیت سوله‌ها
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>بروزرسانی گزارش</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : error ? (
        <div className="p-8 text-center border border-destructive/30 rounded-2xl bg-destructive/5 text-destructive">
          <p className="font-bold text-sm">خطا در بارگذاری گزارشات انبار</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            تلاش مجدد
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Valuation */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-700/10 via-amber-900/5 to-card border border-amber-500/20 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-amber-800 dark:text-amber-300">
                <span className="text-xs font-bold">ارزش کل دارایی سنگ موجود</span>
                <Coins className="h-5 w-5 opacity-80" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black tabular-nums text-foreground">
                  {summary.totalValuation.toLocaleString("fa-IR")}
                </span>
                <span className="text-xs text-muted-foreground mr-1.5 font-medium">تومان</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                بر مبنای قیمت تمام‌شده دپوی موجود
              </p>
            </div>

            {/* Total Area */}
            <div className="p-5 rounded-2xl bg-card border border-border shadow-2xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold">کل متراژ سنگ موجود</span>
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black tabular-nums text-foreground">
                  {summary.totalPhysicalSqm.toLocaleString("fa-IR")}
                </span>
                <span className="text-xs text-muted-foreground mr-1.5 font-medium">مترمربع</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                شامل اسلب، تایل و سنگ‌های طولی
              </p>
            </div>

            {/* Total Inflow vs Outflow */}
            <div className="p-5 rounded-2xl bg-card border border-border shadow-2xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold">ورود کل به انبار</span>
                <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black tabular-nums text-emerald-700">
                  {summary.totalInflow.toLocaleString("fa-IR")}
                </span>
                <span className="text-xs text-muted-foreground mr-1.5 font-medium">مترمربع</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/60 text-[11px]">
                <span className="text-muted-foreground">خروج کل حواله‌ها:</span>
                <span className="font-bold tabular-nums text-rose-700">
                  {summary.totalOutflow.toLocaleString("fa-IR")} م²
                </span>
              </div>
            </div>

            {/* Active Items & Locations */}
            <div className="p-5 rounded-2xl bg-card border border-border shadow-2xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold">اقلام فعال و موقعیت‌ها</span>
                <Boxes className="h-5 w-5 text-amber-600" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black tabular-nums text-foreground">
                  {summary.activeStockItemsCount.toLocaleString("fa-IR")}
                </span>
                <span className="text-xs text-muted-foreground mr-1.5 font-medium">قلم سنگ</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                <span>دپو شده در {summary.locationsCount.toLocaleString("fa-IR")} موقعیت و سوله</span>
              </p>
            </div>
          </div>

          {/* Section 2: Valuation by Stone Type */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-amber-600" />
                <h2 className="text-base font-bold text-foreground">
                  تفکیک ارزش و متراژ بر اساس جنس سنگ (Marble, Travertine, Granite, Onyx)
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-secondary/40 border-y border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-start">نوع و جنس سنگ</th>
                    <th className="px-3 py-3 text-center">تعداد ردیف کالا</th>
                    <th className="px-3 py-3 text-center">مجموع متراژ (م²)</th>
                    <th className="px-3 py-3 text-start">ارزش ریالی (تومان)</th>
                    <th className="px-4 py-3 text-center">درصد از کل موجودی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {valuationByType.map((item) => {
                    const pct = summary.totalPhysicalSqm > 0
                      ? ((item.sqm / summary.totalPhysicalSqm) * 100).toFixed(1)
                      : "0";
                    return (
                      <tr key={item.type} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3 font-bold text-foreground">
                          {item.type}
                        </td>
                        <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">
                          {item.count.toLocaleString("fa-IR")}
                        </td>
                        <td className="px-3 py-3 text-center font-black tabular-nums text-foreground">
                          {item.sqm.toLocaleString("fa-IR")} م²
                        </td>
                        <td className="px-3 py-3 font-black tabular-nums text-amber-800 dark:text-amber-400">
                          {item.valuation.toLocaleString("fa-IR")} تومان
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-24 bg-secondary rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-amber-600 h-full rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="tabular-nums font-semibold text-muted-foreground text-[11px]">
                              {Number(pct).toLocaleString("fa-IR")}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Stock by Location */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-amber-600" />
              <h2 className="text-base font-bold text-foreground">
                توزیع موجودی در موقعیت‌ها و سوله‌های انبار
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stockByLocation.map((loc) => (
                <div
                  key={loc.name}
                  className="p-4 rounded-xl border border-border bg-secondary/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{loc.name}</span>
                    <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-md bg-secondary border border-border">
                      {loc.type}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs text-muted-foreground">متراژ موجود:</span>
                    <span className="text-base font-black tabular-nums text-foreground">
                      {loc.totalSqm.toLocaleString("fa-IR")} <span className="text-xs font-normal">م²</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                    <span>تنوع کالاها:</span>
                    <span className="font-semibold tabular-nums text-foreground">
                      {loc.itemsCount.toLocaleString("fa-IR")} قلم
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
