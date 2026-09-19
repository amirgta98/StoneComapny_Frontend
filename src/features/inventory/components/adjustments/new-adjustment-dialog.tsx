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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateAdjustment,
  useInventoryItems,
} from "../../hooks/use-inventory";
import { Sliders, Loader2, AlertCircle } from "lucide-react";

interface NewAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAdjustmentDialog({
  open,
  onOpenChange,
}: NewAdjustmentDialogProps) {
  const { data: itemsData } = useInventoryItems();
  const { mutate: createAdjustment, isPending } = useCreateAdjustment();

  const [inventoryItemId, setInventoryItemId] = useState("");
  const [targetProperty, setTargetProperty] = useState<
    "onHand" | "damaged" | "qualityCheck" | "scrap"
  >("onHand");
  const [changeType, setChangeType] = useState<"increase" | "decrease">("decrease");
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");

  const items = itemsData?.items || [];
  const selectedItem = items.find((i) => i.id === inventoryItemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryItemId || quantity <= 0 || !reason) return;

    const quantityChange = changeType === "increase" ? quantity : -quantity;

    createAdjustment(
      {
        inventoryItemId,
        quantityChange,
        targetProperty,
        reason,
        referenceNumber: referenceNumber || undefined,
        referenceType: "MANUAL_ADJUSTMENT",
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setInventoryItemId("");
          setQuantity(0);
          setReason("");
          setReferenceNumber("");
          setNotes("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Sliders className="h-5 w-5 text-amber-600" />
            ثبت سند تعدیل موجودی سنگ و ضایعات
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            اصلاح دستی مانده موجودی فیزیکی، ثبت سنگ‌های شکسته یا انتقالی به بخش ضایعات و کنترل کیفی
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Select Stone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              انتخاب سنگ / اسلب <span className="text-destructive">*</span>
            </label>
            <Select value={inventoryItemId} onValueChange={setInventoryItemId} required>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="یک سنگ را انتخاب کنید..." />
              </SelectTrigger>
              <SelectContent dir="rtl">
                {items.map((item) => (
                  <SelectItem key={item.id} value={item.id} className="text-xs">
                    {item.productName} ({item.dimensions || item.form}) — موجودی: {item.onHand} {item.unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Stock Preview */}
          {selectedItem && (
            <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-secondary/40 border border-border/70 text-center text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">موجودی کل</span>
                <span className="font-bold tabular-nums text-foreground">
                  {selectedItem.onHand} {selectedItem.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">رزرو شده</span>
                <span className="font-bold tabular-nums text-amber-600">
                  {selectedItem.reserved} {selectedItem.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">ضایعات</span>
                <span className="font-bold tabular-nums text-rose-600">
                  {selectedItem.scrap} {selectedItem.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">شکستگی/آسیب</span>
                <span className="font-bold tabular-nums text-purple-600">
                  {selectedItem.damaged} {selectedItem.unit}
                </span>
              </div>
            </div>
          )}

          {/* Target Property */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              بخش هدف تعدیل <span className="text-destructive">*</span>
            </label>
            <Select
              value={targetProperty}
              onValueChange={(val) =>
                setTargetProperty(val as "onHand" | "damaged" | "qualityCheck" | "scrap")
              }
            >
              <SelectTrigger className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="onHand" className="text-xs">
                  موجودی فیزیکی اصلی (onHand)
                </SelectItem>
                <SelectItem value="damaged" className="text-xs">
                  سنگ‌های شکسته / آسیب‌دیده (damaged)
                </SelectItem>
                <SelectItem value="qualityCheck" className="text-xs">
                  قرنطینه و کنترل کیفی (qualityCheck)
                </SelectItem>
                <SelectItem value="scrap" className="text-xs">
                  ضایعات و لاشه سنگ (scrap)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type of change and Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                نوع عملیات <span className="text-destructive">*</span>
              </label>
              <div className="flex rounded-lg border border-border p-0.5 bg-secondary/30">
                <button
                  type="button"
                  onClick={() => setChangeType("decrease")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    changeType === "decrease"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  کاهش / کسری (-)
                </button>
                <button
                  type="button"
                  onClick={() => setChangeType("increase")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    changeType === "increase"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  افزایش / مازاد (+)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                مقدار ({selectedItem?.unit || "مترمربع"}) <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                step="any"
                min="0.01"
                placeholder="۰"
                value={quantity || ""}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                className="text-xs tabular-nums text-start font-bold"
                required
              />
            </div>
          </div>

          {/* Reason & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                دلیل تعدیل <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="مثلا: شکستگی حین بارگیری، خطای برش، اصلاح مغایرت"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                شماره مرجع / صورتجلسه
              </label>
              <Input
                placeholder="مثلا: صورتجلسه QC-1403-09"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">توضیحات تکمیلی</label>
            <Textarea
              placeholder="توضیحات و یادداشت‌های فنی..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs min-h-[60px]"
            />
          </div>

          <DialogFooter className="pt-2 flex justify-between sm:justify-between items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              انصراف
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isPending || !inventoryItemId || quantity <= 0 || !reason}
              className="gap-1.5 bg-amber-700 hover:bg-amber-800 text-white"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>ثبت سند تعدیل در کاردکس</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
