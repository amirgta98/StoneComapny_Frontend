"use client";

import { useState } from "react";
import {
  Sliders,
  Plus,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Trash2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryAdjustments } from "../../hooks/use-inventory";
import { NewAdjustmentDialog } from "./new-adjustment-dialog";

export function StockAdjustmentsView() {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const { data, isLoading, error, refetch } = useInventoryAdjustments();
  const adjustments = data?.adjustments || [];

  const getTargetBadge = (target: string) => {
    switch (target) {
      case "onHand":
        return (
          <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-700 text-[11px] font-semibold gap-1">
            <Package className="h-3 w-3" />
            موجودی فیزیکی
          </Badge>
        );
      case "damaged":
        return (
          <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-700 text-[11px] font-semibold gap-1">
            <ShieldAlert className="h-3 w-3" />
            شکستگی / آسیب
          </Badge>
        );
      case "scrap":
        return (
          <Badge variant="outline" className="border-rose-500/30 bg-rose-500/10 text-rose-700 text-[11px] font-semibold gap-1">
            <Trash2 className="h-3 w-3" />
            ضایعات سنگ
          </Badge>
        );
      case "qualityCheck":
        return (
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-700 text-[11px] font-semibold gap-1">
            کنترل کیفی QC
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[11px]">
            {target}
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
            <Sliders className="h-6 w-6 text-amber-600 shrink-0" />
            اسناد تعدیل موجودی و ضایعات (Stock Adjustments)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            گزارش و ثبت اصلاحات دستی، شکستگی در خط ساب و جابجایی، کسر ضایعات و مازاد انبارگردانی
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

          <Button
            size="sm"
            onClick={() => setIsNewOpen(true)}
            className="gap-1.5 text-xs bg-amber-700 hover:bg-amber-800 text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>ثبت سند تعدیل جدید</span>
          </Button>
        </div>
      </div>

      {/* Adjustments Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center border border-destructive/30 rounded-2xl bg-destructive/5 text-destructive">
          <p className="font-bold text-sm">خطا در بارگذاری لیست تعدیلات</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            تلاش مجدد
          </Button>
        </div>
      ) : adjustments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <Sliders className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="font-bold text-sm text-foreground">هیچ سند تعدیلی ثبت نشده است</h3>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-3 text-start">شماره سند</th>
                  <th className="px-3 py-3 text-start">نام سنگ / اسلب</th>
                  <th className="px-3 py-3 text-center">نوع تغییر</th>
                  <th className="px-3 py-3 text-center">مقدار تغییر</th>
                  <th className="px-3 py-3 text-center">بخش هدف</th>
                  <th className="px-3 py-3 text-start">علت و شرح تعدیل</th>
                  <th className="px-3 py-3 text-start">شماره مرجع</th>
                  <th className="px-3 py-3 text-start">ثبت‌کننده</th>
                  <th className="px-4 py-3 text-end">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {adjustments.map((a) => {
                  const isPositive = a.quantityChange > 0;
                  return (
                    <tr key={a.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-foreground">
                        {a.adjustmentNumber}
                      </td>

                      <td className="px-3 py-3 font-bold text-foreground max-w-[200px] truncate">
                        {a.productName}
                      </td>

                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        {isPositive ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                            <TrendingUp className="h-3.5 w-3.5" />
                            افزایش (مازاد)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                            <TrendingDown className="h-3.5 w-3.5" />
                            کاهش (کسری)
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-3 text-center whitespace-nowrap font-black tabular-nums">
                        <span className={isPositive ? "text-emerald-700" : "text-rose-700"}>
                          {isPositive ? "+" : ""}
                          {a.quantityChange.toLocaleString("fa-IR")} {a.unit}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        {getTargetBadge(a.targetProperty)}
                      </td>

                      <td className="px-3 py-3 text-foreground max-w-[200px] truncate">
                        {a.reason}
                      </td>

                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                        {a.referenceNumber || "—"}
                      </td>

                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                        {a.adjustedBy}
                      </td>

                      <td className="px-4 py-3 text-end text-[11px] text-muted-foreground whitespace-nowrap">
                        {a.createdAt}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Adjustment Modal */}
      <NewAdjustmentDialog open={isNewOpen} onOpenChange={setIsNewOpen} />
    </div>
  );
}
