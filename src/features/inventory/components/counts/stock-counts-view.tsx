"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  MapPin,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryCounts } from "../../hooks/use-inventory";
import { NewCountDialog } from "./new-count-dialog";
import { CountDetailDialog } from "./count-detail-dialog";
import type { StockCountDto } from "../../types/inventory.types";

export function StockCountsView() {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [selectedCount, setSelectedCount] = useState<StockCountDto | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data, isLoading, error, refetch } = useInventoryCounts();
  const counts = data?.counts || [];

  const handleOpenDetail = (count: StockCountDto) => {
    setSelectedCount(count);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-amber-600 shrink-0" />
            انبارگردانی و تطبیق فیزیکی (Physical Stock Auditing)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            شمارش متراژ سنگ‌ها و اسلب‌های کارخانه، کشف مغایرت‌های دپو و تسویه خودکار کاردکس
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
            <span>شروع دوره انبارگردانی جدید</span>
          </Button>
        </div>
      </div>

      {/* Counts Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center border border-destructive/30 rounded-2xl bg-destructive/5 text-destructive">
          <p className="font-bold text-sm">خطا در بارگذاری دوره‌های انبارگردانی</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            تلاش مجدد
          </Button>
        </div>
      ) : counts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <ClipboardCheck className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="font-bold text-sm text-foreground">هیچ دوره انبارگردانی ثبت نشده است</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            برای تطبیق موجودی واقعی انبار و سوله‌ها با مانده‌های سیستمی، یک دوره انبارگردانی جدید ایجاد کنید.
          </p>
          <Button
            size="sm"
            onClick={() => setIsNewOpen(true)}
            className="mt-2 bg-amber-700 hover:bg-amber-800 text-white"
          >
            ایجاد برگه انبارگردانی
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-3 text-start">کد برگه</th>
                  <th className="px-3 py-3 text-start">عنوان انبارگردانی</th>
                  <th className="px-3 py-3 text-start">موقعیت / سوله</th>
                  <th className="px-3 py-3 text-center">تعداد ردیف سنگ</th>
                  <th className="px-3 py-3 text-center">موجودی سیستمی</th>
                  <th className="px-3 py-3 text-center">شمارش فیزیکی</th>
                  <th className="px-3 py-3 text-center">مغایرت کل</th>
                  <th className="px-3 py-3 text-center">وضعیت</th>
                  <th className="px-3 py-3 text-start">مسئول شمارش</th>
                  <th className="px-4 py-3 text-end">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {counts.map((c) => {
                  const isCompleted = c.status === "COMPLETED";
                  return (
                    <tr key={c.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-foreground">
                        {c.countNumber}
                      </td>

                      <td className="px-3 py-3 font-bold text-foreground">
                        {c.title}
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0 text-amber-600" />
                          <span>{c.locationName}</span>
                        </div>
                      </td>

                      <td className="px-3 py-3 text-center tabular-nums font-semibold text-foreground">
                        {c.items.length.toLocaleString("fa-IR")} ردیف
                      </td>

                      <td className="px-3 py-3 text-center tabular-nums font-semibold text-muted-foreground">
                        {c.totalSystemQty.toLocaleString("fa-IR")}
                      </td>

                      <td className="px-3 py-3 text-center tabular-nums font-bold text-foreground">
                        {c.totalPhysicalQty.toLocaleString("fa-IR")}
                      </td>

                      <td className="px-3 py-3 text-center font-bold tabular-nums">
                        {c.totalDiffQty === 0 ? (
                          <span className="text-muted-foreground">۰</span>
                        ) : c.totalDiffQty > 0 ? (
                          <span className="text-emerald-600">+{c.totalDiffQty.toLocaleString("fa-IR")} (مازاد)</span>
                        ) : (
                          <span className="text-rose-600">{c.totalDiffQty.toLocaleString("fa-IR")} (کسری)</span>
                        )}
                      </td>

                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        {isCompleted ? (
                          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            تصویب و نهایی شده
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 text-[11px] font-semibold gap-1">
                            <Clock className="h-3 w-3" />
                            در جریان شمارش
                          </Badge>
                        )}
                      </td>

                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                        {c.countedBy}
                      </td>

                      <td className="px-4 py-3 text-end whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDetail(c)}
                          className="h-8 gap-1 text-xs text-amber-800 hover:text-amber-900 hover:bg-amber-50"
                        >
                          {isCompleted ? (
                            <>
                              <Eye className="h-3.5 w-3.5" />
                              <span>مشاهده جزئیات</span>
                            </>
                          ) : (
                            <>
                              <SlidersHorizontal className="h-3.5 w-3.5 text-amber-700" />
                              <span className="font-bold">ثبت مقادیر و تصویب</span>
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewCountDialog open={isNewOpen} onOpenChange={setIsNewOpen} />
      <CountDetailDialog
        count={selectedCount}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
