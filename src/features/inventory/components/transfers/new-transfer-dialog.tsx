"use client";

import { useForm } from "react-hook-form";
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
import { transferStockSchema, type TransferStockInput } from "@/modules/inventory/application/dto/inventory.dto";
import { useTransferStock, useInventoryItems, useInventoryLocations } from "../../hooks/use-inventory";
import { ArrowLeftRight, Loader2 } from "lucide-react";

interface NewTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTransferDialog({ open, onOpenChange }: NewTransferDialogProps) {
  const { mutate: transferStock, isPending } = useTransferStock();
  const { data: itemsData } = useInventoryItems();
  const { data: locationsData } = useInventoryLocations();

  const inventoryItems = itemsData?.items || [];
  const locations = locationsData?.locations || [];

  const form = useForm<TransferStockInput>({
    resolver: zodResolver(transferStockSchema),
    defaultValues: {
      inventoryItemId: inventoryItems[0]?.id || "inv-1",
      sourceLocationId: locations[0]?.id || "loc-hall-a",
      destinationLocationId: locations[1]?.id || "loc-hall-b",
      quantity: 50,
      reason: "جابجایی پالت به سوله بارگیری",
    },
  });

  const onSubmit = (data: TransferStockInput) => {
    transferStock(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-amber-600" />
            انتقال و جابجایی سنگ بین انبارها
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            جابجایی امن سنگ بین سالن‌ها، خرک‌ها، پالت‌ها یا محوطه با کسر از مبدا و افزودن به مقصد
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 pt-2">
          <div>
            <Label className="text-xs">انتخاب سنگ جهت انتقال</Label>
            <Select
              defaultValue={inventoryItems[0]?.id}
              onValueChange={(val) => {
                const inv = inventoryItems.find((i) => i.id === val);
                form.setValue("inventoryItemId", val);
                if (inv) {
                  form.setValue("sourceLocationId", inv.locationId);
                }
              }}
            >
              <SelectTrigger className="text-xs mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent dir="rtl">
                {inventoryItems.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.productName} ({i.locationName} — آزاد: {i.available} {i.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">موقعیت مبدا (خروج)</Label>
              <Select
                value={form.watch("sourceLocationId")}
                onValueChange={(val) => form.setValue("sourceLocationId", val)}
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
              <Label className="text-xs">موقعیت مقصد (ورود)</Label>
              <Select
                defaultValue={locations[1]?.id}
                onValueChange={(val) => form.setValue("destinationLocationId", val)}
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
          </div>

          <div>
            <Label className="text-xs">متراژ / تعداد مورد انتقال</Label>
            <Input
              type="number"
              step="any"
              {...form.register("quantity", { valueAsNumber: true })}
              className="text-xs mt-1 tabular-nums font-bold"
            />
          </div>

          <div>
            <Label className="text-xs">دلیل انتقال و نام اپراتور</Label>
            <Input
              {...form.register("reason")}
              placeholder="مثال: تکمیل فرآیند ساب یا بارگیری تریلی"
              className="text-xs mt-1"
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
              disabled={isPending}
              className="gap-1.5 bg-amber-700 hover:bg-amber-800 text-white"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>تأیید و اجرای انتقال</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
