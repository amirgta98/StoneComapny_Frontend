"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCompleteStockCount } from "../../hooks/use-inventory";
import type { StockCountDto } from "../../types/inventory.types";
import { ClipboardCheck, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface CountDetailDialogProps {
  count: StockCountDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CountDetailDialog({
  count,
  open,
  onOpenChange,
}: CountDetailDialogProps) {
  const { mutate: completeCount, isPending } = useCompleteStockCount();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!open || !count) return null;

  const isCompleted = count.status === "COMPLETED";

  const getPhysicalQty = (itemId: string, systemQty: number) => {
    if (quantities[itemId] !== undefined) return quantities[itemId];
    const match = count.items.find((i) => i.id === itemId);
    return match ? match.physicalQuantity : systemQty;
  };

  const handleQtyChange = (itemId: string, val: number) => {
    setQuantities((prev) => ({ ...prev, [itemId]: val }));
  };

  const handleComplete = () => {
    const payloadItems = count.items.map((item) => ({
      id: item.id,
      inventoryItemId: item.inventoryItemId,
      physicalQuantity: getPhysicalQty(item.id, item.systemQuantity),
      notes: item.notes,
    }));

    completeCount(
      { countId: count.id, data: { items: payloadItems } },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-amber-600" />
              {count.title} ({count.countNumber})
            </DialogTitle>
            {isCompleted ? (
              <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 text-xs font-semibold gap-1">
                <CheckCircle2 className="h-3 w-3" />
                تصویب و نهایی شده
              </Badge>
            ) : (
              <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 text-xs font-semibold">
                در جریان شمارش فیزیکی
              </Badge>
            )}
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            موقعیت: <strong>{count.locationName}</strong> · ثبت توسط: {count.countedBy} · تاریخ: {count.createdAt}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Table of Count items */}
          <div className="rounded-xl border border-border/80 overflow-hidden">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/40 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-3 py-2.5 text-start">نام سنگ / اسلب</th>
                  <th className="px-3 py-2.5 text-center">موجودی سیستمی</th>
                  <th className="px-3 py-2.5 text-center">شمارش فیزیکی</th>
                  <th className="px-3 py-2.5 text-center">مغایرت (کسری/مازاد)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {count.items.map((item) => {
                  const physical = isCompleted
                    ? item.physicalQuantity
                    : getPhysicalQty(item.id, item.systemQuantity);
                  const diff = physical - item.systemQuantity;

                  return (
                    <tr key={item.id} className="hover:bg-secondary/10">
                      <td className="px-3 py-2.5 font-bold text-foreground">
                        {item.productName}
                        {item.dimensions && (
                          <span className="text-[11px] text-muted-foreground font-normal block">
                            {item.dimensions}
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-2.5 text-center tabular-nums font-semibold text-muted-foreground">
                        {item.systemQuantity.toLocaleString("fa-IR")} {item.unit}
                      </td>

                      <td className="px-3 py-2.5 text-center">
                        {isCompleted ? (
                          <span className="font-bold tabular-nums text-foreground">
                            {physical.toLocaleString("fa-IR")} {item.unit}
                          </span>
                        ) : (
                          <Input
                            type="number"
                            step="any"
                            value={physical}
                            onChange={(e) =>
                              handleQtyChange(item.id, parseFloat(e.target.value) || 0)
                            }
                            className="w-24 mx-auto text-center text-xs h-7 tabular-nums font-bold"
                          />
                        )}
                      </td>

                      <td className="px-3 py-2.5 text-center font-bold tabular-nums">
                        {diff === 0 ? (
                          <span className="text-muted-foreground">بدون مغایرت (۰)</span>
                        ) : diff > 0 ? (
                          <span className="text-emerald-600">+{diff.toLocaleString("fa-IR")} {item.unit} (مازاد)</span>
                        ) : (
                          <span className="text-rose-600">{diff.toLocaleString("fa-IR")} {item.unit} (کسری)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!isCompleted && (
            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-800 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>
                با تصویب انبارگردانی، کلیه مغایرت‌های فوق به صورت خودکار به عنوان سند تعدیل انبار ثبت و مانده فیزیکی اصلاح خواهد شد.
              </span>
            </div>
          )}

          <DialogFooter className="pt-2 flex justify-between sm:justify-between items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              بستن
            </Button>

            {!isCompleted && (
              <Button
                type="button"
                size="sm"
                disabled={isPending}
                onClick={handleComplete}
                className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                <CheckCircle2 className="h-4 w-4" />
                <span>تصویب و ثبت خودکار تعدیلات</span>
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
