"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Building2,
  Calendar,
  Hash,
  Truck,
  Package,
  FileText,
  MapPin,
  Clock,
  Phone,
  Receipt,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CustomerOrder, OrderItem } from "../../data/mock-data";
import {
  orderStatusLabel,
  orderStatusMeta,
} from "../../data/mock-data";
import { OrderTimeline } from "./order-timeline";
import { OrderProductRow } from "./order-product-row";
import { OrderTrackingModal } from "./order-tracking-modal";
import { OrderCancelModal } from "./order-cancel-modal";

interface OrderAccordionItemProps {
  order: CustomerOrder;
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function OrderAccordionItem({
  order,
  defaultExpanded = false,
  isExpanded,
  onToggle,
}: OrderAccordionItemProps) {
  const [internalOpen, setInternalOpen] = useState(defaultExpanded);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const isOpen = isExpanded !== undefined ? isExpanded : internalOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  // Normalize items array in case legacy order object only had productName / productImage
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

  // Persian formatted order date
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

  return (
    <>
      <div
        className={cn(
          "overflow-hidden rounded-2xl border bg-card transition-all duration-200",
          isOpen
            ? "border-border shadow-md"
            : "border-border/80 shadow-xs hover:border-border hover:shadow-sm"
        )}
      >
        {/* Accordion Header */}
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-controls={`order-panel-${order.id}`}
          className="w-full text-start transition-colors hover:bg-secondary/30"
        >
          <div className="p-4 sm:p-5">
            <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
              {/* Top / Right Block: Order Metadata & Status */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {/* Order Number */}
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Hash className="h-4 w-4 text-primary" />
                  <span className="font-mono text-sm sm:text-base">{orderNumber}</span>
                </div>

                {/* Status Badge */}
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
                    statusMeta?.badgeClass ?? "bg-secondary text-secondary-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "me-1.5 h-1.5 w-1.5 rounded-full bg-current",
                      statusMeta?.category === "processing" && "animate-pulse"
                    )}
                  />
                  {orderStatusLabel[order.status] ?? order.status}
                </span>

                {/* Products count pill */}
                <Badge
                  variant="outline"
                  className="border-border/70 bg-secondary/40 text-xs font-normal text-muted-foreground"
                >
                  <Package className="me-1 h-3 w-3" />
                  <span>
                    {items.length.toLocaleString("fa-IR")} قلم محصول ({totalItemCount.toLocaleString("fa-IR")} واحد)
                  </span>
                </Badge>

                {/* Date */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{formattedDate}</span>
                </div>

                {/* Tenant / Factory */}
                <div className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{order.tenantName}</span>
                </div>
              </div>

              {/* Bottom / Left Block: Price, Item Thumbnails & Chevron */}
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/50 sm:justify-end lg:border-t-0 lg:pt-0">
                {/* Compact thumbnail previews (visible on larger screens) */}
                <div className="hidden items-center -space-x-2 space-x-reverse sm:flex">
                  {items.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="relative h-9 w-9 overflow-hidden rounded-md border-2 border-background bg-secondary shadow-xs"
                      title={item.name}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-background bg-secondary text-[10px] font-semibold text-foreground shadow-xs">
                      +{(items.length - 3).toLocaleString("fa-IR")}
                    </div>
                  )}
                </div>

                {/* Total Price */}
                <div className="text-start sm:text-end">
                  <div className="text-[11px] text-muted-foreground">مبلغ نهایی سفارش</div>
                  <div className="text-base font-bold tabular-nums text-foreground sm:text-lg">
                    {finalAmount.toLocaleString("fa-IR")}{" "}
                    <span className="text-xs font-medium text-muted-foreground">تومان</span>
                  </div>
                </div>

                {/* Expand/Collapse Chevron Indicator */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-transform duration-300",
                    isOpen && "rotate-180 bg-primary/10 text-primary"
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </button>

        {/* Accordion Body (Collapsible) */}
        <div
          id={`order-panel-${order.id}`}
          role="region"
          aria-labelledby={`order-header-${order.id}`}
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="border-t border-border/80 bg-secondary/15 p-4 space-y-6 sm:p-6">
              {/* 1. Production & Shipping Lifecycle Timeline */}
              <OrderTimeline
                status={order.status}
                timelineStep={order.timelineStep}
              />

              {/* 2. Order Products List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">
                    اقلام سفارش سنگ ({items.length.toLocaleString("fa-IR")} مورد)
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    تأمین‌کننده: {order.tenantName}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {items.map((item) => (
                    <OrderProductRow key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* 3. Logistics, Freight & Packaging Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Delivery & Address */}
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>اطلاعات مقصد و تخلیه بار</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground">نشانی پروژه: </span>
                      <span>{order.delivery?.address || "ثبت در سامانه ترابری"}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <div>
                        <span>تحویل‌گیرنده: </span>
                        <span className="font-medium text-foreground">
                          {order.delivery?.receiverName || "مشتری گرامی"}
                        </span>
                      </div>
                      {order.delivery?.receiverPhone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span dir="ltr">{order.delivery.receiverPhone}</span>
                        </div>
                      )}
                    </div>

                    {/* Crane & Forklift Specifications */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {order.delivery?.craneAccess && (
                        <Badge
                          variant="outline"
                          className="bg-secondary/60 text-foreground border-border text-[11px]"
                        >
                          دسترسی جرثقیل در پروژه
                        </Badge>
                      )}
                      {order.delivery?.forkliftAccess && (
                        <Badge
                          variant="outline"
                          className="bg-secondary/60 text-foreground border-border text-[11px]"
                        >
                          دسترسی لیفتراک کارگاهی
                        </Badge>
                      )}
                      {order.delivery?.floor && (
                        <span className="text-[11px] text-muted-foreground">
                          محل تخلیه: {order.delivery.floor}
                        </span>
                      )}
                    </div>

                    {order.delivery?.deliveryNotes && (
                      <div className="rounded-lg border border-border/60 bg-secondary/40 p-2.5 text-[11px] leading-relaxed text-foreground/90">
                        <span className="font-medium">توضیحات تخلیه: </span>
                        {order.delivery.deliveryNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping & Packaging */}
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-primary" />
                      <span>ترابری و بسته‌بندی سنگ</span>
                    </div>

                    {(order.freightBillNumber || order.delivery?.trackingNumber) && (
                      <button
                        type="button"
                        onClick={() => setTrackingOpen(true)}
                        className="text-[11px] font-medium text-primary hover:underline"
                      >
                        رهگیری باربری
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-start gap-1.5">
                      <span className="shrink-0 font-medium text-foreground">نوع بسته‌بندی:</span>
                      <span>{order.packaging || "پالت چوبی تقویت‌شده استاندارد"}</span>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <span className="shrink-0 font-medium text-foreground">روش حمل:</span>
                      <span>{order.shippingMethod || "کامیون کفی مجهز به مهاربار"}</span>
                    </div>

                    {order.freightBillNumber && (
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground">شماره بارنامه:</span>
                        <span className="font-mono font-medium text-foreground">{order.freightBillNumber}</span>
                        {order.delivery?.carrier && (
                          <span className="text-muted-foreground">({order.delivery.carrier})</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground">موعد تحویل تقریبی:</span>
                      <span>{order.estimatedDeliveryDate || "طبق هماهنگی با باربری"}</span>
                    </div>

                    {order.estimatedPrepTime && (
                      <div className="text-[11px] text-muted-foreground">
                        مدت آماده‌سازی در کارخانه: {order.estimatedPrepTime}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Financial Summary & Actions */}
              <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-secondary/35 p-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Financial Breakdown */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                  {order.summary && (
                    <>
                      <div>
                        <span className="text-muted-foreground">جمع اقلام: </span>
                        <span className="font-medium tabular-nums text-foreground">
                          {order.summary.subtotal.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>

                      {order.summary.shippingCost > 0 && (
                        <div>
                          <span className="text-muted-foreground">هزینه حمل و باربری: </span>
                          <span className="font-medium tabular-nums text-foreground">
                            {order.summary.shippingCost.toLocaleString("fa-IR")} تومان
                          </span>
                        </div>
                      )}

                      {(order.summary.discount ?? 0) > 0 && (
                        <div className="text-foreground">
                          <span className="text-muted-foreground">تخفیف: </span>
                          <span className="font-medium tabular-nums text-primary">
                            -{(order.summary.discount ?? 0).toLocaleString("fa-IR")} تومان
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <span className="font-medium text-foreground">مبلغ کل پرداختی: </span>
                    <span className="text-sm font-bold tabular-nums text-primary sm:text-base">
                      {finalAmount.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Tracking Button */}
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

                  {/* Order Details & Full Invoice */}
                  <Button asChild variant="default" size="sm" className="gap-1.5 text-xs rounded-xl">
                    <Link href={`/account/orders/${order.id}`}>
                      <Receipt className="h-3.5 w-3.5" />
                      مشاهده فاکتور و جزئیات
                    </Link>
                  </Button>

                  {/* Certificate & Stone Analysis */}
                  <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground rounded-xl">
                    <Link href="/account/documents">
                      <FileText className="h-3.5 w-3.5" />
                      آنالیز سنگ
                    </Link>
                  </Button>

                  {/* Cancel / Return Button */}
                  {canCancelOrReturn && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCancelOpen(true)}
                      className="gap-1.5 text-xs text-muted-foreground hover:text-destructive rounded-xl"
                    >
                      {isDelivered ? (
                        <>
                          <RotateCcw className="h-3.5 w-3.5" />
                          درخواست مرجوعی
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
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
}
