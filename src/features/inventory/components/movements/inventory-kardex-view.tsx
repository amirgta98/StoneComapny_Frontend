"use client";

import { useState } from "react";
import {
  History,
  Search,
  Filter,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryMovements, useInventoryItems } from "../../hooks/use-inventory";
import { MovementTypeBadge } from "../common/inventory-badges";
import { MOVEMENT_TYPE_LABELS, type MovementType } from "@/modules/inventory/domain/value-objects/inventory-status.vo";

export function InventoryKardexView() {
  const [selectedItemId, setSelectedItemId] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const { data: itemsData } = useInventoryItems();
  const { data, isLoading, error, refetch } = useInventoryMovements({
    inventoryItemId: selectedItemId !== "all" ? selectedItemId : undefined,
    type: selectedType !== "all" ? selectedType : undefined,
  });

  const movements = data?.movements || [];
  const items = itemsData?.items || [];

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <History className="h-6 w-6 text-amber-600 shrink-0" />
            کاردکس و گردش انبار سنگ (Inventory Movements Ledger)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            ردیابی خط‌به‌خط کلیه ورودی‌ها، خروجی‌ها، حواله‌ها، انتقالات و تعدیلات فیزیکی با حفظ موجودی پایان دوره
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

      {/* Filter Bar */}
      <div className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Stone Item Selector */}
          <div>
            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="فیلتر بر اساس سنگ" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="all">همه سنگ‌ها و اسلب‌ها</SelectItem>
                {items.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.productName} ({i.locationName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Movement Type Selector */}
          <div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="نوع عملیات انبار" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="all">همه انواع گردش</SelectItem>
                {Object.entries(MOVEMENT_TYPE_LABELS).map(([k, label]) => (
                  <SelectItem key={k} value={k}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end text-xs text-muted-foreground tabular-nums">
            مجموع رکوردهای گردش: <strong>{movements.length.toLocaleString("fa-IR")}</strong> سند
          </div>
        </div>
      </div>

      {/* Movements Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center border border-destructive/30 rounded-2xl bg-destructive/5 text-destructive">
          <p className="font-bold text-sm">خطا در بارگذاری کاردکس انبار</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            تلاش مجدد
          </Button>
        </div>
      ) : movements.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <History className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="font-bold text-sm text-foreground">گردشی در کاردکس با این مشخصات یافت نشد</h3>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-3 text-start">تاریخ و ساعت</th>
                  <th className="px-3 py-3 text-start">نوع عملیات</th>
                  <th className="px-3 py-3 text-start">نام سنگ / اسلب</th>
                  <th className="px-3 py-3 text-center">ورود (+)</th>
                  <th className="px-3 py-3 text-center">خروج (-)</th>
                  <th className="px-3 py-3 text-center">مانده موجودی</th>
                  <th className="px-3 py-3 text-start">سند مرجع / شماره</th>
                  <th className="px-3 py-3 text-start">علت و توضیحات</th>
                  <th className="px-4 py-3 text-end">عامل ثبت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {movements.map((mov) => {
                  const isInflow =
                    mov.type === "RECEIPT" ||
                    mov.type === "TRANSFER_IN" ||
                    mov.type === "ADJUSTMENT_IN" ||
                    mov.type === "INITIAL";
                  const isOutflow =
                    mov.type === "ISSUE" ||
                    mov.type === "TRANSFER_OUT" ||
                    mov.type === "ADJUSTMENT_OUT";

                  return (
                    <tr key={mov.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-[11px]">
                        {mov.createdAt}
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap">
                        <MovementTypeBadge type={mov.type} />
                      </td>

                      <td className="px-3 py-3 font-bold text-foreground max-w-[180px] truncate">
                        {mov.productName}
                      </td>

                      {/* Inflow */}
                      <td className="px-3 py-3 text-center whitespace-nowrap font-black tabular-nums text-emerald-600">
                        {isInflow ? `+${mov.quantity.toLocaleString("fa-IR")} ${mov.unit}` : "—"}
                      </td>

                      {/* Outflow */}
                      <td className="px-3 py-3 text-center whitespace-nowrap font-black tabular-nums text-rose-600">
                        {isOutflow ? `-${mov.quantity.toLocaleString("fa-IR")} ${mov.unit}` : "—"}
                      </td>

                      {/* Balance After */}
                      <td className="px-3 py-3 text-center whitespace-nowrap font-extrabold tabular-nums text-foreground bg-secondary/20">
                        {mov.balanceAfter.toLocaleString("fa-IR")}{" "}
                        <span className="text-[10px] text-muted-foreground font-normal">{mov.unit}</span>
                      </td>

                      {/* Reference */}
                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                        {mov.referenceNumber || mov.referenceType || "—"}
                      </td>

                      {/* Reason */}
                      <td className="px-3 py-3 text-muted-foreground max-w-[220px] truncate">
                        {mov.reason || "—"}
                      </td>

                      {/* Performer */}
                      <td className="px-4 py-3 text-end whitespace-nowrap text-muted-foreground">
                        {mov.performedBy}
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
