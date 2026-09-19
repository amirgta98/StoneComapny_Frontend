"use client";

import Link from "next/link";
import {
  FileCheck,
  MapPin,
  Truck,
  ImageOff,
  User,
  Phone,
  MessageSquare,
  Edit2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/stores/cart-store";
import type { CustomerAddress } from "@/features/account/types/address";
import type { ShippingMethod, CheckoutStep } from "../../types";
import { formatPrice } from "@/features/products/lib/product-price";

interface ReviewStepProps {
  items: CartItem[];
  selectedAddress?: CustomerAddress;
  selectedShippingMethod?: ShippingMethod;
  notes: string;
  onNotesChange: (notes: string) => void;
  onNavigateToStep: (step: CheckoutStep) => void;
}

export function ReviewStep({
  items,
  selectedAddress,
  selectedShippingMethod,
  notes,
  onNotesChange,
  onNavigateToStep,
}: ReviewStepProps) {
  return (
    <section aria-labelledby="review-step-heading" className="space-y-6">
      <div>
        <h2
          id="review-step-heading"
          className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2"
        >
          <FileCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          <span>مرحله سوم: بازبینی نهایی اقلام سفارش و آدرس</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          مشخصات سفارش، اقلام سنگ ساختمانی، متراژها و آدرس باربری را بررسی فرمایید.
        </p>
      </div>

      {/* Ordered Items List */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            اقلام سفارش ({items.length.toLocaleString("fa-IR")} محصول)
          </h3>
          <span className="text-xs text-muted-foreground">
            مجموع قطعات/متراژ:{" "}
            <strong className="text-foreground">
              {items.reduce((s, i) => s + i.quantity, 0).toLocaleString("fa-IR")}
            </strong>
          </span>
        </div>

        <ul className="divide-y divide-border/60">
          {items.map((item, index) => {
            const lineTotal = (item.price ?? 0) * item.quantity;
            return (
              <li
                key={`${item.productId}-${item.variantId || index}`}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Link
                      href={`/stones/${item.slug}`}
                      className="text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="border-border bg-secondary/40 text-[11px] font-normal">
                        واحد: {item.unit || "متر مربع"}
                      </Badge>
                      <span>
                        تعداد / متراژ:{" "}
                        <strong className="text-foreground font-mono">
                          {item.quantity.toLocaleString("fa-IR")}
                        </strong>
                      </span>
                    </div>

                    {item.price !== undefined && (
                      <div className="text-xs text-muted-foreground tabular-nums">
                        قیمت واحد: {formatPrice(item.price)} تومان
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:text-end shrink-0 ps-19 sm:ps-0">
                  <div className="font-bold text-sm sm:text-base text-foreground tabular-nums">
                    {formatPrice(lineTotal)}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      تومان
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block">
                    مبلغ ردیف
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logistics & Destination Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selected Address Card */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-2.5 shadow-xs relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>محل تحویل و تخلیه بار</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onNavigateToStep("address")}
              className="h-7 gap-1 text-xs text-primary hover:text-primary"
            >
              <Edit2 className="h-3 w-3" />
              <span>تغییر</span>
            </Button>
          </div>

          {selectedAddress ? (
            <div className="space-y-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <div className="font-semibold text-foreground">
                {selectedAddress.title}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-foreground font-medium">
                  <User className="h-3 w-3 text-muted-foreground" />
                  {selectedAddress.firstName} {selectedAddress.lastName}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  {selectedAddress.phone}
                </span>
              </div>
              <p>
                {selectedAddress.province}، {selectedAddress.city}، {selectedAddress.address}، پلاک {selectedAddress.plaque}
                {selectedAddress.unit ? `، واحد ${selectedAddress.unit}` : ""}
              </p>
              <div className="pt-1 text-[11px] font-mono text-muted-foreground">
                کد پستی: {selectedAddress.postalCode}
              </div>
            </div>
          ) : (
            <p className="text-xs text-destructive">آدرسی انتخاب نشده است.</p>
          )}
        </div>

        {/* Selected Shipping Card */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-2.5 shadow-xs relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Truck className="h-4 w-4 text-primary" />
              <span>شیوه ترابری بار</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onNavigateToStep("shipping")}
              className="h-7 gap-1 text-xs text-primary hover:text-primary"
            >
              <Edit2 className="h-3 w-3" />
              <span>تغییر</span>
            </Button>
          </div>

          {selectedShippingMethod ? (
            <div className="space-y-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <span>{selectedShippingMethod.name}</span>
                {selectedShippingMethod.price === 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    رایگان
                  </Badge>
                )}
              </div>
              <p>{selectedShippingMethod.description}</p>
              <div className="flex items-center gap-1 pt-1 text-xs text-foreground font-medium">
                <span>زمان تخمینی تحویل:</span>
                <span>{selectedShippingMethod.estimatedDays}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-destructive">روش ارسالی انتخاب نشده است.</p>
          )}
        </div>
      </div>

      {/* Customer Order Notes */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-3 shadow-xs">
        <Label htmlFor="order-notes" className="text-sm font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span>توضیحات و هماهنگی‌های کارگاهی (اختیاری)</span>
        </Label>
        <Textarea
          id="order-notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="در صورت وجود شرایط خاص تخلیه، محدودیت تردد تریلی در خیابان، هماهنگی با مهندس ناظر یا نگهبان پروژه بنویسید..."
          rows={3}
          className="text-xs sm:text-sm bg-background border-border resize-none leading-relaxed"
        />
        <p className="text-[11px] text-muted-foreground">
          این یادداشت‌ها مستقیماً بر روی حواله باربری و کارشناس لجستیک کارخانه درج خواهد شد.
        </p>
      </div>
    </section>
  );
}
