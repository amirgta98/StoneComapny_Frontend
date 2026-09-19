"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowRight,
  Upload,
  X,
  Loader2,
  Info,
  Layers,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Paperclip,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layouts";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  createConversationSchema,
  type CreateConversationValues,
} from "../../schemas/support-schema";
import {
  type SupportCategory,
  type SupportPriority,
  type SupportAttachment,
  SUPPORT_CATEGORY_CONFIG,
} from "../../types/support";
import { supportService } from "../../services/support-service";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS: { key: SupportCategory; label: string; desc: string }[] = [
  {
    key: "ORDER",
    label: "سفارش و بارگیری",
    desc: "پیگیری وضعیت آماده‌سازی، برش و ترابری سفارش",
  },
  {
    key: "PRODUCT",
    label: "محصول و استعلام سنگ",
    desc: "مشخصات کوپ، رگه‌ها، درجه کیفی و ابعاد سفارشی",
  },
  {
    key: "SHIPPING",
    label: "ارسال و باربری",
    desc: "هماهنگی تریلی، جرثقیل تخلیه و زمان‌بندی تحویل سر پروژه",
  },
  {
    key: "PAYMENT",
    label: "پرداخت و فاکتور",
    desc: "صورت‌حساب، شناسه ملی حقوقی و تسویه فاکتور رسمی",
  },
  {
    key: "RETURN",
    label: "مرجوعی و مغایرت",
    desc: "شکستگی سنگ در مسیر یا مغایرت رنگ و سورت کارخانه‌ای",
  },
  {
    key: "ACCOUNT",
    label: "حساب کاربری",
    desc: "تغییر شماره، اطلاعات ثبت‌نامی و مدارک کارفرما",
  },
  {
    key: "TECHNICAL",
    label: "مشکل فنی سایت",
    desc: "خطا در فرآیند استعلام قیمت، درگاه یا سبد خرید",
  },
  {
    key: "OTHER",
    label: "سایر موضوعات",
    desc: "سایر سوالات و درخواست‌های همکاری مستقیم",
  },
];

const PRIORITY_OPTIONS: { key: SupportPriority; label: string; badge: string }[] = [
  { key: "LOW", label: "عادی", badge: "bg-muted text-muted-foreground" },
  { key: "NORMAL", label: "معمولی", badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  { key: "HIGH", label: "مهم و فوری", badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  { key: "URGENT", label: "بحرانی / توقف کارگاه", badge: "bg-rose-500/10 text-rose-700 dark:text-rose-400" },
];

export function NewConversationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialOrderId = searchParams.get("orderId") || "";
  const initialProductId = searchParams.get("productId") || "";

  const [attachments, setAttachments] = useState<SupportAttachment[]>([]);
  const [attachmentPreview, setAttachmentPreview] = useState<{
    url: string;
    isImage: boolean;
    name: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateConversationValues>({
    resolver: zodResolver(createConversationSchema),
    defaultValues: {
      subject: initialOrderId
        ? `پیگیری سفارش #${initialOrderId}`
        : initialProductId
        ? `استعلام درباره محصول ${initialProductId}`
        : "",
      category: initialOrderId ? "ORDER" : initialProductId ? "PRODUCT" : "ORDER",
      priority: "NORMAL",
      initialMessage: "",
      orderId: initialOrderId,
      productId: initialProductId,
      attachments: [],
    },
  });

  const selectedCategory = watch("category");
  const selectedPriority = watch("priority");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از ۵ مگابایت باشد.");
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isDoc =
      file.type === "application/pdf" ||
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".doc") ||
      file.name.endsWith(".docx");

    if (!isImage && !isDoc) {
      toast.error("فرمت مجاز فایل: تصاویر (JPG, PNG, WebP) یا اسناد PDF");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newAttachment: SupportAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        url: dataUrl,
        size: file.size,
        mimeType: file.type,
      };

      setAttachments([newAttachment]);
      setValue("attachments", [newAttachment]);
      setAttachmentPreview({
        url: dataUrl,
        isImage,
        name: file.name,
      });
      toast.success("فایل با موفقیت پیوست شد.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = () => {
    setAttachments([]);
    setValue("attachments", []);
    setAttachmentPreview(null);
  };

  const onSubmit = (values: CreateConversationValues) => {
    startTransition(async () => {
      try {
        const conversation = await supportService.createConversation(values);
        toast.success("درخواست پشتیبانی شما با موفقیت ثبت گردید.");
        router.push(`/account/support/${conversation.id}`);
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "خطایی در ارسال درخواست پشتیبانی رخ داد."
        );
      }
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "حساب کاربری", href: "/account" },
          { label: "پشتیبانی", href: "/account/support" },
          { label: "درخواست جدید" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            ایجاد درخواست پشتیبانی
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            پیام و سوالات خود را با کارشناسان کارخانه مطرح کنید؛ پاسخ‌ها در همین بخش قابل پیگیری است.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
          <Link href="/account/support">
            <ArrowRight className="h-3.5 w-3.5" />
            بازگشت به صندوق پیام‌ها
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Category Selection */}
        <Card className="rounded-2xl border-border/70 bg-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              ۱. دسته‌بندی موضوع درخواست <span className="text-destructive">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setValue("category", cat.key)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border text-start transition-all",
                      isSelected
                        ? "border-primary bg-primary/[0.04] shadow-xs"
                        : "border-border/60 hover:border-border hover:bg-muted/30"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg shrink-0 mt-0.5 transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      <CheckCircle2
                        className={cn(
                          "h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {cat.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {cat.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="text-[11px] text-destructive mt-2">
                {errors.category.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Subject & Priority */}
        <Card className="rounded-2xl border-border/70 bg-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              ۲. عنوان و اولویت درخواست
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-xs font-semibold">
                عنوان گفتگو <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="مثال: هماهنگی زمان‌بندی بارگیری و اعزام تریلی به کارگاه ساختمانی..."
                {...register("subject")}
                className="h-10 text-xs rounded-xl"
              />
              {errors.subject && (
                <p className="text-[11px] text-destructive">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Priority Picker */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">اولویت درخواست</Label>
              <div className="flex flex-wrap gap-2">
                {PRIORITY_OPTIONS.map((p) => {
                  const isSelected = selectedPriority === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setValue("priority", p.key)}
                      className={cn(
                        "rounded-xl px-3 py-1.5 text-xs font-medium border transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Context Linking (Order / Product) */}
            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border/50">
              <div className="space-y-1.5">
                <Label htmlFor="orderId" className="text-xs font-semibold">
                  شماره سفارش مرتبط (اختیاری)
                </Label>
                <Input
                  id="orderId"
                  placeholder="مثال: ORD-1403-9021"
                  {...register("orderId")}
                  className="h-10 text-xs font-mono rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="productId" className="text-xs font-semibold">
                  کد یا نام محصول مرتبط (اختیاری)
                </Label>
                <Input
                  id="productId"
                  placeholder="مثال: اسلب تراورتن سیلور"
                  {...register("productId")}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Message & Attachment */}
        <Card className="rounded-2xl border-border/70 bg-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              ۳. شرح پیام و پیوست فایل
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="initialMessage" className="text-xs font-semibold">
                متن کامل پیام <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="initialMessage"
                rows={5}
                placeholder="لطفاً شرح کامل درخواست، سوال، نیاز به هماهنگی با کارخانه یا مشکل مدنظرتان را بنویسید..."
                {...register("initialMessage")}
                className="text-xs rounded-xl resize-none"
              />
              {errors.initialMessage && (
                <p className="text-[11px] text-destructive">
                  {errors.initialMessage.message}
                </p>
              )}
            </div>

            {/* File Attachment Dropzone / Preview */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                پیوست فایل یا تصویر نمونه سنگ (اختیاری)
              </Label>

              {attachmentPreview ? (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-secondary/30">
                  <div className="flex items-center gap-3">
                    {attachmentPreview.isImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={attachmentPreview.url}
                        alt={attachmentPreview.name}
                        className="h-12 w-12 rounded-lg object-cover border border-border"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">
                        <FileText className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-foreground line-clamp-1">
                        {attachmentPreview.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        فایل با موفقیت ضمیمه شد
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveAttachment}
                    className="h-8 text-xs text-destructive hover:bg-destructive/10 gap-1 rounded-lg"
                  >
                    <X className="h-3.5 w-3.5" />
                    حذف
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/10 p-5 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-foreground">
                    برای پیوست تصویر یا مدرک کلیک کنید
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    فرمت‌های مجاز: JPG, PNG, WEBP, PDF (حداکثر ۵ مگابایت)
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button
            asChild
            type="button"
            variant="outline"
            className="rounded-xl text-xs"
          >
            <Link href="/account/support">انصراف و بازگشت</Link>
          </Button>

          <Button
            type="submit"
            disabled={isPending}
            className="gap-2 rounded-xl text-xs font-semibold px-6 shadow-sm"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            ارسال و ایجاد گفتگوی پشتیبانی
          </Button>
        </div>
      </form>
    </div>
  );
}
