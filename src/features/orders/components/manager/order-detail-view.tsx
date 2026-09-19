"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Printer,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  MapPin,
  Phone,
  FileText,
  Calendar,
  Building2,
  Flame,
  Hammer,
  PackageCheck,
  ShieldCheck,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useFactoryOrdersStore,
  type ExtendedFactoryOrder,
  FACTORY_STATUS_LABELS,
} from "../../stores/factory-orders-store";
import { OrderStatusUpdateDialog } from "./order-status-update-dialog";
import { OrderWaybillDialog } from "./order-waybill-dialog";
import type { FactoryOrder } from "@/features/manager/types";

interface OrderDetailViewProps {
  orderId: string;
}

const PRODUCTION_STEPS = [
  {
    step: 0,
    statusKey: "sourcing",
    title: "تأمین کوپ خام",
    desc: "انتخاب کوپ سنگ از معدن",
    icon: Flame,
  },
  {
    step: 1,
    statusKey: "cutting",
    title: "برش اسلب / تایل",
    desc: "برش با اره و کالیبراسیون",
    icon: Hammer,
  },
  {
    step: 2,
    statusKey: "processing_surface",
    title: "ساب و رزین نانو",
    desc: "اپوکسی، توری پشت و ساب",
    icon: Clock,
  },
  {
    step: 3,
    statusKey: "ready_to_ship",
    title: "پالت‌بندی و کنترل کیفیت",
    desc: "بسته‌بندی در پالت A-Frame",
    icon: PackageCheck,
  },
  {
    step: 4,
    statusKey: "shipping",
    title: "بارگیری و ترابری",
    desc: "حمل با تریلی و بارنامه رسمی",
    icon: Truck,
  },
  {
    step: 5,
    statusKey: "delivered",
    title: "تحویل کارگاه",
    desc: "تخلیه و امضای تحویل سلامت",
    icon: CheckCircle2,
  },
];

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const router = useRouter();
  const getOrderById = useFactoryOrdersStore((s) => s.getOrderById);
  const order = getOrderById(orderId);

  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [isWaybillOpen, setIsWaybillOpen] = useState(false);

  if (!order) {
    return (
      <div className="p-8 text-center space-y-4" dir="rtl">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground">
          <Package className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-foreground">سفارش مورد نظر یافت نشد</h2>
        <p className="text-xs text-muted-foreground">
          ممکن است شماره سفارش نادرست باشد یا این سفارش متعلق به کارخانه دیگری باشد.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/orders" className="gap-1.5 text-xs">
            <ArrowRight className="h-3.5 w-3.5" />
            <span>بازگشت به لیست سفارشات</span>
          </Link>
        </Button>
      </div>
    );
  }

  const currentStep = order.timelineStep ?? 2;
  const statusLabel = FACTORY_STATUS_LABELS[order.status] ?? order.statusLabel;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/dashboard/orders"
            className="hover:text-foreground transition-colors flex items-center gap-1 font-medium"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            <span>سفارش‌های کارخانه</span>
          </Link>
          <span>/</span>
          <span className="font-mono text-foreground font-semibold" dir="ltr">
            {order.orderNumber}
          </span>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsWaybillOpen(true)}
            className="gap-1.5 text-xs shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>چاپ حواله انبار</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsStatusUpdateOpen(true)}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>تغییر مرحله خط تولید</span>
          </Button>
        </div>
      </div>

      {/* Main Order Header Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                سفارش {order.productName}
              </h1>
              {order.isUrgent && (
                <Badge
                  variant="outline"
                  className="bg-destructive/10 text-destructive border-destructive/20 text-[11px] gap-1 font-bold"
                >
                  <AlertCircle className="h-3 w-3" />
                  فوری
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>
                شماره رهگیری:{" "}
                <strong className="text-foreground font-mono" dir="ltr">
                  {order.orderNumber}
                </strong>
              </span>
              <span>·</span>
              <span>
                تاریخ ثبت سفارش:{" "}
                <strong className="text-foreground">{order.createdAt}</strong>
              </span>
              <span>·</span>
              <span>
                موعد تحویل:{" "}
                <strong className="text-foreground">
                  {order.deliveryDate ?? order.delivery?.estimatedDeliveryDate ?? "طبق برنامه"}
                </strong>
              </span>
            </div>
          </div>

          <div className="text-start md:text-end">
            <span className="text-xs text-muted-foreground block">مبلغ کل فاکتور سفارش:</span>
            <span className="text-2xl font-extrabold text-foreground tabular-nums">
              {order.totalPrice.toLocaleString("fa-IR")} تومان
            </span>
          </div>
        </div>

        {/* Milestone Production Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-amber-600" />
              مراحل خط تولید و تحویل سفارش سنگ کارخانه
            </span>
            <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5">
              وضعیت جاری: {statusLabel}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
            {PRODUCTION_STEPS.map((step) => {
              const Icon = step.icon;
              const isPast = step.step < currentStep;
              const isCurrent = step.step === currentStep;

              return (
                <div
                  key={step.step}
                  className={`rounded-xl border p-3 text-start transition-all relative ${
                    isCurrent
                      ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary shadow-xs"
                      : isPast
                      ? "border-emerald-500/30 bg-emerald-500/5 text-foreground"
                      : "border-border/60 bg-secondary/30 text-muted-foreground opacity-75"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : isPast
                          ? "bg-emerald-600 text-white"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold">
                      ۰{step.step + 1}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold truncate">{step.title}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Columns Grid: Specs + Customer Logistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Stone Product Specs & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stone Specifications Card */}
          <Card className="border border-border/80 bg-card shadow-2xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-amber-600" />
                مشخصات فنی و برش سنگ سفارش‌داده‌شده
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="relative h-44 w-full sm:w-44 shrink-0 rounded-xl overflow-hidden border border-border/70 bg-stone-100 shadow-2xs">
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      {order.stoneType} · {order.form}
                    </span>
                    <h3 className="text-base font-bold text-foreground mt-0.5">
                      {order.productName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="rounded-lg bg-secondary/40 border border-border/60 p-2.5">
                      <span className="text-[10px] text-muted-foreground block">ابعاد سفارش</span>
                      <span className="font-semibold text-foreground font-mono mt-0.5 block">
                        {order.dimensions}
                      </span>
                    </div>
                    <div className="rounded-lg bg-secondary/40 border border-border/60 p-2.5">
                      <span className="text-[10px] text-muted-foreground block">ضخامت برش</span>
                      <span className="font-semibold text-foreground font-mono mt-0.5 block">
                        {order.thickness}
                      </span>
                    </div>
                    <div className="rounded-lg bg-secondary/40 border border-border/60 p-2.5">
                      <span className="text-[10px] text-muted-foreground block">متراژ / حجم سفارش</span>
                      <span className="font-bold text-foreground mt-0.5 block">
                        {order.volume}
                      </span>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs space-y-1">
                      <span className="font-bold text-amber-800 dark:text-amber-400 block">
                        دستورالعمل و توضیحات کارگاهی:
                      </span>
                      <p className="text-muted-foreground leading-relaxed">
                        {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Multi-Item Breakdown if present */}
              {order.items && order.items.length > 0 && (
                <div className="pt-4 border-t border-border/60 space-y-3">
                  <h4 className="text-xs font-bold text-foreground">
                    ریز اقلام سبد سفارش:
                  </h4>
                  <div className="divide-y divide-border/40 rounded-xl border border-border/60 overflow-hidden">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 text-xs bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover border border-border/60"
                          />
                          <div>
                            <p className="font-semibold text-foreground">{item.name}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {item.finish} · {item.dimensions} · ضخامت: {item.thickness}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-auto text-end">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">تعداد / متراژ</span>
                            <span className="font-bold text-foreground">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block">مبلغ کل</span>
                            <span className="font-bold text-foreground tabular-nums">
                              {item.totalPrice.toLocaleString("fa-IR")} تومان
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Customer & Jobsite Logistics + Financials */}
        <div className="space-y-6">
          {/* Buyer & Jobsite */}
          <Card className="border border-border/80 bg-card shadow-2xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-600" />
                مشخصات خریدار و محل تخلیه
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-muted-foreground block">نام خریدار / آرشیتکت:</span>
                <span className="font-bold text-foreground">{order.customerName}</span>
              </div>
              {order.customerPhone && (
                <div>
                  <span className="text-[11px] text-muted-foreground block">شماره تماس:</span>
                  <span className="font-mono font-medium text-foreground" dir="ltr">
                    {order.customerPhone}
                  </span>
                </div>
              )}
              {order.projectName && (
                <div>
                  <span className="text-[11px] text-muted-foreground block">عنوان پروژه:</span>
                  <span className="font-medium text-foreground">{order.projectName}</span>
                </div>
              )}
              {order.delivery?.address && (
                <div>
                  <span className="text-[11px] text-muted-foreground block">نشانی کارگاه پروژه:</span>
                  <p className="text-foreground leading-relaxed mt-0.5">
                    {order.delivery.address}
                  </p>
                </div>
              )}

              {/* Heavy Equipment Unloading Flags */}
              <div className="pt-2 border-t border-border/60 space-y-1.5">
                <span className="text-[11px] font-semibold text-foreground block">
                  شرایط تخلیه در مقصد:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {order.delivery?.craneAccess ? (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      جرثقیل کارگاهی مهیا است
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                    >
                      فاقد جرثقیل (نیاز به هماهنگی)
                    </Badge>
                  )}

                  {order.delivery?.forkliftAccess && (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30 gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      لیفتراک فعال
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logistics & Waybill Tracking */}
          <Card className="border border-border/80 bg-card shadow-2xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Truck className="h-4 w-4 text-amber-600" />
                اطلاعات ترابری و بارنامه
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-muted-foreground block">شرکت باربری:</span>
                <span className="font-semibold text-foreground">
                  {order.delivery?.carrier ?? "تعیین نشده"}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">شماره بارنامه رسمی:</span>
                <span className="font-mono font-bold text-foreground text-sm" dir="ltr">
                  {order.delivery?.trackingNumber ?? "صادر نشده"}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">نوع ناوگان باربری:</span>
                <span className="font-medium text-foreground">
                  {order.delivery?.method ?? "تریلی کفی سنگین"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Financials Card */}
          <Card className="border border-border/80 bg-card shadow-2xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-600" />
                خلاصه مالی سفارش
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>مبلغ سنگ‌ها:</span>
                <span className="font-mono tabular-nums text-foreground">
                  {order.totalPrice.toLocaleString("fa-IR")} تومان
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>کرایه ترابری و بارنامه:</span>
                <span className="font-mono tabular-nums text-foreground">
                  {(order.delivery?.shippingCost ?? 0).toLocaleString("fa-IR")} تومان
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-bold text-foreground pt-1">
                <span>مجموع نهایی فاکتور:</span>
                <span className="text-primary tabular-nums">
                  {(order.totalPrice + (order.delivery?.shippingCost ?? 0)).toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <OrderStatusUpdateDialog
        order={order}
        isOpen={isStatusUpdateOpen}
        onClose={() => setIsStatusUpdateOpen(false)}
      />

      <OrderWaybillDialog
        order={order}
        isOpen={isWaybillOpen}
        onClose={() => setIsWaybillOpen(false)}
      />
    </div>
  );
}
