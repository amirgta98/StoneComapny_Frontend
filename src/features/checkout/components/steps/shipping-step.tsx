"use client";

import {
  Truck,
  Package,
  Zap,
  Warehouse,
  Check,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STONE_SHIPPING_METHODS } from "../../constants/shipping-methods";
import type { ShippingMethod } from "../../types";
import type { CustomerAddress } from "@/features/account/types/address";
import { formatPrice } from "@/features/products/lib/product-price";

interface ShippingStepProps {
  selectedShippingMethodId: string;
  onSelectShippingMethod: (method: ShippingMethod) => void;
  selectedAddress?: CustomerAddress;
}

const ICONS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Truck,
  Package,
  Zap,
  Warehouse,
};

export function ShippingStep({
  selectedShippingMethodId,
  onSelectShippingMethod,
  selectedAddress,
}: ShippingStepProps) {
  return (
    <section aria-labelledby="shipping-step-heading" className="space-y-6">
      <div>
        <h2
          id="shipping-step-heading"
          className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2"
        >
          <Truck className="h-5 w-5 text-primary" aria-hidden="true" />
          <span>مرحله دوم: انتخاب شیوه حمل و ترابری سنگ</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          روش باربری متناسب با حجم بار و تجهیزات تخلیه کارگاهی پروژه را مشخص فرمایید.
        </p>
      </div>

      {/* Shipping Options */}
      <div className="space-y-3.5" role="radiogroup" aria-label="روش‌های ارسال">
        {STONE_SHIPPING_METHODS.map((method) => {
          const isSelected = method.id === selectedShippingMethodId;
          const Icon = ICONS_MAP[method.icon] || Truck;

          return (
            <div
              key={method.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelectShippingMethod(method)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectShippingMethod(method);
                }
              }}
              className={cn(
                "group relative cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all text-start outline-none",
                isSelected
                  ? "border-primary bg-primary/[0.03] shadow-xs ring-2 ring-primary/20"
                  : "border-border bg-card hover:border-border/80 hover:bg-secondary/20"
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                {/* Radio Circle & Title */}
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 bg-background group-hover:border-primary/50"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-sm sm:text-base text-foreground">
                        {method.name}
                      </span>
                      {method.badge && (
                        <Badge
                          variant={method.price === 0 ? "secondary" : "default"}
                          className="text-[11px] font-normal"
                        >
                          {method.badge}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                      {method.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span>مدت زمان تحویل:</span>
                        <strong className="text-foreground">{method.estimatedDays}</strong>
                      </span>

                      {method.carrier && (
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>ناوگان: {method.carrier}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="sm:text-end shrink-0 ps-8 sm:ps-0 pt-1 sm:pt-0">
                  {method.price === 0 ? (
                    <span className="inline-block font-bold text-base text-emerald-600 dark:text-emerald-400">
                      رایگان
                    </span>
                  ) : (
                    <div className="space-y-0.5">
                      <div className="font-bold text-base text-foreground tabular-nums">
                        {formatPrice(method.price)}
                        <span className="ms-1 text-xs font-normal text-muted-foreground">
                          تومان
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground block">
                        کرایه حمل باربری
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Unloading Equipment Compatibility Note */}
              {isSelected && selectedAddress && (
                <div className="mt-3.5 pt-3 border-t border-border/60 flex flex-wrap items-center gap-2 text-xs text-muted-foreground ps-8">
                  <span className="font-medium text-foreground">تطبیق کارگاهی آدرس:</span>
                  {selectedAddress.craneAccess && (
                    <Badge variant="outline" className="border-border text-[11px] bg-secondary/50">
                      پروژه دارای دسترسی جرثقیل
                    </Badge>
                  )}
                  {selectedAddress.hasFreightElevator && (
                    <Badge variant="outline" className="border-border text-[11px] bg-secondary/50">
                      پروژه دارای آسانسور باربر
                    </Badge>
                  )}
                  <span className="text-[11px] text-muted-foreground">
                    (تخلیه بار مطابق مشخصات آدرس هماهنگ خواهد شد)
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
