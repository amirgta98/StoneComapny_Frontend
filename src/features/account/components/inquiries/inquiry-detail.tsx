"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  Gem,
  Calendar,
  Layers,
  Ruler,
  Phone,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  XCircle,
  FileText,
  BadgeAlert,
  Edit,
  Truck,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layouts";
import { useAuth } from "@/auth";
import {
  INQUIRY_STATUS_CONFIG,
  type CustomerInquiry,
} from "../../types/inquiry";
import { useInquiryStore } from "../../stores/inquiry-store";
import { CancelInquiryModal } from "./cancel-inquiry-modal";

interface InquiryDetailProps {
  id: string;
}

export function InquiryDetail({ id }: InquiryDetailProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { getInquiryById, cancelInquiry } = useInquiryStore();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const inquiry = getInquiryById(id, user?.id || "u-user-1");

  if (!inquiry) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: "حساب کاربری", href: "/account" },
            { label: "استعلام سنگ", href: "/account/inquiries" },
            { label: "یافت نشد" },
          ]}
        />
        <Card className="border border-dashed border-border p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            استعلام مورد نظر یافت نشد
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            ممکن است این استعلام حذف شده باشد یا به حساب کاربری دیگری تعلق داشته باشد.
          </p>
          <div className="mt-6">
            <Button asChild size="sm" className="rounded-xl text-xs">
              <Link href="/account/inquiries">بازگشت به لیست استعلام‌ها</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const statusCfg = INQUIRY_STATUS_CONFIG[inquiry.status];

  const handleConfirmCancel = (inquiryId: string, reason: string) => {
    const success = cancelInquiry(inquiryId, reason, user?.id || "u-user-1");
    if (success) {
      toast.success("استعلام با موفقیت لغو شد");
    } else {
      toast.error("امکان لغو این استعلام در وضعیت فعلی وجود ندارد");
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "حساب کاربری", href: "/account" },
          { label: "استعلام سنگ", href: "/account/inquiries" },
          { label: inquiry.inquiryNumber },
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusCfg.badgeClass}`}
            >
              {statusCfg.label}
            </span>
            <span className="font-mono text-xs text-muted-foreground" dir="ltr">
              #{inquiry.inquiryNumber}
            </span>
          </div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            {inquiry.requestedStoneName}
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <span>ثبت شده در: {new Date(inquiry.createdAt).toLocaleDateString("fa-IR")}</span>
            <span>•</span>
            <span>آخرین به‌روزرسانی: {new Date(inquiry.updatedAt).toLocaleDateString("fa-IR")}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {statusCfg.canCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(true)}
              className="gap-1.5 rounded-xl text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
            >
              <XCircle className="h-4 w-4" />
              لغو استعلام
            </Button>
          )}

          <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-xl text-xs">
            <Link href="/account/inquiries">
              <ArrowRight className="h-4 w-4" />
              بازگشت به لیست
            </Link>
          </Button>
        </div>
      </div>

      {/* Manager Response Section */}
      {inquiry.managerResponse ? (
        <Card className="border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.04] to-card shadow-xs">
          <CardHeader className="pb-3 border-b border-emerald-500/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-sm sm:text-base font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                پیشنهاد تأمین و قیمت‌گذاری فروشگاه
              </CardTitle>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                تاریخ پاسخ: {new Date(inquiry.managerResponse.respondedAt).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Price Breakdown Banner */}
            {(inquiry.managerResponse.estimatedPricePerUnit ||
              inquiry.managerResponse.estimatedTotalPrice) && (
              <div className="grid gap-3 rounded-xl border border-emerald-500/20 bg-background/80 p-4 sm:grid-cols-3">
                {inquiry.managerResponse.estimatedPricePerUnit && (
                  <div>
                    <div className="text-[11px] text-muted-foreground">قیمت تخمینی هر واحد</div>
                    <div className="mt-0.5 text-base font-bold tabular-nums text-foreground">
                      {inquiry.managerResponse.estimatedPricePerUnit.toLocaleString("fa-IR")}{" "}
                      <span className="text-xs font-normal text-muted-foreground">تومان / {inquiry.unit}</span>
                    </div>
                  </div>
                )}

                {inquiry.managerResponse.estimatedTotalPrice && (
                  <div>
                    <div className="text-[11px] text-muted-foreground">مبلغ تخمینی کل سفارش</div>
                    <div className="mt-0.5 text-base font-bold tabular-nums text-primary">
                      {inquiry.managerResponse.estimatedTotalPrice.toLocaleString("fa-IR")}{" "}
                      <span className="text-xs font-normal text-muted-foreground">تومان</span>
                    </div>
                  </div>
                )}

                {inquiry.managerResponse.estimatedPrepDays && (
                  <div>
                    <div className="text-[11px] text-muted-foreground">مدت زمان آماده‌سازی</div>
                    <div className="mt-0.5 text-sm font-semibold text-foreground">
                      {inquiry.managerResponse.estimatedPrepDays}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Response Description */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-foreground">توضیحات کارشناس فروش:</div>
              <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line bg-card p-3 rounded-xl border border-border/60">
                {inquiry.managerResponse.responseText}
              </p>
            </div>

            {/* Delivery Terms */}
            {inquiry.managerResponse.deliveryTerms && (
              <div className="flex items-start gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                <Truck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">شرایط بارگیری و ترابری: </span>
                  <span>{inquiry.managerResponse.deliveryTerms}</span>
                </div>
              </div>
            )}

            {inquiry.managerResponse.managerNotes && (
              <p className="text-[11px] text-muted-foreground italic">
                نکته: {inquiry.managerResponse.managerNotes}
              </p>
            )}
          </CardContent>
        </Card>
      ) : inquiry.status === "CANCELLED" ? (
        <Card className="border border-muted bg-muted/20">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="h-5 w-5 text-muted-foreground" />
            <div className="text-xs">
              <span className="font-semibold text-foreground">این استعلام لغو گردیده است. </span>
              {inquiry.cancellationReason && (
                <span className="text-muted-foreground">علت: {inquiry.cancellationReason}</span>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-amber-500/20 bg-amber-500/[0.04]">
          <CardContent className="p-4 flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-foreground">
                درخواست شما در نوبت کارشناسی و استعلام معدن قرار دارد
              </div>
              <p className="text-muted-foreground leading-relaxed">
                کارشناسان تأمین متریال در حال بررسی موجودی کوپ خام در معادن همکار و برآورد هزینه خط برش هستند. به محض آماده شدن پیشنهاد قیمت، جزئیات در همین برگه درج و پیامک آن برای شما ارسال خواهد شد.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main 2 Columns: Specifications & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Specifications Table */}
          <Card className="border border-border/80 bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                <Gem className="h-4 w-4 text-primary" />
                مشخصات فنی و مقادیر درخواستی
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
                <div className="space-y-1">
                  <span className="text-muted-foreground">نوع سنگ</span>
                  <p className="font-semibold text-foreground">{inquiry.stoneType}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground">طیف رنگ</span>
                  <p className="font-semibold text-foreground">{inquiry.stoneColor}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground">فرم محصول</span>
                  <p className="font-semibold text-foreground">{inquiry.productFormat}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground">مقدار مورد نیاز</span>
                  <p className="font-semibold text-primary">
                    {inquiry.quantity.toLocaleString("fa-IR")} {inquiry.unit}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground">ابعاد مورد نظر</span>
                  <p className="font-semibold text-foreground">
                    {inquiry.dimensions || "استاندارد کارخانه"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground">ضخامت</span>
                  <p className="font-semibold text-foreground">
                    {inquiry.thickness || "استاندارد"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground">سورت و درجه کیفی</span>
                  <p className="font-semibold text-foreground">
                    {inquiry.grade || "تعیین نشده"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground">خاستگاه یا معدن</span>
                  <p className="font-semibold text-foreground">
                    {inquiry.quarryOrigin || "پیشنهاد کارخانه"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground">محل کاربرد</span>
                  <p className="font-semibold text-foreground">{inquiry.application}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="border border-border/80 bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                توضیحات تکمیلی و الزامات پروژه
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
                {inquiry.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Side Column: Reference Image & Contact */}
        <div className="space-y-6">
          {/* Reference Image Card */}
          <Card className="border border-border/80 bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-xs font-bold text-foreground">
                تصویر نمونه سنگ ارسالی
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {inquiry.referenceImage ? (
                <div className="overflow-hidden rounded-xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={inquiry.referenceImage}
                    alt={inquiry.requestedStoneName}
                    className="h-48 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-36 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-muted/20 text-center text-xs text-muted-foreground">
                  <Gem className="h-8 w-8 text-muted-foreground/40" />
                  <span>تصویری برای این استعلام پیوست نشده است.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card className="border border-border/80 bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-xs font-bold text-foreground">
                اطلاعات متقاضی استعلام
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  نام متقاضی:
                </span>
                <span className="font-semibold text-foreground">
                  {inquiry.contactName || user?.name || "مشتری گرامی"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  شماره موبایل:
                </span>
                <span className="font-mono text-foreground" dir="ltr">
                  {inquiry.contactPhone}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <CancelInquiryModal
        inquiry={inquiry}
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
}
