"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  addressFormSchema,
  type AddressFormValues,
} from "@/features/account/schemas/address-schema";
import { useAddressStore } from "@/features/account/stores/address-store";
import type { CustomerAddress } from "@/features/account/types/address";
import { AddressFormFields } from "@/features/account/components/addresses/address-form-fields";

interface AddAddressDialogProps {
  userId?: string;
  onAddressCreated: (address: CustomerAddress) => void;
  trigger?: React.ReactNode;
}

export function AddAddressDialog({
  userId = "u-user-1",
  onAddressCreated,
  trigger,
}: AddAddressDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addAddress = useAddressStore((s) => s.addAddress);

  const defaultValues: AddressFormValues = {
    title: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "ایران",
    province: "تهران",
    city: "تهران",
    address: "",
    plaque: "",
    unit: "",
    postalCode: "",
    isDefaultShipping: true,
    isDefaultBilling: false,
    floor: "",
    hasFreightElevator: false,
    craneAccess: true,
    deliveryType: "forklift",
  };

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: AddressFormValues) => {
    try {
      setIsSubmitting(true);
      const newAddress = addAddress(data, userId);
      toast.success("آدرس جدید با موفقیت اضافه شد", {
        description: `${newAddress.title} — ${newAddress.province}، ${newAddress.city}`,
      });
      onAddressCreated(newAddress);
      setOpen(false);
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("خطا در ثبت آدرس جدید. لطفاً اطلاعات را بررسی کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-dashed border-primary/50 text-primary hover:bg-primary/5 hover:border-primary transition-colors text-xs sm:text-sm h-11"
          >
            <Plus className="h-4 w-4" />
            <span>افزودن آدرس جدید پروژه</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        dir="rtl"
        className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8"
      >
        <DialogHeader className="space-y-1.5 text-start pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
              افزودن آدرس جدید تخلیه بار سنگ
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            مشخصات کامل پروژه ساختمانی، تحویل‌گیرنده و دسترسی‌های کارگاهی (جرثقیل / لیفتراک) را ثبت نمایید.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
          <AddressFormFields form={form} disabled={isSubmitting} />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setOpen(false)}
              className="text-xs sm:text-sm"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 text-xs sm:text-sm shadow-xs min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>در حال ثبت...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>ثبت آدرس و انتخاب</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
