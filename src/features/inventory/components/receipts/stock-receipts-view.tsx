"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  Plus,
  CheckCircle2,
  Clock,
  Building,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryReceipts, useConfirmReceipt } from "../../hooks/use-inventory";
import { NewReceiptDialog } from "./new-receipt-dialog";

export function StockReceiptsView() {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const { data, isLoading, error, refetch } = useInventoryReceipts();
  const { mutate: confirmReceipt, isPending: isConfirming } = useConfirmReceipt();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const receipts = data?.receipts || [];

  const handleConfirm = (receiptId: string) => {
    setConfirmingId(receiptId);
    confirmReceipt(receiptId, {
      onSettled: () => setConfirmingId(null),
    });
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <ArrowDownLeft className="h-6 w-6 text-emerald-600 shrink-0" />
            رسیدهای ورود سنگ به انبار (Inbound Receipts)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            ثبت و تصویب ورودی‌های خط برش، اره، کوپ‌های سنگ و خریدهای تامین‌کنندگان
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
            className="gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>ثبت رسید ورود جدید</span>
          </Button>
        </div>
      </div>

      {/* Receipts Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center border border-destructive/30 rounded-2xl bg-destructive/5 text-destructive">
          <p className="font-bold text-sm">خطا در بارگذاری رسیدهای انبار</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            تلاش مجدد
          </Button>
        </div>
      ) : receipts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <ArrowDownLeft className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="font-bold text-sm text-foreground">رسیدی برای نمایش وجود ندارد</h3>
          <p className="text-xs text-muted-foreground">
            جهت ثبت ورود سنگ جدید از خط فرآوری یا تامین‌کننده، از دکمه ثبت رسید استفاده فرمایید.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-3 text-start">شماره رسید</th>
                  <th className="px-3 py-3 text-start">منبع ورود / تامین‌کننده</th>
                  <th className="px-3 py-3 text-center">متراژ / تعداد</th>
                  <th className="px-3 py-3 text-start">ارجاع / بارنامه</th>
                  <th className="px-3 py-3 text-center">وضعیت رسید</th>
                  <th className="px-3 py-3 text-start">تحویل‌گیرنده</th>
                  <th className="px-3 py-3 text-start">تاریخ ثبت</th>
                  <th className="px-4 py-3 text-end">اقدام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {receipts.map((rec) => {
                  const isDraft = rec.status === "DRAFT";
                  const isConfirmed = rec.status === "CONFIRMED";

                  return (
                    <tr key={rec.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-foreground">
                        {rec.receiptNumber}
                      </td>

                      <td className="px-3 py-3">
                        <p className="font-medium text-foreground">
                          {rec.source === "PRODUCTION" ? "خط تولید کارخانه" : "تامین‌کننده / خرید"}
                        </p>
                        {rec.supplierName && (
                          <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                            {rec.supplierName}
                          </p>
                        )}
                      </td>

                      <td className="px-3 py-3 text-center whitespace-nowrap font-black tabular-nums text-emerald-600">
                        +{rec.totalQuantity.toLocaleString("fa-IR")} {rec.unit}
                      </td>

                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                        {rec.reference || "—"}
                      </td>

                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        {isConfirmed ? (
                          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            تأیید و اعمال شده
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 text-[11px] font-semibold gap-1">
                            <Clock className="h-3 w-3" />
                            پیش‌نویس
                          </Badge>
                        )}
                      </td>

                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                        {rec.receivedBy}
                      </td>

                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap text-[11px]">
                        {rec.createdAt}
                      </td>

                      <td className="px-4 py-3 text-end whitespace-nowrap">
                        {isDraft ? (
                          <Button
                            size="sm"
                            disabled={isConfirming && confirmingId === rec.id}
                            onClick={() => handleConfirm(rec.id)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1 h-7"
                          >
                            {isConfirming && confirmingId === rec.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            <span>تأیید ورود به انبار</span>
                          </Button>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">تکمیل شده</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Receipt Dialog */}
      <NewReceiptDialog open={isNewOpen} onOpenChange={setIsNewOpen} />
    </div>
  );
}
