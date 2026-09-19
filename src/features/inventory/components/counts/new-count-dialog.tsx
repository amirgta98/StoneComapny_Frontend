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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createStockCountSchema, type CreateStockCountInput } from "@/modules/inventory/application/dto/inventory.dto";
import { useCreateStockCount, useInventoryLocations } from "../../hooks/use-inventory";
import { ClipboardCheck, Loader2 } from "lucide-react";

interface NewCountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewCountDialog({ open, onOpenChange }: NewCountDialogProps) {
  const { mutate: createStockCount, isPending } = useCreateStockCount();
  const { data: locationsData } = useInventoryLocations();
  const locations = locationsData?.locations || [];

  const form = useForm<CreateStockCountInput>({
    resolver: zodResolver(createStockCountSchema),
    defaultValues: {
      title: "انبارگردانی دوره‌ای سنگ و اسلب",
      locationId: locations[0]?.id || "loc-hall-b",
      notes: "شمارش فیزیکی توسط هیات انبارگردانی",
    },
  });

  const onSubmit = (data: CreateStockCountInput) => {
    createStockCount(data, {
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
            <ClipboardCheck className="h-5 w-5 text-amber-600" />
            شروع دوره انبارگردانی فیزیکی جدید
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            ایجاد برگه شمارش فیزیکی برای یک سوله یا موقعیت مشخص جهت مقایسه با موجودی سیستمی
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 pt-2">
          <div>
            <Label className="text-xs">عنوان انبارگردانی</Label>
            <Input
              {...form.register("title")}
              placeholder="مثال: انبارگردانی پایان فصل سوله B"
              className="text-xs mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">انتخاب موقعیت یا سوله هدف</Label>
            <Select
              defaultValue={locations[0]?.id || "loc-hall-b"}
              onValueChange={(val) => form.setValue("locationId", val)}
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
            <Label className="text-xs">توضیحات و اسامی اعضای هیات شمارش</Label>
            <Textarea
              {...form.register("notes")}
              placeholder="مثال: شمارش با حضور ناظر مالی و انباردار ارشد"
              className="text-xs mt-1 resize-none h-20"
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
              <span>شروع انبارگردانی</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
