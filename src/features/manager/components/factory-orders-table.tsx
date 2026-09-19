"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Clock, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FactoryOrder } from "../types";

const STATUS_CONFIG: Record<
  FactoryOrder["status"],
  { label: string; badgeClass: string }
> = {
  sourcing: {
    label: "تأمین کوپ خام",
    badgeClass: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  },
  cutting: {
    label: "برش اسلب / تایل",
    badgeClass: "bg-sky-500/15 text-sky-700 border-sky-500/30",
  },
  processing_surface: {
    label: "ساب و رزین نانو",
    badgeClass: "bg-purple-500/15 text-purple-700 border-purple-500/30",
  },
  ready_to_ship: {
    label: "آماده بارگیری",
    badgeClass: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  },
  shipping: {
    label: "در حال حمل با تریلی",
    badgeClass: "bg-primary/15 text-primary border-primary/30",
  },
  delivered: {
    label: "تحویل کارگاه شد",
    badgeClass: "bg-secondary text-secondary-foreground border-border",
  },
  cancelled: {
    label: "لغو شده",
    badgeClass: "bg-destructive/15 text-destructive border-destructive/30",
  },
};

export function FactoryOrdersTable({ orders }: { orders: FactoryOrder[] }) {
  return (
    <Card className="border border-border/80 bg-card shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            آخرین سفارش‌های دریافتی کارخانه
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            سفارشات جاری ثبت‌شده توسط پیمانکاران، معماران و مشتریان
          </CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
          <Link href="/dashboard/orders">
            <span>مشاهده همه سفارش‌ها</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="pb-3 pe-4 text-start font-medium">مشخصات سنگ و سفارش</th>
                <th className="pb-3 px-3 text-start font-medium">خریدار / پروژه</th>
                <th className="pb-3 px-3 text-start font-medium">ابعاد و ضخامت</th>
                <th className="pb-3 px-3 text-start font-medium">حجم / متراژ</th>
                <th className="pb-3 px-3 text-start font-medium">مبلغ کل</th>
                <th className="pb-3 px-3 text-start font-medium">وضعیت تولید</th>
                <th className="pb-3 ps-3 text-end font-medium">اقدام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {orders.map((order) => {
                const statusMeta =
                  STATUS_CONFIG[order.status] ?? {
                    label: order.statusLabel,
                    badgeClass: "bg-secondary text-secondary-foreground",
                  };

                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-secondary/40 group"
                  >
                    {/* Stone Name & Thumbnail */}
                    <td className="py-3 pe-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="h-11 w-11 shrink-0 rounded-lg border border-border/70 object-cover"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-foreground truncate max-w-56">
                              {order.productName}
                            </p>
                            {order.isUrgent && (
                              <span className="inline-flex items-center gap-0.5 rounded px-1 py-0.2 text-[10px] font-bold bg-destructive/10 text-destructive">
                                <AlertCircle className="h-2.5 w-2.5" />
                                فوری
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5" dir="ltr">
                            {order.orderNumber}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer Name */}
                    <td className="py-3 px-3">
                      <p className="font-medium text-foreground truncate max-w-44">
                        {order.customerName}
                      </p>
                      {order.customerPhone && (
                        <p className="text-[11px] text-muted-foreground font-mono" dir="ltr">
                          {order.customerPhone}
                        </p>
                      )}
                    </td>

                    {/* Dimensions & Thickness */}
                    <td className="py-3 px-3">
                      <span className="inline-block rounded bg-secondary/80 px-2 py-0.5 text-[11px] text-foreground font-medium">
                        {order.dimensions}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        ضخامت: {order.thickness}
                      </p>
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-3 font-semibold text-foreground tabular-nums">
                      {order.volume}
                    </td>

                    {/* Total Price */}
                    <td className="py-3 px-3 font-bold text-foreground tabular-nums">
                      {order.totalPrice.toLocaleString("fa-IR")} تومان
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold border ${statusMeta.badgeClass}`}
                      >
                        {statusMeta.label}
                      </Badge>
                    </td>

                    {/* Action */}
                    <td className="py-3 ps-3 text-end">
                      <Button asChild variant="outline" size="sm" className="h-7 text-[11px]">
                        <Link href={`/dashboard/orders/${order.id}`}>
                          جزئیات
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    سفارش فعالی برای این کارخانه ثبت نشده است.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
