"use client";

import { useState } from "react";
import {
  Truck,
  Copy,
  Check,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Info,
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
import type { CustomerOrder } from "../../data/mock-data";
import { orderStatusLabel, orderStatusMeta } from "../../data/mock-data";

interface OrderTrackingModalProps {
  order: CustomerOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderTrackingModal({
  order,
  open,
  onOpenChange,
}: OrderTrackingModalProps) {
  const [copied, setCopied] = useState(false);
  const statusMeta = orderStatusMeta[order.status];
  const orderNumber = order.orderNumber || order.id.replace("ord-c-", "ORD-");
  const freightBill = order.freightBillNumber || order.delivery?.trackingNumber;

  const handleCopyBill = () => {
    if (!freightBill) return;
    navigator.clipboard.writeText(freightBill);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl border-border">
        {/* Header with gradient accent */}
        <div className="border-b border-border bg-secondary/30 p-5">
          <DialogHeader className="text-start space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Truck className="h-5 w-5 stroke-[1.8]" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-foreground">
                    رهگیری ترابری و بارنامه سنگ
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    سفارش {orderNumber} • {order.tenantName}
                  </DialogDescription>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  statusMeta?.badgeClass ?? "bg-secondary text-secondary-foreground"
                }`}
              >
                {orderStatusLabel[order.status]}
              </span>
            </div>
          </DialogHeader>
        </div>

        {/* Content Body */}
        <div className="max-h-[75vh] overflow-y-auto p-5 space-y-5 text-xs">
          {/* Freight Bill Card */}
          {freightBill ? (
            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-3.5">
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground">
                  شماره بارنامه ترابری سنگبری:
                </span>
                <div className="font-mono text-base font-bold text-foreground">
                  {freightBill}
                </div>
                {order.delivery?.carrier && (
                  <div className="text-[11px] text-muted-foreground">
                    ناوگان حمل: {order.delivery.carrier}
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyBill}
                className="gap-1.5 border-border bg-background text-foreground hover:bg-secondary"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-primary" />
                    کپی شد
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    کپی بارنامه
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 p-3 text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>
                بارنامه پس از اتمام فرآوری و تحویل پالت‌های سنگ به راننده در سامانه ثبت می‌شود.
              </span>
            </div>
          )}

          {/* Logistics specs */}
          <div className="space-y-3 rounded-xl border border-border bg-secondary/20 p-4">
            <h4 className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              مشخصات ناوگان و نوع بسته‌بندی سنگ
            </h4>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-muted-foreground">
              <div>
                <span className="text-muted-foreground">نوع بسته‌بندی: </span>
                <span className="font-medium text-foreground">
                  {order.packaging || "پالت چوبی تقویت‌شده استاندارد"}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground">روش حمل بار: </span>
                <span className="font-medium text-foreground">
                  {order.shippingMethod || "کامیون کفی مجهز به ضربه‌گیر"}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground">تاریخ تحویل تقریبی: </span>
                <span className="font-medium text-foreground">
                  {order.estimatedDeliveryDate || "طبق اعلام باربری"}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground">آماده‌سازی کارخانه: </span>
                <span className="font-medium text-foreground">
                  {order.estimatedPrepTime || "انجام شده"}
                </span>
              </div>
            </div>
          </div>

          {/* Unloading & Jobsite Access */}
          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <h4 className="font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              محل تخلیه و تمهیدات پروژه
            </h4>

            <div className="space-y-2 text-muted-foreground">
              <div>
                <span className="text-muted-foreground">نشانی پروژه: </span>
                <span className="font-medium text-foreground">
                  {order.delivery?.address || "نشانی ثبت‌شده در سفارش"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-muted-foreground">تحویل‌گیرنده: </span>
                  <span className="font-medium text-foreground">
                    {order.delivery?.receiverName || "مشتری گرامی"}
                  </span>
                </div>
                {order.delivery?.receiverPhone && (
                  <div className="flex items-center gap-1 text-primary">
                    <Phone className="h-3 w-3" />
                    <a
                      href={`tel:${order.delivery.receiverPhone}`}
                      className="hover:underline"
                      dir="ltr"
                    >
                      {order.delivery.receiverPhone}
                    </a>
                  </div>
                )}
              </div>

              {/* Crane & Forklift tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {order.delivery?.craneAccess ? (
                  <Badge
                    variant="outline"
                    className="border-border bg-secondary/50 text-foreground"
                  >
                    دسترسی جرثقیل در پروژه مهیا است
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-border bg-secondary/30 text-muted-foreground"
                  >
                    تخلیه بدون جرثقیل (دستی یا کفی جک‌دار)
                  </Badge>
                )}

                {order.delivery?.forkliftAccess && (
                  <Badge
                    variant="outline"
                    className="border-border bg-secondary/50 text-foreground"
                  >
                    لیفتراک کارگاهی مستقر است
                  </Badge>
                )}

                {order.delivery?.floor && (
                  <span className="text-[11px] text-muted-foreground">
                    محل تخلیه: {order.delivery.floor}
                  </span>
                )}
              </div>

              {order.delivery?.deliveryNotes && (
                <div className="rounded-lg bg-secondary/40 border border-border/80 p-2.5 text-[11px] leading-relaxed text-foreground/90">
                  <span className="font-semibold text-foreground">نکات ویژه تخلیه بار سنگ: </span>
                  {order.delivery.deliveryNotes}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-secondary/30 p-4">
          <div className="text-[11px] text-muted-foreground">
            پشتیبانی باربری سنگ: ۰۲۱-۸۸۸۸۰۰۰۰
          </div>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs rounded-xl"
          >
            بستن
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
