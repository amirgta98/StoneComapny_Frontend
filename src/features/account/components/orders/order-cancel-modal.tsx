"use client";

import { useState } from "react";
import { AlertCircle, RotateCcw, XCircle, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { CustomerOrder } from "../../data/mock-data";

interface OrderCancelModalProps {
  order: CustomerOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function OrderCancelModal({
  order,
  open,
  onOpenChange,
  onSuccess,
}: OrderCancelModalProps) {
  const isDelivered =
    order.status === "delivered" ||
    order.status === "received" ||
    order.status === "completed";

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderNumber = order.orderNumber || order.id.replace("ord-c-", "ORD-");

  const cancelReasons = [
    { value: "architectural_change", label: "تغییر در طراحی یا نقشه‌های معماری پروژه" },
    { value: "lead_time_delay", label: "تأخیر در برنامه زمان‌بندی فرآوری و برش کارخانه" },
    { value: "accidental_order", label: "اشتباه در ثبت متراژ یا نوع سنگ" },
    { value: "financial_reason", label: "انصراف موقت کارفرما از ادامه عملیات ساختمانی" },
    { value: "other", label: "سایر دلایل" },
  ];

  const returnReasons = [
    { value: "sorting_mismatch", label: "مغایرت سورت، تم رنگ یا رگه‌های سنگ با نمونه تأییدشده" },
    { value: "transport_damage", label: "شکستگی، لب‌پریدگی یا آسیب در حین حمل باربری" },
    { value: "dimensional_error", label: "عدم گونیا بودن یا خطای ضخامت و ابعاد سنگ" },
    { value: "surface_finish_defect", label: "نقص در کیفیت ساب، رزین اپوکسی یا پولیش سطح" },
    { value: "other", label: "سایر موارد فنی" },
  ];

  const reasons = isDelivered ? returnReasons : cancelReasons;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error("لطفاً دلیل درخواست را انتخاب کنید.");
      return;
    }

    setIsSubmitting(true);

    // Simulate server submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        isDelivered
          ? "درخواست مرجوعی و بررسی کارشناسی با موفقیت ثبت شد."
          : "درخواست لغو سفارش ثبت شد و به امور مشتریان ارجاع گردید."
      );
      onOpenChange(false);
      onSuccess?.();
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden rounded-2xl border-border">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="border-b border-border bg-secondary/30 p-5">
            <DialogHeader className="text-start space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  {isDelivered ? (
                    <RotateCcw className="h-5 w-5 stroke-[1.8]" />
                  ) : (
                    <XCircle className="h-5 w-5 stroke-[1.8]" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-foreground">
                    {isDelivered
                      ? "ثبت درخواست مرجوعی / مغایرت سنگ"
                      : "درخواست لغو سفارش سنگ"}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    سفارش {orderNumber} • {order.tenantName}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Form Content */}
          <div className="p-5 space-y-4 text-xs">
            {/* Regulatory Notice */}
            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/40 p-3 text-foreground/90">
              <AlertCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <div className="space-y-1 text-[11px] leading-relaxed">
                <p className="font-semibold text-foreground">قوانین لغو و مرجوعی سنگ طبیعی:</p>
                <p className="text-muted-foreground">
                  {isDelivered
                    ? "در صورت هرگونه شکستگی در باربری یا مغایرت سورت، فرم صورت‌جلسه تخلیه یا عکس‌های پالت‌ها را در اختیار کارشناس قرار دهید. بررسی اولیه ظرف ۲۴ ساعت کاری انجام می‌شود."
                    : "در صورتی که برش کوپ یا فرآوری سنگ در کارخانه آغاز شده باشد، لغو سفارش منوط به هماهنگی با مدیر تولید کارخانه و کسر هزینه‌های فرآوری خواهد بود."}
                </p>
              </div>
            </div>

            {/* Reason Selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                علت درخواست <span className="text-destructive">*</span>
              </label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="w-full text-xs rounded-xl border-border">
                  <SelectValue placeholder="یک علت را انتخاب فرمایید..." />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map((r) => (
                    <SelectItem key={r.value} value={r.value} className="text-xs">
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description / Notes */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                توضیحات تکمیلی (متراژ، پالت معیوب یا شرایط پروژه)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="لطفاً مشخصات دقیق یا علت انصراف/مرجوعی را برای پیگیری سریع‌تر بنویسید..."
                className="min-h-[90px] text-xs resize-none rounded-xl border-border"
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="flex flex-row items-center justify-end gap-2 border-t border-border bg-secondary/30 p-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="text-xs"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              variant={isDelivered ? "default" : "destructive"}
              size="sm"
              disabled={isSubmitting || !reason}
              className="gap-1.5 text-xs"
            >
              {isSubmitting ? (
                "در حال ارسال..."
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 rtl:rotate-180" />
                  {isDelivered ? "ارسال درخواست مرجوعی" : "تأیید لغو سفارش"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
