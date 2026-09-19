"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Printer,
  Truck,
  Building2,
  Calendar,
  Hash,
  MapPin,
  Phone,
  Clock,
  RotateCcw,
  XCircle,
  FileText,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  Ruler,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/auth";
import { useOrdersStore } from "@/features/orders";
import {
  mockOrders,
  orderStatusLabel,
  orderStatusMeta,
  type CustomerOrder,
  type OrderItem,
} from "../../data/mock-data";
import { OrderTimeline } from "./order-timeline";
import { OrderTrackingModal } from "./order-tracking-modal";
import { OrderCancelModal } from "./order-cancel-modal";

interface OrderDetailProps {
  id: string;
}

export function OrderDetail({ id }: OrderDetailProps) {
  const { user } = useAuth();
  const getOrderById = useOrdersStore((s) => s.getOrderById);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  // Find order scoped to the current user
  const currentUserId = user?.id || "u-user-1";
  const orderFromStore = getOrderById(id, currentUserId);
  const order =
    orderFromStore ||
    mockOrders.find(
      (o) => (o.id === id || o.orderNumber === id) && o.ownerId === currentUserId
    );

  if (!order) {
    return (
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-xs">
          <Link href="/account/orders">
            <ArrowRight className="h-4 w-4" />
            بازگشت به لیست سفارش‌ها
          </Link>
        </Button>
        <Card className="border-dashed border-border p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Package className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            سفارش مورد نظر یافت نشد
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            این سفارش وجود ندارد یا شما دسترسی لازم برای مشاهده آن را ندارید.
          </p>
          <Button asChild size="sm" className="mt-6 text-xs rounded-xl">
            <Link href="/account/orders">مشاهده همه سفارش‌های من</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Normalize items array
  const items: OrderItem[] =
    order.items && order.items.length > 0
      ? order.items
      : [
          {
            id: `item-${order.id}`,
            name: order.productName,
            image: order.productImage,
            stoneType: "سنگ طبیعی",
            quantity: 1,
            unit: "سفارش",
            unitPrice: order.total,
            totalPrice: order.total,
          },
        ];

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const statusMeta = orderStatusMeta[order.status];
  const orderNumber = order.orderNumber || order.id.replace("ord-c-", "ORD-");

  const formattedDate = new Date(order.date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const finalAmount = order.summary?.total ?? order.total;

  const canCancelOrReturn =
    order.status !== "cancelled" &&
    order.status !== "refunded" &&
    order.status !== "failed" &&
    order.status !== "sourcing_failed";

  const isDelivered =
    order.status === "delivered" ||
    order.status === "received" ||
    order.status === "completed";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-xs w-fit text-muted-foreground hover:text-foreground">
          <Link href="/account/orders">
            <ArrowRight className="h-4 w-4" />
            بازگشت به تاریخچه سفارش‌ها
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tracking button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setTrackingOpen(true)}
            className="gap-1.5 text-xs rounded-xl"
          >
            <Truck className="h-3.5 w-3.5" />
            رهگیری بارنامه
          </Button>

          {/* Print button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 text-xs rounded-xl"
          >
            <Printer className="h-3.5 w-3.5" />
            چاپ فاکتور
          </Button>

          {/* Cancellation or Return */}
          {canCancelOrReturn && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCancelOpen(true)}
              className="gap-1.5 text-xs text-muted-foreground hover:text-destructive rounded-xl"
            >
              {isDelivered ? (
                <>
                  <RotateCcw className="h-3.5 w-3.5" />
                  اعلام مغایرت یا مرجوعی
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5" />
                  لغو سفارش
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Banner Card */}
      <Card className="overflow-hidden border-border shadow-xs">
        <div className="border-b border-border bg-secondary/30 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs text-muted-foreground">شماره فاکتور سفارش:</span>
                <span className="font-mono text-base font-bold text-foreground sm:text-lg">
                  {orderNumber}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${
                    statusMeta?.badgeClass ?? "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <span className="me-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                  {orderStatusLabel[order.status]}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>ثبت شده در: {formattedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>کارخانه تأمین‌کننده: {order.tenantName}</span>
                </div>
              </div>
            </div>

            <div className="text-start sm:text-end">
              <div className="text-xs text-muted-foreground">مبلغ نهایی فاکتور</div>
              <div className="text-xl font-bold tabular-nums text-primary sm:text-2xl">
                {finalAmount.toLocaleString("fa-IR")}{" "}
                <span className="text-xs font-normal text-muted-foreground">تومان</span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-5 sm:p-6 space-y-6">
          {/* 1. Stone Production & Shipping Timeline */}
          <OrderTimeline
            status={order.status}
            timelineStep={order.timelineStep}
          />

          {/* 2. Order Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                اقلام سنگ فاکتور ({items.length.toLocaleString("fa-IR")} قلم، {totalItemCount.toLocaleString("fa-IR")} واحد)
              </h3>
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                <Link href="/account/documents">
                  <FileText className="me-1 h-3.5 w-3.5" />
                  گواهی‌های آنالیز سنگ
                </Link>
              </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-border">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="border-b border-border bg-secondary/50 text-muted-foreground">
                    <tr>
                      <th className="p-3 font-semibold text-start">شرح محصول سنگ</th>
                      <th className="p-3 font-semibold text-start">جنس و مشخصات</th>
                      <th className="p-3 font-semibold text-start">ابعاد و ضخامت</th>
                      <th className="p-3 font-semibold text-start">فرآوری سطح</th>
                      <th className="p-3 font-semibold text-center">متراژ / تعداد</th>
                      <th className="p-3 font-semibold text-end">قیمت فی</th>
                      <th className="p-3 font-semibold text-end">قیمت کل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 bg-card">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-secondary/30">
                        {/* Product Info */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-secondary">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground">{item.name}</p>
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                {item.grade && (
                                  <span className="text-primary font-medium">
                                    سورت {item.grade}
                                  </span>
                                )}
                                {item.sku && <span>کد: {item.sku}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Stone Type & Color */}
                        <td className="p-3 text-muted-foreground">
                          <div>
                            <span className="font-medium text-foreground">{item.stoneType}</span>
                            {item.stoneColor && (
                              <div className="text-[11px] text-muted-foreground">{item.stoneColor}</div>
                            )}
                          </div>
                        </td>

                        {/* Dimensions & Thickness */}
                        <td className="p-3 text-muted-foreground">
                          <div>
                            <span>{item.dimensions || "—"}</span>
                            {item.thickness && (
                              <div className="text-[11px] text-muted-foreground">
                                ضخامت: {item.thickness}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Finish */}
                        <td className="p-3 text-muted-foreground">
                          <span>{item.finish || "ساب صیقلی استاندارد"}</span>
                        </td>

                        {/* Quantity */}
                        <td className="p-3 text-center font-semibold tabular-nums text-foreground">
                          {item.quantity.toLocaleString("fa-IR")} {item.unit}
                        </td>

                        {/* Unit Price */}
                        <td className="p-3 text-end tabular-nums text-muted-foreground">
                          {item.unitPrice > 0
                            ? `${item.unitPrice.toLocaleString("fa-IR")} ت`
                            : "—"}
                        </td>

                        {/* Total Price */}
                        <td className="p-3 text-end font-bold tabular-nums text-foreground">
                          {item.totalPrice.toLocaleString("fa-IR")} تومان
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 3. Logistics & Site Details Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Delivery Details */}
            <div className="space-y-3 rounded-xl border border-border bg-secondary/20 p-4 text-xs">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>محل پروژه و شرایط تحویل بار</span>
              </div>

              <div className="space-y-2 text-muted-foreground">
                <div>
                  <span className="text-muted-foreground">نشانی تحویل: </span>
                  <span className="font-medium text-foreground">
                    {order.delivery?.address || "ثبت در سامانه ترابری"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-muted-foreground">تحویل‌گیرنده در کارگاه: </span>
                    <span className="font-medium text-foreground">
                      {order.delivery?.receiverName || "مشتری گرامی"}
                    </span>
                  </div>
                  {order.delivery?.receiverPhone && (
                    <div className="flex items-center gap-1 text-primary">
                      <Phone className="h-3 w-3" />
                      <span dir="ltr">{order.delivery.receiverPhone}</span>
                    </div>
                  )}
                </div>

                {/* Crane and Forklift */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {order.delivery?.craneAccess && (
                    <Badge variant="outline" className="border-border bg-secondary/50 text-foreground">
                      دسترسی جرثقیل در پروژه مهیا است
                    </Badge>
                  )}
                  {order.delivery?.forkliftAccess && (
                    <Badge variant="outline" className="border-border bg-secondary/50 text-foreground">
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
                  <div className="rounded-lg border border-border/70 bg-secondary/40 p-2.5 text-[11px] leading-relaxed text-foreground/90">
                    <span className="font-semibold text-foreground">توضیحات تخلیه: </span>
                    {order.delivery.deliveryNotes}
                  </div>
                )}
              </div>
            </div>

            {/* Freight & Carrier info */}
            <div className="space-y-3 rounded-xl border border-border bg-secondary/20 p-4 text-xs">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Truck className="h-4 w-4 text-primary" />
                <span>مشخصات ناوگان ترابری و بسته‌بندی سنگ</span>
              </div>

              <div className="space-y-2 text-muted-foreground">
                <div>
                  <span className="text-muted-foreground">نوع بسته‌بندی: </span>
                  <span className="font-medium text-foreground">
                    {order.packaging || "پالت چوبی استاندارد تقویت‌شده"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground">روش حمل بار: </span>
                  <span className="font-medium text-foreground">
                    {order.shippingMethod || "کامیون کفی مجهز به مهاربند سنگ"}
                  </span>
                </div>

                {order.freightBillNumber && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">شماره بارنامه: </span>
                    <span className="font-mono font-bold text-foreground">
                      {order.freightBillNumber}
                    </span>
                    {order.delivery?.carrier && (
                      <span className="text-muted-foreground">({order.delivery.carrier})</span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">موعد تحویل تقریبی: </span>
                  <span className="font-medium text-foreground">
                    {order.estimatedDeliveryDate || "طبق هماهنگی با باربری"}
                  </span>
                </div>

                {order.estimatedPrepTime && (
                  <div className="text-[11px] text-muted-foreground">
                    زمان آماده‌سازی در کارخانه: {order.estimatedPrepTime}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Financial Breakdown Table */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h4 className="text-xs font-semibold text-foreground mb-4">
              ریز صورت‌حساب مالی سفارش سنگ
            </h4>

            <div className="max-w-md ms-auto space-y-2.5 text-xs">
              {order.summary ? (
                <>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>جمع اقلام سنگ:</span>
                    <span className="font-semibold tabular-nums text-foreground">
                      {order.summary.subtotal.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>کرایه حمل و باربری اختصاصی:</span>
                    <span className="font-semibold tabular-nums text-foreground">
                      {order.summary.shippingCost.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>

                  {(order.summary.discount ?? 0) > 0 && (
                    <div className="flex items-center justify-between text-foreground">
                      <span className="text-muted-foreground">تخفیف ویژه کارخانه:</span>
                      <span className="font-semibold tabular-nums text-primary">
                        -{(order.summary.discount ?? 0).toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>مالیات و ارزش افزوده:</span>
                    <span className="font-semibold tabular-nums text-foreground">
                      {(order.summary.tax ?? 0).toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>مبلغ پایه سفارش:</span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {order.total.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              )}

              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between text-sm sm:text-base font-bold text-foreground">
                  <span>مبلغ کل پرداخت‌شده:</span>
                  <span className="text-primary tabular-nums">
                    {finalAmount.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Modals */}
      <OrderTrackingModal
        order={order}
        open={trackingOpen}
        onOpenChange={setTrackingOpen}
      />

      <OrderCancelModal
        order={order}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
      />
    </div>
  );
}
