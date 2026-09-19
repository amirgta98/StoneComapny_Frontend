"use client";

import { useState } from "react";
import {
  ArrowLeftRight,
  Plus,
  RefreshCw,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryTransfers } from "../../hooks/use-inventory";
import { NewTransferDialog } from "./new-transfer-dialog";

export function StockTransfersView() {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const { data, isLoading, error, refetch } = useInventoryTransfers();

  const transfers = data?.transfers || [];

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <ArrowLeftRight className="h-6 w-6 text-amber-600 shrink-0" />
            انتقالات بین موقعیت‌های انبار (Inter-Location Transfers)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            ردیابی جابجایی سنگ‌ها بین سوله‌ها، سالن ساب، خرک‌های اسلب و دپوی روباز
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
            <span>ثبت جابجایی جدید</span>
          </Button>
        </div>
      </div>

      {/* Transfers Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center border border-destructive/30 rounded-2xl bg-destructive/5 text-destructive">
          <p className="font-bold text-sm">خطا در بارگذاری انتقالات انبار</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            تلاش مجدد
          </Button>
        </div>
      ) : transfers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <ArrowLeftRight className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="font-bold text-sm text-foreground">انتقالی بین انبارها ثبت نشده است</h3>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-3 text-start">شماره انتقال</th>
                  <th className="px-3 py-3 text-start">نام سنگ / اسلب</th>
                  <th className="px-3 py-3 text-center">مقدار انتقالی</th>
                  <th className="px-3 py-3 text-start">مبدا (خروج)</th>
                  <th className="px-3 py-3 text-start">مقصد (ورود)</th>
                  <th className="px-3 py-3 text-center">وضعیت</th>
                  <th className="px-3 py-3 text-start">علت انتقال</th>
                  <th className="px-3 py-3 text-start">اپراتور</th>
                  <th className="px-4 py-3 text-end">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {transfers.map((t) => (
                  <tr key={t.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-foreground">
                      {t.transferNumber}
                    </td>

                    <td className="px-3 py-3 font-bold text-foreground max-w-[180px] truncate">
                      {t.productName}
                    </td>

                    <td className="px-3 py-3 text-center whitespace-nowrap font-black tabular-nums text-foreground">
                      {t.quantity.toLocaleString("fa-IR")} {t.unit}
                    </td>

                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-rose-700 font-medium">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[130px]">{t.sourceLocationName}</span>
                      </div>
                    </td>

                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-emerald-700 font-medium">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[130px]">{t.destinationLocationName}</span>
                      </div>
                    </td>

                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        تکمیل شده
                      </Badge>
                    </td>

                    <td className="px-3 py-3 text-muted-foreground max-w-[180px] truncate">
                      {t.reason || "—"}
                    </td>

                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                      {t.transferredBy}
                    </td>

                    <td className="px-4 py-3 text-end text-[11px] text-muted-foreground whitespace-nowrap">
                      {t.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Transfer Modal */}
      <NewTransferDialog open={isNewOpen} onOpenChange={setIsNewOpen} />
    </div>
  );
}
