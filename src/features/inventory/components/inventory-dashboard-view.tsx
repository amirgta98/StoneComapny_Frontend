"use client";

import Link from "next/link";
import {
  Layers,
  CheckCircle2,
  Bookmark,
  ShieldAlert,
  AlertTriangle,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  ClipboardCheck,
  Building,
  History,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryDashboard } from "../hooks/use-inventory";
import { InventoryStatusBadge, MovementTypeBadge } from "./common/inventory-badges";

export function InventoryDashboardView() {
  const { data, isLoading, error, refetch } = useInventoryDashboard();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6" dir="rtl">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center" dir="rtl">
        <div className="max-w-md mx-auto p-6 rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive space-y-3">
          <AlertTriangle className="h-8 w-8 mx-auto" />
          <h3 className="font-bold text-base">دریافت اطلاعات انبار با مشکل مواجه شد</h3>
          <p className="text-xs text-muted-foreground">لطفاً اتصال خود را بررسی کرده و مجدداً تلاش فرمایید.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  const { metrics, recentMovements, recentReceipts, recentIssues } = data;
  const totalPhysical = metrics.totalPhysicalStockSqm || 1;
  const availablePct = Math.round((metrics.totalAvailableSqm / totalPhysical) * 100);
  const reservedPct = Math.round((metrics.totalReservedSqm / totalPhysical) * 100);
  const qcPct = Math.round((metrics.totalQualityCheckSqm / totalPhysical) * 100);
  const damagedPct = Math.round(((metrics.totalDamagedSqm + metrics.totalScrapSqm) / totalPhysical) * 100);

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-amber-600 shrink-0" />
            مرکز مدیریت و پایش انبار سنگ
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            پایش جامع متراژ دپو، اسلب‌ها، رزروها، کاردکس گردش و اسناد ورودی/خروجی کارخانه
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="gap-1.5 text-xs bg-amber-700 hover:bg-amber-800 text-white">
            <Link href="/dashboard/inventory/receipts">
              <ArrowDownLeft className="h-3.5 w-3.5" />
              <span>ثبت رسید ورود</span>
            </Link>
          </Button>

          <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
            <Link href="/dashboard/inventory/issues">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>صدور حواله خروج</span>
            </Link>
          </Button>

          <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
            <Link href="/dashboard/inventory/transfers">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>جابجایی انبار</span>
            </Link>
          </Button>

          <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
            <Link href="/dashboard/inventory/counts">
              <ClipboardCheck className="h-3.5 w-3.5" />
              <span>انبارگردانی</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Physical Stock */}
        <Card className="border border-border/80 bg-card shadow-2xs hover:border-border transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">موجودی فیزیکی کل</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-black text-foreground tabular-nums">
              {metrics.totalPhysicalStockSqm.toLocaleString("fa-IR")}{" "}
              <span className="text-xs font-normal text-muted-foreground">م²</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              مجموع {metrics.totalItemsCount.toLocaleString("fa-IR")} پالت و اسلب دپو شده
            </p>
          </CardContent>
        </Card>

        {/* Available Stock */}
        <Card className="border border-border/80 bg-card shadow-2xs hover:border-border transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">موجودی آزاد (قابل فروش)</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-black text-emerald-600 tabular-nums">
              {metrics.totalAvailableSqm.toLocaleString("fa-IR")}{" "}
              <span className="text-xs font-normal text-muted-foreground">م²</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              آماده صدور پیش‌فاکتور و فروش آنی
            </p>
          </CardContent>
        </Card>

        {/* Reserved Stock */}
        <Card className="border border-border/80 bg-card shadow-2xs hover:border-border transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">رزرو سفارشات</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Bookmark className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-black text-amber-600 tabular-nums">
              {metrics.totalReservedSqm.toLocaleString("fa-IR")}{" "}
              <span className="text-xs font-normal text-muted-foreground">م²</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              متعهد به مشتریان و در انتظار بارگیری
            </p>
          </CardContent>
        </Card>

        {/* Valuation */}
        <Card className="border border-border/80 bg-card shadow-2xs hover:border-border transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">ارزش دفتری دپو</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Coins className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-xl font-black text-foreground tabular-nums truncate">
              {(metrics.totalValuation / 10_000_000).toLocaleString("fa-IR")}{" "}
              <span className="text-xs font-normal text-muted-foreground">میلیون ت</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              محاسبه به بهای تمام شده کارخانه
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Composition Progress Bar */}
      <Card className="border border-border/80 bg-card p-4">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span>ترکیب وضعیت موجودی دپوی سنگ</span>
          <span className="text-muted-foreground">{metrics.totalPhysicalStockSqm.toLocaleString("fa-IR")} متر مربع کل</span>
        </div>
        <div className="h-3 w-full rounded-full bg-secondary/50 flex overflow-hidden">
          <div style={{ width: `${availablePct}%` }} className="bg-emerald-500" title={`آزاد: ${availablePct}%`} />
          <div style={{ width: `${reservedPct}%` }} className="bg-amber-500" title={`رزرو: ${reservedPct}%`} />
          <div style={{ width: `${qcPct}%` }} className="bg-sky-500" title={`کنترل کیفیت: ${qcPct}%`} />
          <div style={{ width: `${damagedPct}%` }} className="bg-rose-500" title={`معیوب و ضایعات: ${damagedPct}%`} />
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            قابل فروش ({metrics.totalAvailableSqm.toLocaleString("fa-IR")} م² - {availablePct}٪)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            رزرو مشتری ({metrics.totalReservedSqm.toLocaleString("fa-IR")} م² - {reservedPct}٪)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            کنترل کیفی QC ({metrics.totalQualityCheckSqm.toLocaleString("fa-IR")} م²)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            معیوب / ضایعات ({(metrics.totalDamagedSqm + metrics.totalScrapSqm).toLocaleString("fa-IR")} م²)
          </span>
        </div>
      </Card>

      {/* Two Column Layout: Recent Movements & Recent In/Out */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Kardex Activity */}
        <Card className="lg:col-span-2 border border-border/80 bg-card">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <History className="h-4 w-4 text-amber-600" />
                آخرین گردش‌های ثبت‌شده در کاردکس انبار
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                ثبت بدون وقفه کلیه ورودها، خروج‌ها، انتقالات و تعدیلات فیزیکی
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link href="/dashboard/inventory/movements">مشاهده کامل کاردکس</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-secondary/40 border-y border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-4 py-2.5 text-start">نوع گردش</th>
                    <th className="px-4 py-2.5 text-start">نام سنگ / اسلب</th>
                    <th className="px-4 py-2.5 text-center">مقدار</th>
                    <th className="px-4 py-2.5 text-start">علت / سند مرجع</th>
                    <th className="px-4 py-2.5 text-end">زمان</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentMovements.map((mov) => (
                    <tr key={mov.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <MovementTypeBadge type={mov.type} />
                      </td>
                      <td className="px-4 py-2.5 font-medium text-foreground max-w-[180px] truncate">
                        {mov.productName}
                      </td>
                      <td className="px-4 py-2.5 text-center whitespace-nowrap font-bold tabular-nums">
                        {mov.quantity.toLocaleString("fa-IR")} {mov.unit}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground max-w-[200px] truncate">
                        {mov.reason || mov.referenceNumber || "—"}
                      </td>
                      <td className="px-4 py-2.5 text-end whitespace-nowrap text-muted-foreground text-[11px]">
                        {mov.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Recent Receipts & Issues overview */}
        <div className="space-y-4">
          {/* Recent Receipts card */}
          <Card className="border border-border/80 bg-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" />
                آخرین رسیدهای ورود
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-[11px] h-6 px-2">
                <Link href="/dashboard/inventory/receipts">همه رسیدها</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 pt-1">
              {recentReceipts.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between p-2 rounded-lg border border-border/60 bg-secondary/20 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{rec.receiptNumber}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{rec.source === "PRODUCTION" ? "خط تولید کارخانه" : rec.supplierName}</p>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="font-bold tabular-nums text-emerald-600">+{rec.totalQuantity.toLocaleString("fa-IR")} {rec.unit}</p>
                    <p className="text-[10px] text-muted-foreground">{rec.createdAt}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Issues card */}
          <Card className="border border-border/80 bg-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5 text-rose-600" />
                آخرین حواله‌های خروج
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-[11px] h-6 px-2">
                <Link href="/dashboard/inventory/issues">همه حواله‌ها</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 pt-1">
              {recentIssues.map((iss) => (
                <div
                  key={iss.id}
                  className="flex items-center justify-between p-2 rounded-lg border border-border/60 bg-secondary/20 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{iss.issueNumber}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{iss.customerName || iss.reason}</p>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="font-bold tabular-nums text-rose-600">-{iss.totalQuantity.toLocaleString("fa-IR")} {iss.unit}</p>
                    <p className="text-[10px] text-muted-foreground">{iss.createdAt}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
