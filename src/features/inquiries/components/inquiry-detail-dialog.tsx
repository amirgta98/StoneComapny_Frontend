"use client";

import {
  Building2,
  Calendar,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Tag,
  User,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Printer,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { FactoryInquiryItem } from "../types";

interface InquiryDetailDialogProps {
  inquiry: FactoryInquiryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenQuote: (inquiry: FactoryInquiryItem) => void;
  onOpenPrint: (inquiry: FactoryInquiryItem) => void;
  onAccept: (inquiry: FactoryInquiryItem) => void;
  onReject: (inquiry: FactoryInquiryItem) => void;
}

export function InquiryDetailDialog({
  inquiry,
  open,
  onOpenChange,
  onOpenQuote,
  onOpenPrint,
  onAccept,
  onReject,
}: InquiryDetailDialogProps) {
  if (!inquiry) return null;

  const isQuoted = inquiry.status === "quoted" && inquiry.quotation;
  const isPending = inquiry.status === "pending";
  const isApproved = inquiry.status === "approved";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border/80 bg-card text-card-foreground shadow-2xl"
        dir="rtl"
      >
        {/* Header with gradient badge */}
        <div className="relative border-b border-border/70 bg-gradient-to-r from-secondary/60 via-card to-amber-950/10 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  {inquiry.rfqNumber}
                </span>
                {inquiry.urgency === "high" && (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1 text-[11px]"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    استعلام فوری و ویژه
                  </Badge>
                )}
                {inquiry.status === "pending" && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-400/30">
                    در انتظار قیمت‌گذاری کارخانه
                  </Badge>
                )}
                {inquiry.status === "quoted" && (
                  <Badge variant="outline" className="bg-sky-500/15 text-sky-700 border-sky-500/30">
                    پیش‌فاکتور صادر شده
                  </Badge>
                )}
                {inquiry.status === "approved" && (
                  <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">
                    تأیید شده / تبدیل به قرارداد
                  </Badge>
                )}
                {inquiry.status === "rejected" && (
                  <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/30">
                    رد شده / بایگانی
                  </Badge>
                )}
              </div>

              <DialogTitle className="text-xl font-bold text-foreground">
                {inquiry.stoneTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                ثبت شده در {inquiry.createdAt} • جهت پروژه {inquiry.projectName}
              </DialogDescription>
            </div>

            {/* Quick header action */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              {isQuoted && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={() => onOpenPrint(inquiry)}
                >
                  <Printer className="h-3.5 w-3.5" />
                  چاپ پیش‌فاکتور
                </Button>
              )}
              {isPending && (
                <Button
                  size="sm"
                  className="gap-1.5 text-xs bg-primary text-primary-foreground hover:brightness-105"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenQuote(inquiry);
                  }}
                >
                  <Send className="h-3.5 w-3.5" />
                  صدور مظنه قیمت
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6">
          {/* Customer & Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary" />
                مشخصات متقاضی استعلام
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">نام متقاضی:</span>
                  <span className="font-semibold text-foreground">{inquiry.customerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">نقش / جایگاه:</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {inquiry.customerRole}
                  </Badge>
                </div>
                {inquiry.customerCompany && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">شرکت / دفتر معماری:</span>
                    <span className="text-foreground">{inquiry.customerCompany}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">شماره تماس:</span>
                  <a
                    href={`tel:${inquiry.customerPhone}`}
                    className="font-mono text-primary hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    {inquiry.customerPhone}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-primary" />
                مشخصات پروژه و تحویل
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">نام پروژه:</span>
                  <span className="font-semibold text-foreground">{inquiry.projectName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">شهر مقصد:</span>
                  <span className="inline-flex items-center gap-1 text-foreground">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {inquiry.projectCity}
                  </span>
                </div>
                {inquiry.projectStage && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">مرحله ساخت:</span>
                    <span className="text-foreground">{inquiry.projectStage}</span>
                  </div>
                )}
                {inquiry.targetDeliveryDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">مهلت درخواستی تحویل:</span>
                    <span className="font-mono text-foreground">{inquiry.targetDeliveryDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Technical Specs of Stone */}
          <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-primary" />
              مشخصات فنی و متراژ درخواستی سنگ
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-lg bg-secondary/40 p-2.5">
                <span className="text-[11px] text-muted-foreground block">دسته‌بندی سنگ</span>
                <span className="font-bold text-foreground mt-0.5 block">{inquiry.stoneType}</span>
              </div>
              <div className="rounded-lg bg-secondary/40 p-2.5">
                <span className="text-[11px] text-muted-foreground block">قواره و فرم</span>
                <span className="font-bold text-foreground mt-0.5 block">{inquiry.form}</span>
              </div>
              <div className="rounded-lg bg-primary/10 p-2.5 border border-primary/20">
                <span className="text-[11px] text-primary block font-medium">حجم / متراژ</span>
                <span className="font-bold text-foreground text-sm mt-0.5 block">{inquiry.volume}</span>
              </div>
              <div className="rounded-lg bg-secondary/40 p-2.5">
                <span className="text-[11px] text-muted-foreground block">ضخامت برش</span>
                <span className="font-bold text-foreground mt-0.5 block">{inquiry.thickness}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">نوع فرآوری و فینیش سطح:</span>
                <span className="font-medium text-foreground">{inquiry.finish}</span>
              </div>
              {inquiry.dimensions && (
                <div>
                  <span className="text-muted-foreground block text-[11px]">ابعاد پلاک / برش:</span>
                  <span className="font-medium text-foreground">{inquiry.dimensions}</span>
                </div>
              )}
            </div>

            {inquiry.notes && (
              <div className="pt-2">
                <span className="text-muted-foreground block text-[11px] mb-1">
                  توضیحات و الزامات خاص متقاضی:
                </span>
                <p className="rounded-lg bg-secondary/30 p-3 text-xs text-foreground/90 leading-relaxed border border-border/50">
                  {inquiry.notes}
                </p>
              </div>
            )}
          </div>

          {/* Attachments / Blueprint Plans */}
          {inquiry.attachments && inquiry.attachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                فایل‌ها و نقشه‌های فنی پیوست ({inquiry.attachments.length} فایل)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {inquiry.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-card hover:bg-secondary/30 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <span className="font-medium text-foreground block truncate">{att.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{att.size}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 shrink-0 text-muted-foreground hover:text-foreground"
                      title="دانلود فایل پیوست"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quotation Details (if quoted or approved) */}
          {inquiry.quotation && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  اطلاعات پیش‌فاکتور رسمی صادر شده کارخانه
                </h4>
                <span className="text-[11px] text-muted-foreground font-mono">
                  تاریخ صدور: {inquiry.quotation.quoteDate}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="rounded-lg bg-card p-2.5 border border-border/60">
                  <span className="text-[11px] text-muted-foreground block">قیمت پایه واحد</span>
                  <span className="font-bold text-foreground mt-0.5 block">
                    {inquiry.quotation.unitPrice.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
                <div className="rounded-lg bg-card p-2.5 border border-border/60">
                  <span className="text-[11px] text-muted-foreground block">تخفیف همکاری</span>
                  <span className="font-bold text-foreground mt-0.5 block">
                    {inquiry.quotation.discountPercent}٪ ({inquiry.quotation.discountAmount.toLocaleString("fa-IR")})
                  </span>
                </div>
                <div className="rounded-lg bg-card p-2.5 border border-border/60">
                  <span className="text-[11px] text-muted-foreground block">زمان آماده‌سازی و برش</span>
                  <span className="font-bold text-foreground mt-0.5 block">
                    {inquiry.quotation.deliveryLeadDays} روز کاری
                  </span>
                </div>
                <div className="rounded-lg bg-emerald-600 text-white p-2.5">
                  <span className="text-[11px] text-white/80 block">مبلغ کل پیش‌فاکتور</span>
                  <span className="font-bold text-sm mt-0.5 block">
                    {inquiry.quotation.finalPrice.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1.5 pt-2 text-muted-foreground">
                <p>
                  <strong className="text-foreground">سینه کار / معدن:</strong>{" "}
                  {inquiry.quotation.quarrySource}
                </p>
                <p>
                  <strong className="text-foreground">شرایط تسویه:</strong>{" "}
                  {inquiry.quotation.paymentTerms}
                </p>
                {inquiry.quotation.quoteNotes && (
                  <p>
                    <strong className="text-foreground">توضیحات و شرایط فروش:</strong>{" "}
                    {inquiry.quotation.quoteNotes}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Audit Trail / History */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              تاریخچه رویدادها و پیگیری‌ها ({inquiry.history.length})
            </h4>
            <div className="space-y-2">
              {inquiry.history.map((h) => (
                <div
                  key={h.id}
                  className="rounded-lg border border-border/50 bg-secondary/15 p-2.5 text-xs flex items-start gap-2.5"
                >
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{h.action}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{h.timestamp}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground block">توسط: {h.actor}</span>
                    {h.notes && <p className="text-[11px] text-foreground/80 pt-0.5">{h.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border/70 p-4 bg-secondary/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isQuoted && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => onOpenPrint(inquiry)}
              >
                <Printer className="h-3.5 w-3.5" />
                مشاهده و چاپ پیش‌فاکتور
              </Button>
            )}
            {inquiry.status !== "approved" && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30"
                onClick={() => onAccept(inquiry)}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                تأیید و تبدیل به سفارش تولید
              </Button>
            )}
            {inquiry.status !== "rejected" && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                onClick={() => onReject(inquiry)}
              >
                <XCircle className="h-3.5 w-3.5" />
                رد استعلام
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onOpenChange(false)}
            >
              بستن
            </Button>
            <Button
              size="sm"
              className="gap-1.5 text-xs bg-primary text-primary-foreground hover:brightness-105"
              onClick={() => {
                onOpenChange(false);
                onOpenQuote(inquiry);
              }}
            >
              <Send className="h-3.5 w-3.5" />
              {inquiry.quotation ? "ویرایش و به‌روزرسانی مظنه" : "اعلام قیمت و صدور پیش‌فاکتور"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
