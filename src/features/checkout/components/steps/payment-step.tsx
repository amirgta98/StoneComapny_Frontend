"use client";

import {
  CreditCard,
  Building2,
  BadgeDollarSign,
  ShieldCheck,
  Lock,
  Check,
  Copy,
  CheckCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  PAYMENT_METHODS,
  ONLINE_GATEWAYS,
} from "../../constants/payment-methods";
import type {
  PaymentMethodType,
  PaymentGatewayId,
  ShippingMethod,
} from "../../types";

interface PaymentStepProps {
  selectedPaymentMethod: PaymentMethodType;
  onSelectPaymentMethod: (method: PaymentMethodType) => void;
  selectedGateway: PaymentGatewayId;
  onSelectGateway: (gateway: PaymentGatewayId) => void;
  agreedTerms: boolean;
  onAgreedTermsChange: (agreed: boolean) => void;
  selectedShippingMethod?: ShippingMethod;
}

const PAYMENT_ICONS = {
  CreditCard,
  Building2,
  BadgeDollarSign,
};

export function PaymentStep({
  selectedPaymentMethod,
  onSelectPaymentMethod,
  selectedGateway,
  onSelectGateway,
  agreedTerms,
  onAgreedTermsChange,
  selectedShippingMethod,
}: PaymentStepProps) {
  const [copiedIban, setCopiedIban] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIban(true);
    toast.success("شماره شبا در حافظه کپی شد");
    setTimeout(() => setCopiedIban(false), 2500);
  };

  const isWarehousePickup = selectedShippingMethod?.id === "factory_pickup";

  return (
    <section aria-labelledby="payment-step-heading" className="space-y-6">
      <div>
        <h2
          id="payment-step-heading"
          className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2"
        >
          <CreditCard className="h-5 w-5 text-primary" aria-hidden="true" />
          <span>مرحله چهارم: انتخاب شیوه پرداخت و تسویه حساب</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          روش تسویه مالی سفارش سنگ خود را انتخاب نمایید.
        </p>
      </div>

      {/* Payment Methods Selection */}
      <div className="space-y-3.5" role="radiogroup" aria-label="روش‌های پرداخت">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = method.id === selectedPaymentMethod;
          const Icon = PAYMENT_ICONS[method.icon as keyof typeof PAYMENT_ICONS] || CreditCard;

          // On-delivery is only enabled if factory pickup is chosen
          const isDisabled = method.id === "on_delivery" && !isWarehousePickup;

          return (
            <div
              key={method.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={isDisabled ? -1 : 0}
              onClick={() => {
                if (!isDisabled) onSelectPaymentMethod(method.id);
              }}
              onKeyDown={(e) => {
                if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onSelectPaymentMethod(method.id);
                }
              }}
              className={cn(
                "group relative rounded-2xl border p-4 sm:p-5 transition-all text-start outline-none",
                isDisabled
                  ? "opacity-50 cursor-not-allowed border-border/50 bg-muted/20"
                  : isSelected
                  ? "cursor-pointer border-primary bg-primary/[0.03] shadow-xs ring-2 ring-primary/20"
                  : "cursor-pointer border-border bg-card hover:border-border/80 hover:bg-secondary/20"
              )}
            >
              <div className="flex items-start gap-3.5">
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

                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-sm sm:text-base text-foreground">
                      {method.title}
                    </span>
                    {method.badge && (
                      <Badge variant="outline" className="border-border text-[11px] font-normal">
                        {method.badge}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {method.description}
                  </p>

                  {/* Online Payment Gateway Picker */}
                  {isSelected && method.id === "online" && (
                    <div className="mt-4 pt-3.5 border-t border-border/70 space-y-3">
                      <Label className="text-xs font-semibold text-foreground">
                        انتخاب درگاه بانکی شاپرک:
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {ONLINE_GATEWAYS.map((gateway) => {
                          const isGatewayActive = selectedGateway === gateway.id;
                          return (
                            <button
                              key={gateway.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectGateway(gateway.id);
                              }}
                              className={cn(
                                "flex flex-col items-start p-3 rounded-xl border transition-all text-start",
                                isGatewayActive
                                  ? "border-primary bg-background shadow-xs ring-1 ring-primary"
                                  : "border-border bg-secondary/30 hover:bg-secondary/60"
                              )}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <div
                                  className={cn(
                                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px]",
                                    isGatewayActive
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-muted-foreground/40 bg-background"
                                  )}
                                >
                                  {isGatewayActive && <Check className="h-2.5 w-2.5" />}
                                </div>
                                <span className="text-xs font-bold text-foreground">
                                  {gateway.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-muted-foreground mt-1 ps-6 line-clamp-1">
                                {gateway.description}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Details Box */}
                  {isSelected && method.id === "bank_transfer" && (
                    <div className="mt-4 pt-3.5 border-t border-border/70 rounded-xl bg-secondary/30 p-4 space-y-2.5 text-xs text-muted-foreground">
                      <div className="font-semibold text-foreground">
                        اطلاعات حساب رسمی واریز شرکت:
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-background p-2.5 rounded-lg border border-border">
                        <span className="font-mono text-xs sm:text-sm text-foreground tracking-wider" dir="ltr">
                          IR98 0120 0000 0000 1234 5678 90
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard("IR980120000000001234567890");
                          }}
                          className="flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                        >
                          {copiedIban ? (
                            <>
                              <CheckCheck className="h-3.5 w-3.5" />
                              <span>کپی شد</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>کپی شماره شبا</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        بنام: شرکت بازرگانی و صنایع سنگ ایرانیان — بانک تجارت شعبه مرکزی.
                        پس از ثبت سفارش، فاکتور معتبر شرکتی صادر و هماهنگی جهت ارسال حواله انجام می‌شود.
                      </p>
                    </div>
                  )}

                  {isDisabled && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 pt-1">
                      پرداخت در محل فقط در صورت انتخاب روش ارسال «تحویل حضوری در انبار کارخانه» امکان‌پذیر است.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Guarantees Trust Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card text-xs">
          <Lock className="h-5 w-5 text-primary shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-foreground block">پرداخت امن شاپرک</span>
            <span className="text-muted-foreground text-[11px]">رمزنگاری SSL ۲۵۶ بیتی</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card text-xs">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-foreground block">ضمانت سلامت فیزیکی</span>
            <span className="text-muted-foreground text-[11px]">بیمه کامل باربری سنگ</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card text-xs">
          <Building2 className="h-5 w-5 text-primary shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-foreground block">فاکتور رسمی شرکتی</span>
            <span className="text-muted-foreground text-[11px]">مورد تایید سازمان امور مالیاتی</span>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Agreement */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => onAgreedTermsChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-background"
          />
          <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            قوانین و مقررات خرید سنگ، ضوابط تخلیه کارگاهی باربری و شرایط بازگشت کالا را مطالعه نموده و می‌پذیرم.
          </span>
        </label>
      </div>
    </section>
  );
}
