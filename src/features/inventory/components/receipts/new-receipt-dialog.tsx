"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createReceiptSchema, type CreateReceiptInput } from "@/modules/inventory/application/dto/inventory.dto";
import { useCreateReceipt, useInventoryLocations } from "../../hooks/use-inventory";
import { Plus, Trash2, ArrowDownLeft, Loader2 } from "lucide-react";
import { STONE_TYPES } from "@/constants/stone";
import { STONE_TYPE_LABELS } from "@/features/products/constants";

interface NewReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewReceiptDialog({ open, onOpenChange }: NewReceiptDialogProps) {
  const { mutate: createReceipt, isPending } = useCreateReceipt();
  const { data: locationsData } = useInventoryLocations();
  const locations = locationsData?.locations || [];

  const form = useForm<CreateReceiptInput>({
    resolver: zodResolver(createReceiptSchema),
    defaultValues: {
      source: "PRODUCTION",
      supplierName: "",
      reference: "",
      notes: "",
      unit: "sqm",
      items: [
        {
          productId: "prod-1",
          productName: "سنگ مرمریت کالاتا گلد",
          stoneType: "marble",
          dimensions: "۳۰۰ × ۱۶۰ سانتی‌متر",
          thickness: 2,
          grade: "سوپر ممتاز",
          locationId: locations[0]?.id || "loc-hall-a",
          locationName: locations[0]?.name || "سوله A",
          quantity: 100,
          unit: "sqm",
          unitCost: 8500000,
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: CreateReceiptInput) => {
    // Fill locationName from selected locationId if needed
    const enrichedItems = data.items.map((item) => {
      const loc = locations.find((l) => l.id === item.locationId);
      return {
        ...item,
        locationName: loc ? loc.name : item.locationName,
      };
    });

    createReceipt(
      { ...data, items: enrichedItems },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
            ثبت رسید ورود سنگ به انبار (پیش‌نویس)
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            ورود سنگ حاصل از خط تولید، قله‌بر، اره یا خرید از معادن را ثبت فرمایید. رسید پس از تایید موجودی را افزایش می‌دهد.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Header Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-border/80 bg-secondary/20">
            <div>
              <Label className="text-xs font-semibold">منبع ورود سنگ</Label>
              <Select
                defaultValue="PRODUCTION"
                onValueChange={(val: "PRODUCTION" | "SUPPLIER" | "PURCHASE" | "RETURN" | "OTHER") =>
                  form.setValue("source", val)
                }
              >
                <SelectTrigger className="text-xs mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="PRODUCTION">خط تولید کارخانه</SelectItem>
                  <SelectItem value="SUPPLIER">تامین‌کننده / معدن</SelectItem>
                  <SelectItem value="PURCHASE">خرید مستقیم</SelectItem>
                  <SelectItem value="RETURN">مرجوعی مشتری</SelectItem>
                  <SelectItem value="OTHER">سایر منابع</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">نام تامین‌کننده / خط برش</Label>
              <Input
                {...form.register("supplierName")}
                placeholder="مثال: خط اره ۲ یا معدن آتشکوه"
                className="text-xs mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">شماره بارنامه / حواله کارگاهی</Label>
              <Input
                {...form.register("reference")}
                placeholder="مثال: بارنامه #۸۹۰۴"
                className="text-xs mt-1"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground">ردیف‌های سنگ ورودی</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs gap-1"
                onClick={() =>
                  append({
                    productId: `prod-${Date.now()}`,
                    productName: "اسلب سنگ طبیعی",
                    stoneType: "marble",
                    dimensions: "طولی آزاد",
                    thickness: 2,
                    grade: "درجه یک",
                    locationId: locations[0]?.id || "loc-hall-a",
                    locationName: locations[0]?.name || "سوله A",
                    quantity: 50,
                    unit: "sqm",
                    unitCost: 1000000,
                  })
                }
              >
                <Plus className="h-3.5 w-3.5" />
                <span>افزودن ردیف</span>
              </Button>
            </div>

            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="p-3.5 rounded-xl border border-border/80 bg-card space-y-3 relative"
              >
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 absolute top-2.5 end-2.5 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(idx)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <Label className="text-xs">نام سنگ / محصول</Label>
                    <Input
                      {...form.register(`items.${idx}.productName`)}
                      placeholder="مثال: تراورتن عباس‌آباد سوپر"
                      className="text-xs mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">نوع سنگ</Label>
                    <Select
                      defaultValue="marble"
                      onValueChange={(val) => form.setValue(`items.${idx}.stoneType`, val)}
                    >
                      <SelectTrigger className="text-xs mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {STONE_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {STONE_TYPE_LABELS[t] || t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-xs">ابعاد (طول × عرض)</Label>
                    <Input
                      {...form.register(`items.${idx}.dimensions`)}
                      placeholder="۲۸۰ × ۱۶۰ cm"
                      className="text-xs mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">مقدار ورودی (متراژ / عدد)</Label>
                    <Input
                      type="number"
                      step="any"
                      {...form.register(`items.${idx}.quantity`, { valueAsNumber: true })}
                      className="text-xs mt-1 tabular-nums font-bold"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">موقعیت انبار</Label>
                    <Select
                      defaultValue={locations[0]?.id || "loc-hall-a"}
                      onValueChange={(val) => {
                        const loc = locations.find((l) => l.id === val);
                        form.setValue(`items.${idx}.locationId`, val);
                        if (loc) form.setValue(`items.${idx}.locationName`, loc.name);
                      }}
                    >
                      <SelectTrigger className="text-xs mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {locations.map((l) => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">بهای تمام شده (تومان)</Label>
                    <Input
                      type="number"
                      {...form.register(`items.${idx}.unitCost`, { valueAsNumber: true })}
                      placeholder="هزینه واحد"
                      className="text-xs mt-1 tabular-nums"
                    />
                  </div>
                </div>
              </div>
            ))}
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
              disabled={isPending}
              className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>ثبت برگه رسید</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
