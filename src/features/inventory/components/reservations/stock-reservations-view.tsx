"use client";

import { useState } from "react";
import {
  Bookmark,
  RefreshCw,
  Unlock,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryReservations, useReleaseReservation } from "../../hooks/use-inventory";

export function StockReservationsView() {
  const { data, isLoading, error, refetch } = useInventoryReservations();
  const { mutate: releaseReservation, isPending: isReleasing } = useReleaseReservation();
  const [releasingId, setReleasingId] = useState<string | null>(null);

  const reservations = data?.reservations || [];

  const handleRelease = (id: string) => {
    setReleasingId(id);
    releaseReservation(id, {
      onSettled: () => setReleasingId(null),
    });
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-amber-600 shrink-0" />
            رزروهای انبار سنگ (Stock Reservations)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            سنگ‌های رزرو شده برای سفارشات آنلاین، پیش‌فاکتورها و قراردادهای در جریان کارخانه
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-1.5 text-xs self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>بروزرسانی</span>
        </Button>
      </div>

      {/* Reservations Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center border border-destructive/30 rounded-2xl bg-destructive/5 text-destructive">
          <p className="font-bold text-sm">خطا در بارگذاری رزروهای انبار</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            تلاش مجدد
          </Button>
        </div>
      ) : reservations.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <Bookmark className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="font-bold text-sm text-foreground">رزرو فعالی در انبار وجود ندارد</h3>
          <p className="text-xs text-muted-foreground">کلیه موجودی آزاد آماده فروش و صدور حواله است.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-3 text-start">شماره رزرو</th>
                  <th className="px-3 py-3 text-start">سفارش / مشتری</th>
                  <th className="px-3 py-3 text-start">نام سنگ / اسلب</th>
                  <th className="px-3 py-3 text-center">متراژ رزرو</th>
                  <th className="px-3 py-3 text-start">موقعیت انبار</th>
                  <th className="px-3 py-3 text-center">وضعیت</th>
                  <th className="px-3 py-3 text-start">مهلت انقضا</th>
                  <th className="px-4 py-3 text-end">اقدام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {reservations.map((res) => {
                  const isActive = res.status === "ACTIVE";
                  const isConsumed = res.status === "CONSUMED";
                  const isReleased = res.status === "RELEASED";

                  return (
                    <tr key={res.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-foreground">
                        {res.reservationNumber}
                      </td>

                      <td className="px-3 py-3">
                        <p className="font-semibold text-foreground">
                          {res.orderNumber || "پیش‌فاکتور"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                          {res.customerName || "مشتری آنلاین"}
                        </p>
                      </td>

                      <td className="px-3 py-3 font-medium text-foreground max-w-[180px] truncate">
                        {res.productName}
                      </td>

                      <td className="px-3 py-3 text-center whitespace-nowrap font-black tabular-nums text-amber-600">
                        {res.quantity.toLocaleString("fa-IR")} {res.unit}
                      </td>

                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                        {res.locationName}
                      </td>

                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        {isActive && (
                          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 text-[11px] font-semibold gap-1">
                            <Clock className="h-3 w-3" />
                            فعال (متعهد)
                          </Badge>
                        )}
                        {isConsumed && (
                          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            خارج شده
                          </Badge>
                        )}
                        {isReleased && (
                          <Badge variant="secondary" className="text-[11px]">
                            آزاد شده
                          </Badge>
                        )}
                      </td>

                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap text-[11px]">
                        {res.expiresAt || "نامحدود"}
                      </td>

                      <td className="px-4 py-3 text-end whitespace-nowrap">
                        {isActive ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isReleasing && releasingId === res.id}
                            onClick={() => handleRelease(res.id)}
                            className="gap-1 text-xs text-amber-700 border-amber-500/30 hover:bg-amber-500/10 h-7"
                          >
                            {isReleasing && releasingId === res.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Unlock className="h-3 w-3" />
                            )}
                            <span>آزادسازی رزرو</span>
                          </Button>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">—</span>
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
    </div>
  );
}
