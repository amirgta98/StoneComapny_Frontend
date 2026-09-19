"use client";

import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  MapPin,
  User,
  Phone,
  Building,
  Hash,
  Truck,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { AddressFormValues } from "../../schemas/address-schema";
import { IRAN_PROVINCES } from "../../constants/iran-locations";

interface AddressFormFieldsProps {
  form: UseFormReturn<AddressFormValues>;
  disabled?: boolean;
}

export function AddressFormFields({ form, disabled }: AddressFormFieldsProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const selectedProvince = watch("province");

  // Cities matching selected province
  const availableCities = useMemo(() => {
    if (!selectedProvince) return [];
    const found = IRAN_PROVINCES.find((p) => p.name === selectedProvince);
    return found ? found.cities : [];
  }, [selectedProvince]);

  const handleProvinceChange = (provinceName: string) => {
    setValue("province", provinceName, { shouldValidate: true });
    // Reset city if not belonging to new province
    const target = IRAN_PROVINCES.find((p) => p.name === provinceName);
    if (target && target.cities.length > 0) {
      setValue("city", target.cities[0], { shouldValidate: true });
    } else {
      setValue("city", "", { shouldValidate: true });
    }
  };

  const isDefaultShipping = watch("isDefaultShipping");
  const isDefaultBilling = watch("isDefaultBilling");
  const hasFreightElevator = watch("hasFreightElevator");
  const craneAccess = watch("craneAccess");
  const deliveryType = watch("deliveryType");

  return (
    <div className="space-y-8">
      {/* 1. Address Nickname / Label */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <MapPin className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">عنوان آدرس</h3>
        </div>

        <div>
          <Label htmlFor="title" className="text-xs text-foreground font-medium">
            عنوان آدرس <span className="text-destructive">*</span>
          </Label>
          <p className="mb-2 text-[11px] text-muted-foreground">
            یک نام شاخص برای شناسایی آسان این آدرس در سفارش‌های بعدی انتخاب کنید.
          </p>
          <Input
            id="title"
            placeholder="مثال: منزل، دفتر مرکزی، پروژه برج باغ لواسان، کارگاه ساختمانی..."
            {...register("title")}
            disabled={disabled}
            className={cn(
              "border-border bg-background text-sm",
              errors.title && "border-destructive focus-visible:ring-destructive/30"
            )}
          />
          {errors.title && (
            <p className="mt-1.5 text-xs text-destructive font-medium">
              {errors.title.message}
            </p>
          )}
        </div>
      </section>

      {/* 2. Recipient Information */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <User className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">اطلاعات تحویل‌گیرنده</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName" className="text-xs text-foreground font-medium">
              نام <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              placeholder="مثال: امیر"
              {...register("firstName")}
              disabled={disabled}
              className={cn(
                "mt-1.5 border-border bg-background text-sm",
                errors.firstName && "border-destructive focus-visible:ring-destructive/30"
              )}
            />
            {errors.firstName && (
              <p className="mt-1.5 text-xs text-destructive font-medium">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName" className="text-xs text-foreground font-medium">
              نام خانوادگی <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              placeholder="مثال: احمدی"
              {...register("lastName")}
              disabled={disabled}
              className={cn(
                "mt-1.5 border-border bg-background text-sm",
                errors.lastName && "border-destructive focus-visible:ring-destructive/30"
              )}
            />
            {errors.lastName && (
              <p className="mt-1.5 text-xs text-destructive font-medium">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="sm:col-span-2">
            <Label htmlFor="phone" className="text-xs text-foreground font-medium">
              شماره موبایل / تماس تحویل‌گیرنده <span className="text-destructive">*</span>
            </Label>
            <p className="mb-1.5 text-[11px] text-muted-foreground">
              جهت هماهنگی ورود خودروی باربری و ترابری سنگ با سرپرست کارگاه یا تحویل‌گیرنده.
            </p>
            <div className="relative">
              <Phone className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="phone"
                dir="ltr"
                placeholder="09123456789"
                {...register("phone")}
                disabled={disabled}
                className={cn(
                  "ps-9 font-mono border-border bg-background text-sm text-start",
                  errors.phone && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-xs text-destructive font-medium">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. Location (Country, Province, City) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <Building className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">موقعیت جغرافیایی</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Country */}
          <div>
            <Label htmlFor="country" className="text-xs text-foreground font-medium">
              کشور
            </Label>
            <Input
              id="country"
              value="ایران"
              disabled
              className="mt-1.5 border-border bg-secondary/50 text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>

          {/* Province */}
          <div>
            <Label htmlFor="province" className="text-xs text-foreground font-medium">
              استان <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedProvince || ""}
              onValueChange={handleProvinceChange}
              disabled={disabled}
            >
              <SelectTrigger
                id="province"
                className={cn(
                  "mt-1.5 border-border bg-background text-sm",
                  errors.province && "border-destructive focus:ring-destructive/30"
                )}
              >
                <SelectValue placeholder="انتخاب استان..." />
              </SelectTrigger>
              <SelectContent className="max-h-60 border-border bg-card">
                {IRAN_PROVINCES.map((prov) => (
                  <SelectItem key={prov.name} value={prov.name} className="text-xs sm:text-sm">
                    {prov.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.province && (
              <p className="mt-1.5 text-xs text-destructive font-medium">
                {errors.province.message}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <Label htmlFor="city" className="text-xs text-foreground font-medium">
              شهر <span className="text-destructive">*</span>
            </Label>
            {availableCities.length > 0 ? (
              <Select
                value={watch("city") || ""}
                onValueChange={(val) => setValue("city", val, { shouldValidate: true })}
                disabled={disabled}
              >
                <SelectTrigger
                  id="city"
                  className={cn(
                    "mt-1.5 border-border bg-background text-sm",
                    errors.city && "border-destructive focus:ring-destructive/30"
                  )}
                >
                  <SelectValue placeholder="انتخاب شهر..." />
                </SelectTrigger>
                <SelectContent className="max-h-60 border-border bg-card">
                  {availableCities.map((cityName) => (
                    <SelectItem key={cityName} value={cityName} className="text-xs sm:text-sm">
                      {cityName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="city"
                placeholder="ابتدا استان را انتخاب کنید یا نام شهر را بنویسید"
                {...register("city")}
                disabled={disabled}
                className={cn(
                  "mt-1.5 border-border bg-background text-sm",
                  errors.city && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
            )}
            {errors.city && (
              <p className="mt-1.5 text-xs text-destructive font-medium">
                {errors.city.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 4. Full Address & Postal Code */}
      <section className="space-y-4">
        <div>
          <Label htmlFor="address" className="text-xs text-foreground font-medium">
            آدرس کامل پستی <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="address"
            rows={3}
            placeholder="خیابان اصلی، بلوار، کوچه، گذر، پلاک یا مشخصات محل پروژه ساختمانی..."
            {...register("address")}
            disabled={disabled}
            className={cn(
              "mt-1.5 border-border bg-background text-sm leading-relaxed",
              errors.address && "border-destructive focus-visible:ring-destructive/30"
            )}
          />
          {errors.address && (
            <p className="mt-1.5 text-xs text-destructive font-medium">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Plaque */}
          <div>
            <Label htmlFor="plaque" className="text-xs text-foreground font-medium">
              پلاک <span className="text-destructive">*</span>
            </Label>
            <Input
              id="plaque"
              placeholder="مثال: ۱۲"
              {...register("plaque")}
              disabled={disabled}
              className={cn(
                "mt-1.5 border-border bg-background text-sm",
                errors.plaque && "border-destructive focus-visible:ring-destructive/30"
              )}
            />
            {errors.plaque && (
              <p className="mt-1.5 text-xs text-destructive font-medium">
                {errors.plaque.message}
              </p>
            )}
          </div>

          {/* Unit */}
          <div>
            <Label htmlFor="unit" className="text-xs text-foreground font-medium">
              واحد <span className="text-muted-foreground font-normal">(اختیاری)</span>
            </Label>
            <Input
              id="unit"
              placeholder="مثال: ۴"
              {...register("unit")}
              disabled={disabled}
              className="mt-1.5 border-border bg-background text-sm"
            />
          </div>

          {/* Postal Code */}
          <div>
            <Label htmlFor="postalCode" className="text-xs text-foreground font-medium">
              کد پستی ۱۰ رقمی <span className="text-destructive">*</span>
            </Label>
            <div className="relative mt-1.5">
              <Hash className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="postalCode"
                dir="ltr"
                maxLength={10}
                placeholder="1234567890"
                {...register("postalCode")}
                disabled={disabled}
                className={cn(
                  "ps-9 font-mono border-border bg-background text-sm text-start",
                  errors.postalCode && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
            </div>
            {errors.postalCode && (
              <p className="mt-1.5 text-xs text-destructive font-medium">
                {errors.postalCode.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 5. Stone Logistics & Delivery Conditions (Domain Feature) */}
      <section className="space-y-4 rounded-2xl border border-border/80 bg-secondary/20 p-4 sm:p-5">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <Truck className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            تجهیزات و شرایط تخلیه بار سنگ در محل پروژه
          </h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          به دلیل وزن بالای پالت‌ها و اسلب‌های سنگ طبیعی، اطلاعات دقیق تخلیه از خسارت احتمالی جلوگیری می‌کند.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Floor */}
          <div>
            <Label htmlFor="floor" className="text-xs text-foreground font-medium">
              طبقه محل تحویل سنگ
            </Label>
            <Input
              id="floor"
              placeholder="مثال: همکف، طبقه ۲، لابی..."
              {...register("floor")}
              disabled={disabled}
              className="mt-1.5 border-border bg-background text-sm"
            />
          </div>

          {/* Delivery Access Type */}
          <div>
            <Label htmlFor="deliveryType" className="text-xs text-foreground font-medium">
              روش و امکان تخلیه در محل
            </Label>
            <Select
              value={deliveryType || "curbside"}
              onValueChange={(val: "curbside" | "crane" | "forklift") =>
                setValue("deliveryType", val)
              }
              disabled={disabled}
            >
              <SelectTrigger id="deliveryType" className="mt-1.5 border-border bg-background text-sm">
                <SelectValue placeholder="انتخاب روش تخلیه..." />
              </SelectTrigger>
              <SelectContent className="border-border bg-card">
                <SelectItem value="curbside" className="text-xs sm:text-sm">
                  تحویل پیاده‌رو (کنار خودروی حمل)
                </SelectItem>
                <SelectItem value="crane" className="text-xs sm:text-sm">
                  تخلیه با جرثقیل در محوطه کارگاه
                </SelectItem>
                <SelectItem value="forklift" className="text-xs sm:text-sm">
                  تخلیه با لیفتراک سوله یا انبار
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-6">
          {/* Freight Elevator Checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={hasFreightElevator}
              onChange={(e) => setValue("hasFreightElevator", e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-border accent-primary focus:ring-primary"
            />
            <span className="text-xs text-foreground">
              پروژه دارای آسانسور باربری استاندارد است
            </span>
          </label>

          {/* Crane Access Checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={craneAccess}
              onChange={(e) => setValue("craneAccess", e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-border accent-primary focus:ring-primary"
            />
            <span className="text-xs text-foreground">
              امکان استقرار جرثقیل و تریلی سنگبری در محل وجود دارد
            </span>
          </label>
        </div>
      </section>

      {/* 6. Default Address Options (Specification §5) */}
      <section className="space-y-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">تنظیمات پیش‌فرض آدرس</h3>
        </div>

        <div className="space-y-3.5">
          {/* Default Shipping */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefaultShipping}
              onChange={(e) => setValue("isDefaultShipping", e.target.checked)}
              disabled={disabled}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary focus:ring-primary"
            />
            <div className="space-y-0.5">
              <span className="text-xs sm:text-sm font-medium text-foreground">
                تنظیم به عنوان آدرس پیش‌فرض ارسال
              </span>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                در صورت فعال‌سازی، در خریدهای بعدی این آدرس به عنوان مقصد اصلی حمل سنگ انتخاب خواهد شد.
              </p>
            </div>
          </label>

          {/* Default Billing */}
          <label className="flex items-start gap-3 cursor-pointer border-t border-border/50 pt-3">
            <input
              type="checkbox"
              checked={isDefaultBilling}
              onChange={(e) => setValue("isDefaultBilling", e.target.checked)}
              disabled={disabled}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary focus:ring-primary"
            />
            <div className="space-y-0.5">
              <span className="text-xs sm:text-sm font-medium text-foreground">
                تنظیم به عنوان آدرس پیش‌فرض صورت‌حساب
              </span>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                پیش‌فاکتورها و مدارک مالیاتی رسمی شرکت سنگ به این آدرس صادر خواهند شد.
              </p>
            </div>
          </label>
        </div>
      </section>
    </div>
  );
}
