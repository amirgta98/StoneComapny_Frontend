"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  addressFormSchema,
  type AddressFormValues,
} from "../../schemas/address-schema";
import type { CustomerAddress } from "../../types/address";
import { AddressFormFields } from "./address-form-fields";

interface AddressFormProps {
  initialData?: CustomerAddress;
  onSubmit: (values: AddressFormValues) => Promise<boolean | void> | boolean | void;
  title: string;
  submitLabel?: string;
  cancelHref?: string;
}

export function AddressForm({
  initialData,
  onSubmit,
  title,
  submitLabel = "ذخیره آدرس",
  cancelHref = "/account/addresses",
}: AddressFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: AddressFormValues = {
    title: initialData?.title ?? "",
    firstName: initialData?.firstName ?? "",
    lastName: initialData?.lastName ?? "",
    phone: initialData?.phone ?? "",
    country: initialData?.country ?? "ایران",
    province: initialData?.province ?? "تهران",
    city: initialData?.city ?? "تهران",
    address: initialData?.address ?? "",
    plaque: initialData?.plaque ?? "",
    unit: initialData?.unit ?? "",
    postalCode: initialData?.postalCode ?? "",
    isDefaultShipping: initialData?.isDefaultShipping ?? false,
    isDefaultBilling: initialData?.isDefaultBilling ?? false,
    floor: initialData?.floor ?? "",
    hasFreightElevator: initialData?.hasFreightElevator ?? false,
    craneAccess: initialData?.craneAccess ?? false,
    deliveryType: initialData?.deliveryType ?? "curbside",
  };

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues,
  });

  const handleSubmit = async (values: AddressFormValues) => {
    try {
      setIsSubmitting(true);
      const res = await onSubmit(values);
      if (res !== false) {
        toast.success(
          initialData ? "تغییرات آدرس با موفقیت ذخیره شد" : "آدرس جدید با موفقیت اضافه شد"
        );
        router.push(cancelHref);
      }
    } catch (err) {
      console.error(err);
      toast.error("خطا در ذخیره‌سازی اطلاعات آدرس. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      {/* Top Header & Breadcrumb / Back Link */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Link href={cancelHref}>
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">بازگشت به لیست آدرس‌ها</span>
              </Link>
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground ps-10">
            مشخصات کامل تحویل‌گیرنده و محل تخلیه بار سنگ طبیعی را با دقت وارد فرمایید.
          </p>
        </div>

        <div className="flex items-center gap-2 ps-10 sm:ps-0">
          <Button
            asChild
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="border-border text-xs sm:text-sm"
          >
            <Link href={cancelHref}>انصراف</Link>
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2 text-xs sm:text-sm shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{submitLabel}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form Fields Suite */}
      <AddressFormFields form={form} disabled={isSubmitting} />

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
        <Button
          asChild
          type="button"
          variant="outline"
          disabled={isSubmitting}
          className="border-border text-xs sm:text-sm"
        >
          <Link href={cancelHref}>انصراف</Link>
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2 text-xs sm:text-sm shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>در حال ذخیره...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{submitLabel}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
