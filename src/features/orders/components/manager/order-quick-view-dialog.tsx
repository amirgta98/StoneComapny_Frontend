"use client";

import Image from "next/image";
import Link from "next/link";
import {
  X,
  ExternalLink,
  Phone,
  MapPin,
  Truck,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  Calendar,
  FileText,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ExtendedFactoryOrder } from "../../stores/factory-orders-store";
import { FACTORY_STATUS_LABELS } from "../../stores/factory-orders-store";

interface OrderQuickViewDialogProps {
  order: ExtendedFactoryOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenStatusUpdate?: (order: ExtendedFactoryOrder) => void;
  onOpenWaybill?: (order: ExtendedFactoryOrder) => void;
}

const STATUS_BADGE_CLASS: Record<string, string> = {
  sourcing: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  cutting: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30",
  processing_surface: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
  ready_to_ship: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  shipping: "bg-primary/15 text-primary border-primary/30",
  delivered: "bg-secondary text-secondary-foreground border-border",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

export function OrderQuickViewDialog({
  order,
  isOpen,
  onClose,
  onOpenStatusUpdate,
  onOpenWaybill,
}: OrderQuickViewDialogProps) {
  if (!order) return null;

  const statusLabel = FACTORY_STATUS_LABELS[order.status] ?? order.statusLabel;
  const badgeClass = STATUS_BADGE_CLASS[order.status] ?? "bg-secondary text-secondary-foreground";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border/80 bg-card rounded-2xl shadow-xl" dir="rtl">
        {/* Header */}
        <DialogHeader className="p-5 border-b border-border/70 flex flex-row items-center justify-between sticky top-0 bg-card/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-bold text-foreground">
                  جزئیات سفارش سنگ
                </DialogTitle>
                <span className="font-mono text-xs text-muted-foreground font-semibold" dir="ltr">
                  {order.orderNumber}
                </span>
                {order.isUrgent && (
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] gap-1 py-0 px-1.5 font-bold">
                    <AlertCircle className="h-2.5 w-2.5" />
                    فوری
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                ثبت‌شده در تاریخ {order.createdAt}
              </p>
            </div>
          </div>

          <Badge variant="outline" className={`text-xs font-semibold px-2.5 py-1 ${badgeClass}`}>
            {statusLabel}
          </Badge>
        </DialogHeader>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Main Stone Highlight */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border/70 bg-secondary/30">
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-xl overflow-hidden border border-border/70 bg-stone-100 shadow-2xs">
              <img
                src={order.productImage}
                alt={order.productName}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                  {order.stoneType} · {order.form}
                </span>
                <h3 className="text-base font-bold text-foreground mt-0.5">
                  {order.productName}
                </h3>
              </div>

              {/* Spec Tags */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="rounded-lg bg-card/80 border border-border/60 p-2">
                  <span className="text-[10px] text-muted-foreground block">ابعاد</span>
                  <span className="font-medium text-foreground">{order.dimensions}</span>
                </div>
                <div className="rounded-lg bg-card/80 border border-border/60 p-2">
                  <span className="text-[10px] text-muted-foreground block">ضخامت</span>
                  <span className="font-medium text-foreground">{order.thickness}</span>
                </div>
                <div className="rounded-lg bg-card/80 border border-border/60 p-2">
                  <span className="text-[10px] text-muted-foreground block">متراژ / حجم</span>
                  <span className="font-medium text-foreground">{order.volume}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Project Info */}
          <div className="rounded-xl border border-border/70 p-4 space-y-3 bg-card">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-amber-600" />
              مشخصات خریدار و نشانی کارگاه پروژه
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">نام مشتری / معمار:</span>
                <span className="font-semibold text-foreground">{order.customerName}</span>
              </div>
              {order.customerPhone && (
                <div>
                  <span className="text-muted-foreground block text-[11px]">شماره تماس:</span>
                  <span className="font-mono text-foreground" dir="ltr">{order.customerPhone}</span>
                </div>
              )}
              {order.projectName && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground block text-[11px]">عنوان پروژه:</span>
                  <span className="font-medium text-foreground">{order.projectName}</span>
                </div>
              )}
              {order.delivery?.address && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground block text-[11px]">آدرس تحویل سنگ:</span>
                  <span className="text-foreground leading-relaxed">{order.delivery.address}</span>
                </div>
              )}
            </div>

            {/* Site Equipment Access Flags */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
              <span className="text-[11px] text-muted-foreground">امکانات تخلیه در مقصد:</span>
              {order.delivery?.craneAccess ? (
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  دسترسی جرثقیل دارد
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30">
                  فاقد جرثقیل کارگاهی
                </Badge>
              )}

              {order.delivery?.forkliftAccess ? (
                <Badge variant="outline" className="text-[10px] bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30 gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  لیفتراک موجود است
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] bg-secondary text-muted-foreground">
                  بدون لیفتراک
                </Badge>
              )}
            </div>
          </div>

          {/* Logistics & Tracking */}
          <div className="rounded-xl border border-border/70 p-4 space-y-3 bg-card">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-amber-600" />
              اطلاعات ترابری و بارنامه کارخانه
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">ناوگان باربری:</span>
                <span className="font-medium text-foreground">
                  {order.delivery?.carrier ?? "تعیین نشده"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">شماره بارنامه رسمی:</span>
                <span className="font-mono font-semibold text-foreground" dir="ltr">
                  {order.delivery?.trackingNumber ?? "صادر نشده"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">موعد تحویل تخمینی:</span>
                <span className="font-medium text-foreground">
                  {order.deliveryDate ?? order.delivery?.estimatedDeliveryDate ?? "طبق برنامه خط تولید"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">نحوه بسته‌بندی:</span>
                <span className="font-medium text-foreground">
                  {order.delivery?.method ?? "پالت‌بندی اختصاصی A-Frame"}
                </span>
              </div>
            </div>

            {order.notes && (
              <div className="pt-2 border-t border-border/60">
                <span className="text-[11px] text-muted-foreground block">یادداشت کارگاهی:</span>
                <p className="text-xs text-foreground bg-secondary/50 p-2.5 rounded-lg mt-1 leading-relaxed">
                  {order.notes}
                </p>
              </div>
            )}
          </div>

          {/* Financial Summary */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/70 bg-secondary/30">
            <div>
              <span className="text-xs text-muted-foreground block">مبلغ کل سفارش سنگ:</span>
              <span className="text-lg font-bold text-foreground tabular-nums">
                {order.totalPrice.toLocaleString("fa-IR")} تومان
              </span>
            </div>
            <div className="flex items-center gap-2">
              {onOpenWaybill && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onOpenWaybill(order);
                  }}
                  className="text-xs gap-1"
                >
                  <FileText className="h-3.5 w-3.5" />
                  حواله انبار
                </Button>
              )}
              {onOpenStatusUpdate && (
                <Button
                  size="sm"
                  onClick={() => {
                    onClose();
                    onOpenStatusUpdate(order);
                  }}
                  className="text-xs gap-1"
                >
                  <Clock className="h-3.5 w-3.5" />
                  تغییر وضعیت
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/70 bg-card flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            بستن
          </Button>

          <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
            <Link href={`/dashboard/orders/${order.id}`}>
              <span>صفحه کامل جزئیات سفارش</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
