"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  RefreshCw,
  Package,
  Layers,
  ArrowDownLeft,
  ArrowRight,
  ShieldAlert,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryAlerts } from "../../hooks/use-inventory";

export function InventoryAlertsView() {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const { data, isLoading, error, refetch } = useInventoryAlerts();

  const alerts = data?.alerts || [];
  const summary = data?.summary || {
    criticalCount: 0,
    warningCount: 0,
    infoCount: 0,
    total: 0,
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === "all") return true;
    return a.severity === filterSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge variant="destructive" className="text-xs font-bold gap-1">
            <AlertOctagon className="h-3 w-3" />
            بحرانی (اتمام موجودی)
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-800 text-xs font-semibold gap-1">
            <AlertTriangle className="h-3 w-3 text-amber-600" />
            هشدار (کسری انبار)
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-800 text-xs font-semibold gap-1">
            <Info className="h-3 w-3 text-blue-600" />
            اطلاع‌رسانی
          </Badge>
        );
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
            مرکز پایش و هشدارهای انبار (Inventory Alerts & Health)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            شناسایی هوشمند کسری سنگ‌ها، اسلب‌های ناموجود، ظرفیت پر سوله‌ها و اقلام نیازمند تأمین
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
            <span>بروزرسانی</span>
          </Button>

          <Link href="/dashboard/inventory/receipts">
            <Button size="sm" className="gap-1.5 text-xs bg-amber-700 hover:bg-amber-800 text-white">
              <ArrowDownLeft className="h-3.5 w-3.5" />
              <span>ثبت رسید ورود جدید</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setFilterSeverity("all")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterSeverity === "all"
              ? "bg-primary/5 border-primary shadow-xs"
              : "bg-card border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">کل هشدارها</span>
            <ShieldAlert className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-black tabular-nums text-foreground mt-2">
            {summary.total.toLocaleString("fa-IR")}
          </div>
        </div>

        <div
          onClick={() => setFilterSeverity("critical")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterSeverity === "critical"
              ? "bg-rose-500/10 border-rose-500 shadow-xs"
              : "bg-card border-border hover:border-rose-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">اتمام موجودی (بحرانی)</span>
            <AlertOctagon className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black tabular-nums text-rose-700 mt-2">
            {summary.criticalCount.toLocaleString("fa-IR")}
          </div>
        </div>

        <div
          onClick={() => setFilterSeverity("warning")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterSeverity === "warning"
              ? "bg-amber-500/10 border-amber-500 shadow-xs"
              : "bg-card border-border hover:border-amber-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">کسری / زیر نقطه سفارش</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black tabular-nums text-amber-700 mt-2">
            {summary.warningCount.toLocaleString("fa-IR")}
          </div>
        </div>

        <div
          onClick={() => setFilterSeverity("info")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterSeverity === "info"
              ? "bg-blue-500/10 border-blue-500 shadow-xs"
              : "bg-card border-border hover:border-blue-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800">هشدار ظرفیت و اطلاعات</span>
            <Building className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black tabular-nums text-blue-700 mt-2">
            {summary.infoCount.toLocaleString("fa-IR")}
          </div>
        </div>
      </div>

      {/* Alert List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center border border-destructive/30 rounded-2xl bg-destructive/5 text-destructive">
          <p className="font-bold text-sm">خطا در دریافت هشدارهای انبار</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            تلاش مجدد
          </Button>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <Package className="h-10 w-10 mx-auto text-emerald-600" />
          <h3 className="font-bold text-sm text-foreground">هیچ هشدار فعالی در این بخش وجود ندارد</h3>
          <p className="text-xs text-muted-foreground">
            وضعیت کلیه سنگ‌ها، اسلب‌ها و موجودی سوله‌های انبار در شرایط ایده‌آل قرار دارد.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                alert.severity === "critical"
                  ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40"
                  : alert.severity === "warning"
                  ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40"
                  : "bg-card border-border"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="shrink-0 mt-0.5">
                  {alert.severity === "critical" ? (
                    <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center border border-rose-500/20">
                      <AlertOctagon className="h-5 w-5" />
                    </div>
                  ) : alert.severity === "warning" ? (
                    <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center border border-amber-500/20">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                      <Info className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-foreground">{alert.title}</span>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {alert.message}
                  </p>
                  {alert.locationName && (
                    <p className="text-[11px] text-muted-foreground">
                      موقعیت: <strong>{alert.locationName}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {alert.itemId ? (
                  <Link href={`/dashboard/inventory/products?query=${encodeURIComponent(alert.title.replace(/هشدار اتمام موجودی|کسری موجودی سنگ/g, "").trim())}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <Layers className="h-3.5 w-3.5" />
                      <span>مشاهده در کاتالوگ</span>
                      <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                    </Button>
                  </Link>
                ) : alert.locationId ? (
                  <Link href="/dashboard/inventory/locations">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <Building className="h-3.5 w-3.5" />
                      <span>مدیریت موقعیت</span>
                      <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                    </Button>
                  </Link>
                ) : null}

                <Link href="/dashboard/inventory/receipts">
                  <Button size="sm" className="gap-1.5 text-xs bg-amber-700 hover:bg-amber-800 text-white">
                    <ArrowDownLeft className="h-3.5 w-3.5" />
                    <span>تأمین موجودی</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
