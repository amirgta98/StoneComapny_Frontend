"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  PackageCheck,
  Printer,
  ArrowRight,
  ExternalLink,
  Truck,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrdersStore } from "@/features/orders";
import { mockOrders } from "@/features/account/data/mock-data";
import { formatPrice } from "@/features/products/lib/product-price";

interface OrderSuccessViewProps {
  orderId: string;
}

export function OrderSuccessView({ orderId }: OrderSuccessViewProps) {
  const getOrderById = useOrdersStore((s) => s.getOrderById);

  const order = useMemo(() => {
    return (
      getOrderById(orderId, "all") ||
      mockOrders.find((o) => o.id === orderId || o.orderNumber === orderId)
    );
  }, [orderId, getOrderById]);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center px-4 space-y-6">
        <div className="rounded-3xl border border-border bg-card p-10 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PackageCheck className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            اطلاعات سفارش در دسترس نیست
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            شناسه سفارش مورد نظر یافت نشد. می‌توانید لیست کلیه سفارش‌های خود را در پنل کاربری مشاهده نمایید.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/account/orders">مشاهده سفارش‌های من</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const delivery = order.delivery;
  const summary = order.summary || {
    subtotal: order.total,
    shippingCost: delivery?.shippingCost || 0,
    discount: 0,
    tax: 0,
    total: order.total,
  };

  return (
    <div className="mx-auto max-w-4xl py-8 sm:py-12 px-4 space-y-8">
      {/* Top Congratulation Banner */}
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-10 text-center space-y-4 shadow-xs">
        <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-3xl font-extrabold text-foreground">
            سفارش شما با موفقیت ثبت و پرداخت گردید
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            پرداخت بانکی تأیید شد و فرآیند آماده‌سازی و بارگیری سنگ‌ها در کارخانه آغاز گردید.
          </p>
        </div>

        {/* Order Meta Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 bg-background px-3.5 py-1.5 rounded-full border border-border">
            <span className="text-muted-foreground">شماره پیگیری سفارش:</span>
            <strong className="text-foreground font-mono">{order.orderNumber || order.id}</strong>
          </div>

          <div className="flex items-center gap-1.5 bg-background px-3.5 py-1.5 rounded-full border border-border">
            <span className="text-muted-foreground">وضعیت:</span>
            <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 text-white text-[11px]">
              پرداخت موفق / در حال پردازش
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 bg-background px-3.5 py-1.5 rounded-full border border-border">
            <span className="text-muted-foreground">تاریخ ثبت:</span>
            <span className="text-foreground font-mono">
              {order.date ? new Date(order.date).toLocaleDateString("fa-IR") : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              فاکتور رسمی و جزئیات اقلام سفارش
            </h2>
            <p className="text-xs text-muted-foreground">
              تأمین‌کننده: {order.tenantName || "کارخانه سنگ و سرامیک صنعت"}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-2 text-xs"
          >
            <Printer className="h-4 w-4" />
            <span>چاپ فاکتور</span>
          </Button>
        </div>

        {/* Ordered Items Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase">
            سنگ‌ها و اقلام خریداری‌شده:
          </h3>
          <div className="divide-y divide-border/70 border border-border rounded-2xl overflow-hidden bg-background">
            {(order.items && order.items.length > 0
              ? order.items
              : [
                  {
                    id: "item-default",
                    name: order.productName,
                    image: order.productImage,
                    stoneType: "سنگ ساختمانی",
                    quantity: 1,
                    unit: "سفارش",
                    unitPrice: order.total,
                    totalPrice: order.total,
                  },
                ]
            ).map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || "/test_images/stones/test_1.jpg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">
                      {item.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[10px] bg-secondary/30">
                        {item.unit || "متر مربع"}
                      </Badge>
                      <span>
                        مقدار:{" "}
                        <strong className="text-foreground font-mono">
                          {item.quantity.toLocaleString("fa-IR")}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-end shrink-0 ps-17 sm:ps-0">
                  <div className="font-bold text-sm sm:text-base text-foreground tabular-nums">
                    {formatPrice(item.totalPrice || item.unitPrice * item.quantity)}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      تومان
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    مبلغ نهایی ردیف
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Financial Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Shipping Snapshot */}
          <div className="rounded-2xl border border-border bg-secondary/20 p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Truck className="h-4 w-4 text-primary" />
              <span>مشخصات ارسال و تخلیه بار</span>
            </div>

            <div className="space-y-1 text-muted-foreground leading-relaxed">
              <div>
                روش ارسال:{" "}
                <strong className="text-foreground">
                  {order.shippingMethod || delivery?.method || "باربری اختصاصی سنگ"}
                </strong>
              </div>
              {delivery && (
                <>
                  <div>
                    تحویل‌گیرنده:{" "}
                    <span className="text-foreground font-medium">
                      {delivery.receiverName} ({delivery.receiverPhone})
                    </span>
                  </div>
                  <div>
                    نشانی تخلیه:{" "}
                    <span className="text-foreground">{delivery.address}</span>
                  </div>
                  {delivery.carrier && (
                    <div>باربری مسئول: {delivery.carrier}</div>
                  )}
                  {delivery.trackingNumber && (
                    <div className="font-mono pt-1 text-primary">
                      کد بارنامه: {delivery.trackingNumber}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="rounded-2xl border border-border bg-secondary/20 p-4 sm:p-5 space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>اطلاعات مالی و پرداخت</span>
            </div>

            <div className="space-y-2 text-muted-foreground pt-1">
              <div className="flex items-center justify-between">
                <span>جمع اقلام:</span>
                <span className="font-medium text-foreground tabular-nums">
                  {formatPrice(summary.subtotal)} تومان
                </span>
              </div>

              {(summary.discount ?? 0) > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <span>تخفیف:</span>
                  <span className="font-medium tabular-nums">
                    -{formatPrice(summary.discount ?? 0)} تومان
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>هزینه ترابری سنگ:</span>
                <span className="font-medium text-foreground tabular-nums">
                  {summary.shippingCost === 0 ? "رایگان" : `${formatPrice(summary.shippingCost)} تومان`}
                </span>
              </div>

              <Separator className="bg-border/60 my-1" />

              <div className="flex items-center justify-between text-sm sm:text-base font-extrabold text-foreground pt-1">
                <span>مبلغ پرداخت‌شده:</span>
                <span className="text-primary tabular-nums">
                  {formatPrice(order.total || summary.total)} تومان
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border">
          <Button asChild size="lg" className="w-full sm:w-auto gap-2 text-xs sm:text-sm shadow-xs">
            <Link href={`/account/orders/${order.id}`}>
              <span>پیگیری وضعیت فرآوری و باربری در پنل کاربری</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-xs sm:text-sm">
            <Link href="/stones">
              <ArrowRight className="h-4 w-4 me-1" />
              <span>ادامه خرید از کاتالوگ سنگ‌ها</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
