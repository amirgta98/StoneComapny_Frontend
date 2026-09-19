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
import { createLocationSchema, type CreateLocationInput } from "@/modules/inventory/application/dto/inventory.dto";
import { useCreateLocation, useInventoryLocations } from "../../hooks/use-inventory";
import { Building, Loader2 } from "lucide-react";

interface NewLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewLocationDialog({ open, onOpenChange }: NewLocationDialogProps) {
  const { mutate: createLocation, isPending } = useCreateLocation();
  const { data: locationsData } = useInventoryLocations();
  const locations = locationsData?.locations || [];

  const form = useForm<CreateLocationInput>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: {
      name: "",
      code: "",
      type: "RACK",
      capacitySqm: 1000,
      description: "",
    },
  });

  const onSubmit = (data: CreateLocationInput) => {
    createLocation(data, {
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
            <Building className="h-5 w-5 text-amber-600" />
            تعریف موقعیت و ساختار فیزیکی جدید انبار
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            افزودن سوله، خرک اسلب، پالت تایل یا محوطه روباز دپوی سنگ
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 pt-2">
          <div>
            <Label className="text-xs">نام موقعیت</Label>
            <Input
              {...form.register("name")}
              placeholder="مثال: خرک شماره A06 (اسلب بوک‌مچ)"
              className="text-xs mt-1"
            />
            {form.formState.errors.name && (
              <p className="text-[11px] text-destructive mt-0.5">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">کد شناسه انبار</Label>
              <Input
                {...form.register("code")}
                placeholder="RCK-A06"
                className="text-xs mt-1 uppercase"
              />
              {form.formState.errors.code && (
                <p className="text-[11px] text-destructive mt-0.5">{form.formState.errors.code.message}</p>
              )}
            </div>

            <div>
              <Label className="text-xs">نوع موقعیت</Label>
              <Select
                defaultValue="RACK"
                onValueChange={(val: "WAREHOUSE" | "HALL" | "RACK" | "YARD" | "AREA" | "OTHER") =>
                  form.setValue("type", val)
                }
              >
                <SelectTrigger className="text-xs mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="WAREHOUSE">انبار مرکزی</SelectItem>
                  <SelectItem value="HALL">سوله / سالن</SelectItem>
                  <SelectItem value="RACK">خرک / پالت</SelectItem>
                  <SelectItem value="YARD">محوطه روباز</SelectItem>
                  <SelectItem value="AREA">بخش اختصاصی</SelectItem>
                  <SelectItem value="OTHER">سایر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">موقعیت والد (اختیاری)</Label>
              <Select
                onValueChange={(val) => form.setValue("parentId", val === "none" ? undefined : val)}
              >
                <SelectTrigger className="text-xs mt-1">
                  <SelectValue placeholder="انتخاب والد" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="none">بدون والد (سطح اصلی)</SelectItem>
                  {locations.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">ظرفیت اسمی (متر مربع)</Label>
              <Input
                type="number"
                {...form.register("capacitySqm", { valueAsNumber: true })}
                placeholder="1000"
                className="text-xs mt-1 tabular-nums"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">توضیحات و مشخصات فیزیکی</Label>
            <Textarea
              {...form.register("description")}
              placeholder="مثال: مجهز به جرثقیل سقفی، دسترسی تریلی کفی"
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
              <span>ایجاد موقعیت</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
