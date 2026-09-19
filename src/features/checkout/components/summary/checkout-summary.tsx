"use client";

import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  Lock,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CouponInput } from "./coupon-input";
import type { CartItem } from "@/stores/cart-store";
import type { CheckoutCalculation, CheckoutStep } from "../../types";
import { formatPrice } from "@/features/products/lib/product-price";

interface CheckoutSummaryProps {
  items?: CartItem[];
  calculation: CheckoutCalculation;
  currentStep: CheckoutStep;
  appliedCoupon?: string;
  onApplyCoupon: (code: string) => Promise<boolean | void> | boolean | void;
  onRemoveCoupon: () => void;
  onNextStep: () => void;
  onPrevStep?: () => void;
  isProcessing?: boolean;
  canProceed: boolean;
  proceedValidationMessage?: string;
}

export function CheckoutSummary({
  calculation,
  currentStep,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onNextStep,
  onPrevStep,
  isProcessing = false,
  canProceed,
  proceedValidationMessage,
}: CheckoutSummaryProps) {
  const isFinalPaymentStep = currentStep === "payment";

  const getButtonText = () => {
    switch (currentStep) {
      case "address":
        return "ثبت آدرس و ادامه به روش ارسال";
      case "shipping":
        return "تایید روش ارسال و بررسی اقلام";
      case "review":
        return "تایید نهایی و ورود به مرحله پرداخت";
      case "payment":
        return "پرداخت و ثبت نهایی سفارش";
    }
  };

  return (
    <aside aria-labelledby="order-summary-heading" className="w-full">
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-5 sticky top-24">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h3 id="order-summary-heading" className="text-base font-bold text-foreground">
            خلاصه مالی سفارش
          </h3>
          <Badge variant="secondary" className="text-xs font-normal font-mono">
            {calculation.itemsCount.toLocaleString("fa-IR")} قلم کالا
          </Badge>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 text-xs sm:text-sm">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-muted-foreground">
            <span>مجموع قیمت اقلام</span>
            <span className="font-bold text-foreground tabular-nums">
              {formatPrice(calculation.subtotal)}{" "}
              <span className="text-[11px] font-normal text-muted-foreground">
                تومان
              </span>
            </span>
          </div>

          {/* Discount */}
          {calculation.discount > 0 && (
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1">
                <span>تخفیف اعمال‌شده</span>
                {appliedCoupon && (
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600">
                    {appliedCoupon}
                  </Badge>
                )}
              </span>
              <span className="font-bold tabular-nums">
                -{formatPrice(calculation.discount)}{" "}
                <span className="text-[11px] font-normal">تومان</span>
              </span>
            </div>
          )}

          {/* Shipping Fee */}
          <div className="flex items-center justify-between text-muted-foreground">
            <span>هزینه ترابری و باربری سنگ</span>
            {calculation.shippingFee === 0 ? (
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                رایگان
              </span>
            ) : (
              <span className="font-bold text-foreground tabular-nums">
                {formatPrice(calculation.shippingFee)}{" "}
                <span className="text-[11px] font-normal text-muted-foreground">
                  تومان
                </span>
              </span>
            )}
          </div>

          {/* Value Added Tax (if applicable) */}
          {calculation.tax > 0 && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span>مالیات بر ارزش افزوده (۹٪)</span>
              <span className="font-bold text-foreground tabular-nums">
                {formatPrice(calculation.tax)}{" "}
                <span className="text-[11px] font-normal text-muted-foreground">
                  تومان
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Coupon Code Section */}
        <Separator className="bg-border/70" />
        <div className="space-y-2">
          <span className="text-xs font-medium text-foreground block">
            کد تخفیف یا کارت هدیه:
          </span>
          <CouponInput
            appliedCoupon={appliedCoupon}
            onApplyCoupon={onApplyCoupon}
            onRemoveCoupon={onRemoveCoupon}
            disabled={isProcessing}
          />
        </div>

        {/* Grand Total */}
        <Separator className="bg-border/70" />
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-sm sm:text-base font-bold text-foreground">
              مبلغ نهایی قابل پرداخت:
            </span>
            <div className="text-end">
              <span className="text-lg sm:text-xl font-extrabold text-primary tabular-nums">
                {formatPrice(calculation.total)}
              </span>
              <span className="ms-1.5 text-xs text-muted-foreground font-normal">
                تومان
              </span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground text-start">
            شامل کلیه هزینه‌های بارگیری، بسته‌بندی پالت چوبی و بیمه ترابری
          </p>
        </div>

        {/* Proceed Action Button */}
        <div className="space-y-2 pt-2">
          <Button
            type="button"
            size="lg"
            disabled={!canProceed || isProcessing}
            onClick={onNextStep}
            className="w-full h-12 text-sm sm:text-base font-bold gap-2 shadow-xs transition-all duration-200"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>در حال انتقال...</span>
              </>
            ) : isFinalPaymentStep ? (
              <>
                <Lock className="h-4 w-4" />
                <span>{getButtonText()}</span>
              </>
            ) : (
              <>
                <span>{getButtonText()}</span>
                <ChevronLeft className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Back Step Action */}
          {onPrevStep && currentStep !== "address" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isProcessing}
              onClick={onPrevStep}
              className="w-full text-xs text-muted-foreground hover:text-foreground h-8"
            >
              <ArrowRight className="h-3.5 w-3.5 me-1" />
              <span>بازگشت به مرحله قبل</span>
            </Button>
          )}

          {/* Validation Warning */}
          {!canProceed && proceedValidationMessage && (
            <p className="text-xs text-destructive text-center leading-relaxed pt-1">
              {proceedValidationMessage}
            </p>
          )}
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-muted-foreground border-t border-border/60">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>تضمین اصالت سنگ، گارانتی سلامت تحویل بار و تسویه امن شاپرک</span>
        </div>
      </div>
    </aside>
  );
}
