"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  PackageCheck,
  Flame,
  Hammer,
} from "lucide-react";
import type { ExtendedFactoryOrder } from "../../stores/factory-orders-store";
import {
  useFactoryOrdersStore,
  FACTORY_STATUS_LABELS,
} from "../../stores/factory-orders-store";
import type { FactoryOrder } from "@/features/manager/types";

interface OrderStatusUpdateDialogProps {
  order: ExtendedFactoryOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_STEPS: {
  status: FactoryOrder["status"];
  label: string;
  description: string;
  icon: typeof Clock;
}[] = [
  {
    status: "sourcing",
    label: "تأمین کوپ خام",
    description: "انتخاب و هماهنگی کوپ سنگ در معدن",
    icon: Flame,
  },
  {
    status: "cutting",
    label: "برش اسلب / تایل",
    description: "قرارگیری روی قله‌بر و اره دیسکی جهت برش با ضخامت دقیق",
    icon: Hammer,
  },
  {
    status: "processing_surface",
    label: "ساب و رزین نانو",
    description: "اجرای ماستیک، رزین اپوکسی و ساب پولیش فوق درخشان",
    icon: Clock,
  },
  {
    status: "ready_to_ship",
    label: "آماده بارگیری و پالت",
    description: "تسمه‌کشی در پالت‌های مقاوم چوبی و فلزی",
    icon: PackageCheck,
  },
  {
    status: "shipping",
    label: "در حال حمل با باربری",
    description: "صدور بارنامه رسمی و اعزام تریلی / خاور به محل پروژه",
    icon: Truck,
  },
  {
    status: "delivered",
    label: "تحویل کارگاه شد",
    description: "تخلیه سنگ و امضای صورت‌جلسه تحویل سلامت بار",
    icon: CheckCircle,
  },
  {
    status: "cancelled",
    label: "لغو سفارش",
    description: "عدم امکان تأمین یا لغو توسط خریدار",
    icon: AlertCircle,
  },
];

export function OrderStatusUpdateDialog({
  order,
  isOpen,
  onClose,
}: OrderStatusUpdateDialogProps) {
  const updateOrderStatus = useFactoryOrdersStore((s) => s.updateOrderStatus);

  const [selectedStatus, setSelectedStatus] = useState<FactoryOrder["status"]>(
    order?.status ?? "processing_surface"
  );
  const [carrier, setCarrier] = useState(order?.delivery?.carrier ?? "");
  const [trackingNumber, setTrackingNumber] = useState(
    order?.delivery?.trackingNumber ?? ""
  );
  const [deliveryDate, setDeliveryDate] = useState(
    order?.deliveryDate ?? order?.delivery?.estimatedDeliveryDate ?? ""
  );
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when order changes
  const handleOpenChange = (open: boolean) => {
    if (open && order) {
      setSelectedStatus(order.status);
      setCarrier(order.delivery?.carrier ?? "");
      setTrackingNumber(order.delivery?.trackingNumber ?? "");
      setDeliveryDate(
        order.deliveryDate ?? order.delivery?.estimatedDeliveryDate ?? ""
      );
      setNotes("");
    }
    if (!open) {
      onClose();
    }
  };

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      updateOrderStatus(order.id, selectedStatus, {
        carrier: carrier.trim() || undefined,
        trackingNumber: trackingNumber.trim() || undefined,
        deliveryDate: deliveryDate.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      toast.success("وضعیت سفارش با موفقیت به‌روزرسانی شد", {
        description: `سفارش ${order.orderNumber} به مرحله «${FACTORY_STATUS_LABELS[selectedStatus]}» تغییر یافت.`,
      });
      onClose();
    } catch (err) {
      toast.error("خطا در به‌روزرسانی وضعیت سفارش");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border/80 bg-card rounded-2xl shadow-xl"
        dir="rtl"
      >
        <DialogHeader className="p-5 border-b border-border/70 sticky top-0 bg-card/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                تغییر مرحله و وضعیت سفارش سنگ
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                سفارش {order.orderNumber} · {order.productName}
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Production Stage Selection */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-foreground block">
              انتخاب مرحله جدید خط تولید و تحویل:
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STATUS_STEPS.map((step) => {
                const Icon = step.icon;
                const isSelected = selectedStatus === step.status;
                const isCurrent = order.status === step.status;

                return (
                  <button
                    type="button"
                    key={step.status}
                    onClick={() => setSelectedStatus(step.status)}
                    className={`flex items-start gap-3 p-3 text-start rounded-xl border transition-all duration-150 text-xs ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs text-foreground ring-1 ring-primary"
                        : "border-border/70 hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">
                          {step.label}
                        </span>
                        {isCurrent && (
                          <Badge
                            variant="secondary"
                            className="text-[9px] px-1 py-0"
                          >
                            فعلی
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                        {step.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logistics & Tracking Information */}
          <div className="space-y-4 rounded-xl border border-border/70 p-4 bg-secondary/20">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-amber-600" />
              اطلاعات حمل، ترابری و بارنامه کارخانه
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">نام شرکت باربری:</Label>
                <Input
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="مثال: ترابری سنگ پایتخت"
                  className="text-xs h-9 bg-card"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">شماره بارنامه رسمی:</Label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="مثال: BL-982410"
                  className="text-xs h-9 bg-card font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs text-muted-foreground">تاریخ تحویل تخمینی در کارگاه:</Label>
                <Input
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  placeholder="مثال: ۲۸ شهریور ۱۴۰۳"
                  className="text-xs h-9 bg-card"
                />
              </div>
            </div>
          </div>

          {/* Workshop Internal Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground">
              یادداشت داخلی سرپرست کارگاه / کنترل کیفیت:
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: سنگ‌ها پس از ساب نانو در پالت فلزی مستحکم بسته‌بندی شدند..."
              className="text-xs min-h-[75px] resize-none bg-card"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-border/70 gap-2 flex-row justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs gap-1.5 font-bold shadow-xs"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>ثبت و اعمال تغییرات</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
