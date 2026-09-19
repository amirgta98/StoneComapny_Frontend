"use client";

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
import { createIssueSchema, type CreateIssueInput } from "@/modules/inventory/application/dto/inventory.dto";
import { useCreateIssue, useInventoryItems, useInventoryLocations } from "../../hooks/use-inventory";
import { ArrowUpRight, Plus, Trash2, Loader2 } from "lucide-react";

interface NewIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewIssueDialog({ open, onOpenChange }: NewIssueDialogProps) {
  const { mutate: createIssue, isPending } = useCreateIssue();
  const { data: itemsData } = useInventoryItems();
  const { data: locationsData } = useInventoryLocations();

  const inventoryItems = itemsData?.items || [];
  const locations = locationsData?.locations || [];

  const form = useForm<CreateIssueInput>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      reason: "ORDER_FULFILLMENT",
      customerName: "",
      orderId: "",
      reference: "",
      notes: "",
      unit: "sqm",
      items: [
        {
          inventoryItemId: inventoryItems[0]?.id || "inv-1",
          productId: inventoryItems[0]?.productId || "prod-1",
          productName: inventoryItems[0]?.productName || "سنگ مرمریت",
          stoneType: inventoryItems[0]?.stoneType || "marble",
          locationId: inventoryItems[0]?.locationId || "loc-hall-a",
          locationName: inventoryItems[0]?.locationName || "سوله A",
          quantity: 20,
          unit: "sqm",
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: CreateIssueInput) => {
    // Enrich with item details from selected inventoryItemId
    const enrichedItems = data.items.map((item) => {
      const inv = inventoryItems.find((i) => i.id === item.inventoryItemId);
      return {
        ...item,
        productId: inv ? inv.productId : item.productId,
        productName: inv ? inv.productName : item.productName,
        stoneType: inv ? inv.stoneType : item.stoneType,
        locationId: inv ? inv.locationId : item.locationId,
        locationName: inv ? inv.locationName : item.locationName,
      };
    });

    createIssue(
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
            <ArrowUpRight className="h-5 w-5 text-rose-600" />
            صدور حواله خروج سنگ از انبار (Outbound Issue)
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            خروج سنگ جهت ارسال سفارش مشتری، مصرف کارخانه‌ای، نمونه شوروم، یا تفکیک ضایعات
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Reason & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-border/80 bg-secondary/20">
            <div>
              <Label className="text-xs font-semibold">علت خروج بار</Label>
              <Select
                defaultValue="ORDER_FULFILLMENT"
                onValueChange={(
                  val:
                    | "ORDER_FULFILLMENT"
                    | "FACTORY_CONSUMPTION"
                    | "SAMPLE"
                    | "DAMAGE"
                    | "SCRAP"
                    | "TRANSFER"
                    | "OTHER"
                ) => form.setValue("reason", val)}
              >
                <SelectTrigger className="text-xs mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="ORDER_FULFILLMENT">ارسال سفارش مشتری</SelectItem>
                  <SelectItem value="FACTORY_CONSUMPTION">مصرف خطوط کارخانه</SelectItem>
                  <SelectItem value="SAMPLE">نمونه معماران و نمایشگاه</SelectItem>
                  <SelectItem value="DAMAGE">کسر شکستگی و آسیب</SelectItem>
                  <SelectItem value="SCRAP">ضایعات و لاشه سنگ</SelectItem>
                  <SelectItem value="OTHER">سایر موارد</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">نام مشتری / پروژه</Label>
              <Input
                {...form.register("customerName")}
                placeholder="مثال: مهندس رادپور (پروژه فرمانیه)"
                className="text-xs mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">شماره سفارش / فاکتور</Label>
              <Input
                {...form.register("reference")}
                placeholder="مثال: ORD-94102 یا فاکتور ۹۰۴"
                className="text-xs mt-1"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground">اقلام حواله خروج</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs gap-1"
                onClick={() =>
                  append({
                    inventoryItemId: inventoryItems[0]?.id || "inv-1",
                    productId: inventoryItems[0]?.productId || "prod-1",
                    productName: inventoryItems[0]?.productName || "سنگ",
                    stoneType: inventoryItems[0]?.stoneType || "marble",
                    locationId: inventoryItems[0]?.locationId || "loc-hall-a",
                    locationName: inventoryItems[0]?.locationName || "سوله A",
                    quantity: 10,
                    unit: "sqm",
                  })
                }
              >
                <Plus className="h-3.5 w-3.5" />
                <span>افزودن قلم کالا</span>
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
                    <Label className="text-xs">انتخاب سنگ از دپوی انبار</Label>
                    <Select
                      defaultValue={inventoryItems[0]?.id}
                      onValueChange={(val) => {
                        const inv = inventoryItems.find((i) => i.id === val);
                        form.setValue(`items.${idx}.inventoryItemId`, val);
                        if (inv) {
                          form.setValue(`items.${idx}.productId`, inv.productId);
                          form.setValue(`items.${idx}.productName`, inv.productName);
                          form.setValue(`items.${idx}.stoneType`, inv.stoneType);
                          form.setValue(`items.${idx}.locationId`, inv.locationId);
                          form.setValue(`items.${idx}.locationName`, inv.locationName);
                        }
                      }}
                    >
                      <SelectTrigger className="text-xs mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {inventoryItems.map((i) => (
                          <SelectItem key={i.id} value={i.id}>
                            {i.productName} ({i.locationName} — موجودی آزاد: {i.available} {i.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">مقدار خروج (متراژ / عدد)</Label>
                    <Input
                      type="number"
                      step="any"
                      {...form.register(`items.${idx}.quantity`, { valueAsNumber: true })}
                      className="text-xs mt-1 tabular-nums font-bold"
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
              className="gap-1.5 bg-rose-700 hover:bg-rose-800 text-white"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>ثبت حواله خروج</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
