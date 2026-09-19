"use client";

import { useState, useId } from "react";
import {
  Calculator,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  Percent,
  Send,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { FactoryInquiryItem } from "../types";
import { useFactoryInquiriesStore } from "../stores/factory-inquiries-store";

interface InquiryQuoteDialogProps {
  inquiry: FactoryInquiryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InquiryQuoteDialog({
  inquiry,
  open,
  onOpenChange,
  onSuccess,
}: InquiryQuoteDialogProps) {
  const submitQuote = useFactoryInquiriesStore((s) => s.submitQuote);

  // Form state initialized from existing quotation if available
  const existingQuote = inquiry?.quotation;
  const initialVolume = inquiry?.volumeNumber || 100;

  const [unitPrice, setUnitPrice] = useState<number>(existingQuote?.unitPrice || 1_850_000);
  const [discountPercent, setDiscountPercent] = useState<number>(existingQuote?.discountPercent || 0);
  const [taxPercent, setTaxPercent] = useState<number>(existingQuote?.taxPercent || 0);
  const [deliveryLeadDays, setDeliveryLeadDays] = useState<number>(
    existingQuote?.deliveryLeadDays || 12
  );
  const [quarrySource, setQuarrySource] = useState<string>(
    existingQuote?.quarrySource || "معدن اختصاصی کارخانه - سینه کار صادراتی درجه یک"
  );
  const [paymentTerms, setPaymentTerms] = useState<string>(
    existingQuote?.paymentTerms || "۵۰٪ پیش‌پرداخت نقدی، ۵۰٪ تسویه در زمان بارگیری و باسکول"
  );
  const [validityDays, setValidityDays] = useState<number>(existingQuote?.validityDays || 7);
  const [quoteNotes, setQuoteNotes] = useState<string>(
    existingQuote?.quoteNotes ||
      "قیمت فوق شامل بارگیری روی تریلی در محل کارخانه است. ارسال با بارنامه رسمی و بیمه‌نامه معتبر سنگ انجام می‌شود."
  );

  const unitPriceId = useId();
  const discountPercentId = useId();
  const taxPercentId = useId();
  const deliveryLeadDaysId = useId();
  const validityDaysId = useId();
  const quarrySourceId = useId();
  const paymentTermsId = useId();
  const quoteNotesId = useId();

  if (!inquiry) return null;

  // Live calculations
  const subtotal = Math.round(initialVolume * (unitPrice || 0));
  const discountAmount = Math.round(subtotal * ((discountPercent || 0) / 100));
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = Math.round(afterDiscount * ((taxPercent || 0) / 100));
  const finalPrice = afterDiscount + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!unitPrice || unitPrice <= 0) {
      toast.error("لطفاً قیمت پایه هر مترمربع / واحد را به درستی وارد نمایید.");
      return;
    }

    submitQuote(inquiry.id, {
      unitPrice,
      subtotal,
      discountPercent,
      discountAmount,
      taxPercent,
      taxAmount,
      finalPrice,
      deliveryLeadDays,
      quarrySource,
      paymentTerms,
      validityDays,
      quoteNotes,
      quotedBy: "مدیریت بازرگانی و فروش کارخانه",
    });

    toast.success(`پیش‌فاکتور رسمی برای استعلام ${inquiry.rfqNumber} با موفقیت صادر شد.`);
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-border/80 bg-card text-card-foreground shadow-2xl"
        dir="rtl"
      >
        <div className="border-b border-border/70 bg-gradient-to-r from-secondary/50 via-card to-emerald-950/10 p-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/25">
              <Calculator className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                صدور مظنه قیمت و پیش‌فاکتور کارخانه
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                استعلام: <span className="font-semibold text-foreground">{inquiry.rfqNumber}</span> •{" "}
                متقاضی: <span className="text-foreground">{inquiry.customerName}</span> (
                {inquiry.customerRole})
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Stone Specs Reminder Box */}
          <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 text-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-muted-foreground block text-[11px]">سنگ و متراژ درخواستی:</span>
              <span className="font-bold text-foreground text-sm">
                {inquiry.stoneTitle} ({inquiry.volume})
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-1 rounded bg-card border border-border/60">
                فینیش: {inquiry.finish}
              </span>
              <span className="px-2 py-1 rounded bg-card border border-border/60">
                ضخامت: {inquiry.thickness}
              </span>
            </div>
          </div>

          {/* Pricing Calculation Inputs */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-primary" />
              محاسبه مالی و قیمت پایه
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor={unitPriceId} className="text-xs text-foreground font-medium">
                  قیمت هر {inquiry.volumeUnit} (تومان) *
                </Label>
                <Input
                  id={unitPriceId}
                  type="number"
                  min="0"
                  step="10000"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="font-mono text-sm"
                  placeholder="مثلاً ۱,۸۵۰,۰۰۰"
                  required
                />
                <span className="text-[10px] text-muted-foreground block">
                  {(unitPrice || 0).toLocaleString("fa-IR")} تومان
                </span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={discountPercentId} className="text-xs text-foreground font-medium">
                  تخفیف همکاری (%)
                </Label>
                <Input
                  id={discountPercentId}
                  type="number"
                  min="0"
                  max="50"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="font-mono text-sm"
                  placeholder="0"
                />
                <span className="text-[10px] text-muted-foreground block">
                  کاهش: {discountAmount.toLocaleString("fa-IR")} تومان
                </span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={taxPercentId} className="text-xs text-foreground font-medium">
                  مالیات بر ارزش افزوده (%)
                </Label>
                <Input
                  id={taxPercentId}
                  type="number"
                  min="0"
                  max="20"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="font-mono text-sm"
                  placeholder="0"
                />
                <span className="text-[10px] text-muted-foreground block">
                  افزایش: {taxAmount.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </div>

            {/* Instant Calculation Summary Banner */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  مبلغ ناخالص ({inquiry.volumeNumber} {inquiry.volumeUnit} ×{" "}
                  {unitPrice.toLocaleString("fa-IR")}):
                </span>
                <span className="font-mono font-medium text-foreground">
                  {subtotal.toLocaleString("fa-IR")} تومان
                </span>
              </div>
              {discountPercent > 0 && (
                <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400">
                  <span>تخفیف اعمال شده ({discountPercent}٪):</span>
                  <span className="font-mono">-{discountAmount.toLocaleString("fa-IR")} تومان</span>
                </div>
              )}
              {taxPercent > 0 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>مالیات بر ارزش افزوده ({taxPercent}٪):</span>
                  <span className="font-mono">+{taxAmount.toLocaleString("fa-IR")} تومان</span>
                </div>
              )}
              <div className="pt-2 border-t border-primary/20 flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">مبلغ نهایی پیش‌فاکتور:</span>
                <span className="font-bold text-base text-primary font-mono">
                  {finalPrice.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </div>
          </div>

          {/* Technical & Commercial Terms */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              شرایط تولید و تحویل کارخانه
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor={deliveryLeadDaysId} className="text-xs text-foreground font-medium">
                  مدت زمان آماده‌سازی و برش (روز کاری)
                </Label>
                <Input
                  id={deliveryLeadDaysId}
                  type="number"
                  min="1"
                  max="120"
                  value={deliveryLeadDays}
                  onChange={(e) => setDeliveryLeadDays(Number(e.target.value))}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={validityDaysId} className="text-xs text-foreground font-medium">
                  مدت اعتبار مظنه (روز)
                </Label>
                <Input
                  id={validityDaysId}
                  type="number"
                  min="1"
                  max="60"
                  value={validityDays}
                  onChange={(e) => setValidityDays(Number(e.target.value))}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={quarrySourceId} className="text-xs text-foreground font-medium">
                  سورس کوپ و سینه کار معدن
                </Label>
                <Input
                  id={quarrySourceId}
                  value={quarrySource}
                  onChange={(e) => setQuarrySource(e.target.value)}
                  className="text-xs"
                  placeholder="نام معدن، پلاک یا سینه کار"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={paymentTermsId} className="text-xs text-foreground font-medium">
                  شرایط تسویه حساب و پرداخت
                </Label>
                <Input
                  id={paymentTermsId}
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="text-xs"
                  placeholder="مثلاً ۵۰٪ نقد، ۵۰٪ چک صیادی ۴۵ روزه"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={quoteNotesId} className="text-xs text-foreground font-medium">
                  توضیحات و الزامات فنی در پیش‌فاکتور
                </Label>
                <Textarea
                  id={quoteNotesId}
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="text-xs leading-relaxed"
                  placeholder="توضیحات بارگیری، تلرانس ضخامت، بسته‌بندی پالت..."
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t border-border/70 pt-4 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onOpenChange(false)}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              صدور و ثبت رسمی پیش‌فاکتور
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
