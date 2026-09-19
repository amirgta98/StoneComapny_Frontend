"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Lock,
  CreditCard,
  Clock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/stores";
import { checkoutService } from "@/features/checkout";
import { formatPrice } from "@/features/products/lib/product-price";
import { toast } from "sonner";

function PaymentGatewayInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);

  const orderId = searchParams.get("orderId") || "";
  const token = searchParams.get("token") || "";
  const gateway = searchParams.get("gateway") || "saman";
  const rawAmount = searchParams.get("amount") || "0";
  const amount = parseInt(rawAmount, 10) || 0;

  // Form inputs
  const [cardNumber, setCardNumber] = useState("6037-9975-1234-5678");
  const [cvv2, setCvv2] = useState("892");
  const [expMonth, setExpMonth] = useState("08");
  const [expYear, setExpYear] = useState("06");
  const [captcha, setCaptcha] = useState("4821");
  const [pin2, setPin2] = useState("12345");

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(599); // 10 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const handleSimulatePayment = async (status: "success" | "failed") => {
    if (!orderId || !token) {
      toast.error("اطلاعات جلسه پرداخت نامعتبر یا منقضی شده است.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await checkoutService.verifyPayment({
        orderId,
        paymentToken: token,
        gateway,
        cardPan: cardNumber ? `****-****-****-${cardNumber.slice(-4)}` : undefined,
        status,
      });

      if (status === "success") {
        // Clear customer cart upon verified payment
        clearCart();
        toast.success("پرداخت با موفقیت انجام شد");
        router.push(res.redirectUrl || `/checkout/success?orderId=${orderId}`);
      } else {
        toast.error("پرداخت لغو شد");
        router.push(res.redirectUrl || `/checkout/result?status=failed&orderId=${orderId}`);
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "خطا در تأیید تراکنش";
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 py-8 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl space-y-4">
        {/* Gateway Header Banner */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold shadow-xs">
              شاپرک
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">
                سامانه پرداخت الکترونیک شاپرک
              </h1>
              <p className="text-xs text-muted-foreground">
                درگاه پرداخت اینترنتی بانک {gateway === "saman" ? "سامان (سپ)" : gateway === "mellat" ? "ملت (به‌پرداخت)" : "زرین‌پال"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/40 px-3 py-1.5 rounded-xl self-start sm:self-auto font-mono">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>زمان باقی‌مانده:</span>
            <strong className="text-foreground">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </strong>
          </div>
        </div>

        {/* Payment Main Portal Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
          {/* Merchant & Amount Box */}
          <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-4 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">پذیرنده اینترنتی:</span>
              <span className="font-bold text-foreground">صنایع سنگ و سرامیک ایرانیان</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">شناسه سفارش سنگ:</span>
              <span className="font-mono text-foreground font-bold">{orderId}</span>
            </div>
            <div className="flex items-baseline justify-between pt-1 border-t border-border/60">
              <span className="text-muted-foreground font-medium">مبلغ قابل پرداخت:</span>
              <div className="text-end">
                <span className="text-lg sm:text-xl font-extrabold text-primary tabular-nums">
                  {formatPrice(amount)}
                </span>
                <span className="ms-1.5 text-xs text-muted-foreground">تومان</span>
                <span className="block text-[10px] text-muted-foreground font-mono">
                  ({(amount * 10).toLocaleString("fa-IR")} ریال)
                </span>
              </div>
            </div>
          </div>

          {/* Test Environment Notice */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-800 dark:text-amber-200">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="leading-relaxed">
              <strong>حالت شبیه‌ساز امن درگاه پرداخت:</strong> این صفحه فرآیند پرداخت امن شاپرک را شبیه‌سازی می‌کند. با کلیک روی دکمه‌های تستی زیر می‌توانید پرداخت موفق یا لغو تراکنش را ارزیابی نمایید.
            </p>
          </div>

          {/* Card Input Fields */}
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Card Number */}
            <div className="space-y-1.5">
              <Label htmlFor="card-num" className="text-xs font-semibold">
                شماره کارت بانکی (۱۶ رقمی):
              </Label>
              <div className="relative">
                <CreditCard className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="card-num"
                  dir="ltr"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="ps-10 font-mono text-center tracking-widest text-sm"
                  maxLength={19}
                />
              </div>
            </div>

            {/* CVV2 & Expiry */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="card-cvv" className="text-xs font-semibold">
                  کد شناسایی (CVV2):
                </Label>
                <Input
                  id="card-cvv"
                  dir="ltr"
                  value={cvv2}
                  onChange={(e) => setCvv2(e.target.value)}
                  className="font-mono text-center text-sm"
                  maxLength={4}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">تاریخ انقضا:</Label>
                <div className="flex items-center gap-1">
                  <Input
                    dir="ltr"
                    placeholder="ماه"
                    value={expMonth}
                    onChange={(e) => setExpMonth(e.target.value)}
                    className="font-mono text-center text-sm"
                    maxLength={2}
                  />
                  <span>/</span>
                  <Input
                    dir="ltr"
                    placeholder="سال"
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value)}
                    className="font-mono text-center text-sm"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            {/* OTP & Captcha */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="card-pin" className="text-xs font-semibold">
                  رمز دوم پویا:
                </Label>
                <Input
                  id="card-pin"
                  type="password"
                  dir="ltr"
                  value={pin2}
                  onChange={(e) => setPin2(e.target.value)}
                  className="font-mono text-center text-sm"
                  maxLength={8}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="card-captcha" className="text-xs font-semibold">
                  کد امنیتی (کپچا):
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="card-captcha"
                    dir="ltr"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    className="font-mono text-center text-sm"
                    maxLength={5}
                  />
                  <div className="h-9 px-2.5 rounded-md bg-muted border border-border flex items-center justify-center font-mono font-bold text-sm tracking-widest select-none">
                    4821
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <Button
              type="button"
              size="lg"
              disabled={isSubmitting}
              onClick={() => handleSimulatePayment("success")}
              className="w-full h-12 text-sm font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>در حال اعتبارسنجی پرداخت با شاپرک...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>پرداخت موفق (شبیه‌ساز تأیید بانکی)</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={isSubmitting}
              onClick={() => handleSimulatePayment("failed")}
              className="w-full h-11 text-xs text-destructive hover:bg-destructive/5 hover:border-destructive gap-2"
            >
              <XCircle className="h-4 w-4" />
              <span>انصراف از پرداخت و بازگشت به فروشگاه</span>
            </Button>
          </div>

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-muted-foreground border-t border-border/60">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span>اتصال امن رمزنگاری‌شده با گواهینامه معتبر SSL شاپرک</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentGatewayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentGatewayInner />
    </Suspense>
  );
}
