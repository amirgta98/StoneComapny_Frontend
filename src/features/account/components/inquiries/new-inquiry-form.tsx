"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowRight,
  Upload,
  X,
  Gem,
  Layers,
  Ruler,
  Info,
  Phone,
  User,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Breadcrumbs } from "@/components/layouts";
import { useAuth } from "@/auth";
import {
  inquiryFormSchema,
  type InquiryFormValues,
} from "../../schemas/inquiry-schema";
import { useInquiryStore } from "../../stores/inquiry-store";

const STONE_TYPE_OPTIONS = [
  "تراورتن",
  "مرمریت",
  "گرانیت",
  "مرمر (آنیکس)",
  "چینی و کریستال",
  "لایم‌استون",
  "بازالت",
  "سنداستون",
  "کوارتزیت",
  "سایر سنگ‌های طبیعی",
];

const STONE_COLOR_OPTIONS = [
  "سفید",
  "کرم روشن",
  "بژ و شکلاتی",
  "طوسی و دودی",
  "مشکی",
  "طلایی و زرد",
  "سبز",
  "قرمز و صورتی",
  "الوان و رگه‌دار خاص",
];

const APPLICATION_OPTIONS = [
  "نمای خارجی و اصلی ساختمان",
  "کف‌پوش لابی و فضاهای مجلل",
  "کف فرش سالن و مشاعات",
  "سنگ پله و پاگرد",
  "دیوار دکوراتیو و Feature Wall",
  "کانترتاپ، جزیره و میز آشپزخانه",
  "سرویس بهداشتی و حمام مستر",
  "محوطه و سنگ‌فرش فضای باز",
  "صراحی، شومینه و المان‌های حجمی",
  "سایر کاربردهای معماری",
];

const FORMAT_OPTIONS = [
  "اسلب بوک‌مچ / فورمچ",
  "اسلب ساده",
  "تایل ۴۰ طولی",
  "تایل مربعی (۶۰×۶۰ یا ۸۰×۸۰)",
  "تایل ابعاد سفارشی کالیبره",
  "کوپ سنگ خام",
  "پله و زیرپله ابزاردار",
  "سایر",
];

const UNIT_OPTIONS = [
  "متر مربع",
  "عدد",
  "تن",
  "پالت",
  "متر طول",
  "کوپ (قواره)",
];

const GRADE_OPTIONS = [
  "سوپر صادراتی",
  "ممتاز درجه ۱",
  "درجه ۱ استاندارد",
  "صادراتی خاص (VIP)",
];

export function NewInquiryForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { createInquiry } = useInquiryStore();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultPhone = user?.phone || "09120000004";
  const defaultName = user?.name || "مشتری گرامی";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      requestedStoneName: "",
      stoneType: "تراورتن",
      stoneColor: "کرم روشن",
      application: "نمای خارجی و اصلی ساختمان",
      productFormat: "اسلب بوک‌مچ / فورمچ",
      quantity: 100,
      unit: "متر مربع",
      dimensions: "",
      thickness: "۲ سانتی‌متر",
      grade: "سوپر صادراتی",
      quarryOrigin: "",
      description: "",
      referenceImage: null,
      contactName: defaultName,
      contactPhone: defaultPhone,
    },
  });

  const selectedStoneType = watch("stoneType");
  const selectedStoneColor = watch("stoneColor");
  const selectedApplication = watch("application");
  const selectedFormat = watch("productFormat");
  const selectedUnit = watch("unit");
  const selectedGrade = watch("grade");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("فایل انتخابی باید از نوع تصویر (JPG, PNG, WebP) باشد.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم تصویر نباید بیشتر از ۵ مگابایت باشد.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setValue("referenceImage", result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("referenceImage", null);
  };

  const onSubmit = async (values: InquiryFormValues) => {
    setIsSubmitting(true);
    try {
      const created = createInquiry(values, user?.id || "u-user-1");
      toast.success("درخواست استعلام سنگ با موفقیت ثبت شد", {
        description: `شماره پیگیری: ${created.inquiryNumber} — نتیجه پس از کارشناسی اعلام خواهد شد.`,
      });
      router.push(`/account/inquiries/${created.id}`);
    } catch {
      toast.error("خطا در ثبت استعلام. لطفاً مجدداً تلاش فرمایید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "حساب کاربری", href: "/account" },
          { label: "استعلام سنگ", href: "/account/inquiries" },
          { label: "ثبت استعلام جدید" },
        ]}
      />

      {/* Back button and page title */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            ثبت استعلام سنگ ناموجود
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm leading-relaxed">
            سنگ یا متریال موردنظر خود را که در سایت موجود نیست، همراه با مشخصات و متراژ برای ما ارسال کنید.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-xl text-xs">
          <Link href="/account/inquiries">
            <ArrowRight className="h-4 w-4" />
            بازگشت به لیست
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Stone Specifications */}
        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
              <Gem className="h-4 w-4 text-primary" />
              ۱. مشخصات و هویت سنگ درخواستی
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Stone Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="requestedStoneName" className="text-xs font-semibold">
                  نام یا عنوان سنگ درخواستی <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="requestedStoneName"
                  placeholder="مثال: سنگ تراورتن سیلور کاشان موج کبریتی یا گرانیت سبز جنگلی بیرجند"
                  {...register("requestedStoneName")}
                  className="h-10 text-xs rounded-xl"
                />
                {errors.requestedStoneName && (
                  <p className="text-[11px] text-destructive">
                    {errors.requestedStoneName.message}
                  </p>
                )}
              </div>

              {/* Stone Type */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  نوع سنگ <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedStoneType}
                  onValueChange={(val) => setValue("stoneType", val)}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="انتخاب نوع سنگ" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    {STONE_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stone Color */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  طیف رنگی <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedStoneColor}
                  onValueChange={(val) => setValue("stoneColor", val)}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="انتخاب طیف رنگی" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    {STONE_COLOR_OPTIONS.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product Format */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  فرم و نوع محصول <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedFormat}
                  onValueChange={(val) => setValue("productFormat", val)}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="انتخاب فرم سنگ" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    {FORMAT_OPTIONS.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Application */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  محل و کاربرد نصب <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedApplication}
                  onValueChange={(val) => setValue("application", val)}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="انتخاب کاربرد سنگ" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    {APPLICATION_OPTIONS.map((app) => (
                      <SelectItem key={app} value={app}>
                        {app}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Quantity & Technical Sizing */}
        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              ۲. مقدار، ابعاد و درجه کیفی
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Quantity */}
              <div className="space-y-1.5">
                <Label htmlFor="quantity" className="text-xs font-semibold">
                  مقدار مورد نیاز <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="مثال: ۲۵۰"
                  {...register("quantity", { valueAsNumber: true })}
                  className="h-10 text-xs rounded-xl"
                />
                {errors.quantity && (
                  <p className="text-[11px] text-destructive">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              {/* Unit */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  واحد اندازه‌گیری <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedUnit}
                  onValueChange={(val) => setValue("unit", val)}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="انتخاب واحد" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    {UNIT_OPTIONS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quality Grade */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">درجه و سورت کیفی</Label>
                <Select
                  value={selectedGrade}
                  onValueChange={(val) => setValue("grade", val)}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="انتخاب سورت" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    {GRADE_OPTIONS.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dimensions */}
              <div className="space-y-1.5">
                <Label htmlFor="dimensions" className="text-xs font-semibold">
                  ابعاد مورد نظر
                </Label>
                <Input
                  id="dimensions"
                  placeholder="مثال: ۲۸۰ × ۱۶۰ سانتی‌متر یا ۴۰ طولی"
                  {...register("dimensions")}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Thickness */}
              <div className="space-y-1.5">
                <Label htmlFor="thickness" className="text-xs font-semibold">
                  ضخامت درخواستی
                </Label>
                <Input
                  id="thickness"
                  placeholder="مثال: ۲ سانتی‌متر کالیبره یا ۳ سانتی‌متر"
                  {...register("thickness")}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Quarry Origin */}
              <div className="space-y-1.5">
                <Label htmlFor="quarryOrigin" className="text-xs font-semibold">
                  معدن یا خاستگاه مدنظر
                </Label>
                <Input
                  id="quarryOrigin"
                  placeholder="مثال: معادن تکاب، دهبید، نطنز، کاشان..."
                  {...register("quarryOrigin")}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Reference Image Upload */}
        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              ۳. تصویر یا نمونه سنگ مورد نظر (اختیاری)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {imagePreview ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-border p-4 bg-muted/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="نمونه سنگ بارگذاری‌شده"
                  className="h-28 w-28 rounded-xl object-cover border border-border shadow-xs"
                />
                <div className="space-y-1 text-center sm:text-start">
                  <p className="text-xs font-semibold text-foreground">
                    تصویر نمونه سنگ با موفقیت پیوست شد
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    کارشناسان فروش با تطبیق دقیق رگه و رنگ این تصویر، سنگ مشابه را جستجو خواهند کرد.
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 mt-1"
                  >
                    <X className="h-3.5 w-3.5" />
                    حذف تصویر
                  </Button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="mt-3 text-xs font-semibold text-foreground">
                  برای بارگذاری تصویر نمونه سنگ کلیک کنید یا فایل را بکشید
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  فرمت‌های مجاز: JPG, PNG, WEBP (حداکثر ۵ مگابایت)
                </p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </CardContent>
        </Card>

        {/* Section 4: Details and Notes */}
        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              ۴. توضیحات و الزامات پروژه
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                توضیحات تکمیلی <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="لطفاً جزئیات مربوط به فرآوری (ساب صیقلی، مات، چرمی یا فلیم)، یکدستی سورت، نوع بسته‌بندی پالت یا شرایط خاص کارگاه ساختمانی خود را شرح دهید..."
                {...register("description")}
                className="text-xs rounded-xl resize-none"
              />
              {errors.description && (
                <p className="text-[11px] text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Contact Information */}
        <Card className="border border-border/80 bg-card">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              ۵. اطلاعات تماس جهت اعلام نتیجه استعلام
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contactName" className="text-xs font-semibold">
                  نام و نام خانوادگی
                </Label>
                <Input
                  id="contactName"
                  {...register("contactName")}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contactPhone" className="text-xs font-semibold">
                  شماره موبایل جهت هماهنگی و پیامک <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactPhone"
                  dir="ltr"
                  {...register("contactPhone")}
                  className="h-10 text-xs font-mono rounded-xl text-end"
                />
                {errors.contactPhone && (
                  <p className="text-[11px] text-destructive">
                    {errors.contactPhone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-secondary/40 p-3 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                کارشناسان فنی ما پس از استعلام موجودی کوپ از معدن و ارزیابی خط تولید کارخانه، پیشنهاد قیمت نهایی و زمان آماده‌سازی را در پنل کاربری شما ثبت و از طریق پیامک اطلاع‌رسانی خواهند کرد.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button
            asChild
            type="button"
            variant="outline"
            className="rounded-xl text-xs"
          >
            <Link href="/account/inquiries">انصراف و بازگشت</Link>
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2 rounded-xl text-xs font-semibold"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            ارسال و ثبت استعلام سنگ
          </Button>
        </div>
      </form>
    </div>
  );
}
