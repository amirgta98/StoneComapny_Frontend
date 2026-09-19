"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Plus,
  CheckCircle2,
  Clock,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryIssues, useConfirmIssue } from "../../hooks/use-inventory";
import { NewIssueDialog } from "./new-issue-dialog";

export function StockIssuesView() {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const { data, isLoading, error, refetch } = useInventoryIssues();
  const { mutate: confirmIssue, isPending: isConfirming } = useConfirmIssue();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const issues = data?.issues || [];

  const handleConfirm = (issueId: string) => {
    setConfirmingId(issueId);
    confirmIssue(issueId, {
      onSettled: () => setConfirmingId(null),
    });
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <ArrowUpRight className="h-6 w-6 text-rose-600 shrink-0" />
            حواله‌های خروج سنگ از انبار (Outbound Issues)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            ثبت و صدور خروج بار برای سفارشات مشتریان، تحویل به باربری، نمونه‌ها یا مصرف کارخانه‌ای
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
            className="gap-1.5 text-xs bg-rose-700 hover:bg-rose-800 text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>صدور حواله خروج جدید</span>
          </Button>
        </div>
      </div>

      {/* Issues Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center border border-destructive/30 rounded-2xl bg-destructive/5 text-destructive">
          <p className="font-bold text-sm">خطا در بارگذاری حواله‌های خروج</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            تلاش مجدد
          </Button>
        </div>
      ) : issues.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <ArrowUpRight className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="font-bold text-sm text-foreground">حواله خروجی ثبت نشده است</h3>
          <p className="text-xs text-muted-foreground">
            برای خروج سنگ از انبار، روی دکمه صدور حواله خروج کلیک کنید.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-3 text-start">شماره حواله</th>
                  <th className="px-3 py-3 text-start">علت خروج / مشتری</th>
                  <th className="px-3 py-3 text-center">متراژ / تعداد</th>
                  <th className="px-3 py-3 text-start">سفارش / فاکتور</th>
                  <th className="px-3 py-3 text-center">وضعیت</th>
                  <th className="px-3 py-3 text-start">صادرکننده</th>
                  <th className="px-3 py-3 text-start">تاریخ خروج</th>
                  <th className="px-4 py-3 text-end">اقدام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {issues.map((iss) => {
                  const isDraft = iss.status === "DRAFT";
                  const isConfirmed = iss.status === "CONFIRMED";

                  return (
                    <tr key={iss.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-foreground">
                        {iss.issueNumber}
                      </td>

                      <td className="px-3 py-3">
                        <p className="font-medium text-foreground">
                          {iss.reason === "ORDER_FULFILLMENT" ? "ارسال سفارش مشتری" : iss.reason}
                        </p>
                        {iss.customerName && (
                          <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                            {iss.customerName}
                          </p>
                        )}
                      </td>

                      <td className="px-3 py-3 text-center whitespace-nowrap font-black tabular-nums text-rose-600">
                        -{iss.totalQuantity.toLocaleString("fa-IR")} {iss.unit}
                      </td>

                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                        {iss.orderId || iss.reference || "—"}
                      </td>

                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        {isConfirmed ? (
                          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            تأیید و خارج شده
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 text-[11px] font-semibold gap-1">
                            <Clock className="h-3 w-3" />
                            پیش‌نویس
                          </Badge>
                        )}
                      </td>

                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                        {iss.issuedBy}
                      </td>

                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap text-[11px]">
                        {iss.createdAt}
                      </td>

                      <td className="px-4 py-3 text-end whitespace-nowrap">
                        {isDraft ? (
                          <Button
                            size="sm"
                            disabled={isConfirming && confirmingId === iss.id}
                            onClick={() => handleConfirm(iss.id)}
                            className="bg-rose-700 hover:bg-rose-800 text-white text-xs gap-1 h-7"
                          >
                            {isConfirming && confirmingId === iss.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            <span>تأیید خروج از انبار</span>
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

      {/* New Issue Dialog */}
      <NewIssueDialog open={isNewOpen} onOpenChange={setIsNewOpen} />
    </div>
  );
}
