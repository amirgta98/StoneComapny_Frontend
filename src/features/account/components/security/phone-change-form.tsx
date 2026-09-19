"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  KeyRound,
  Loader2,
  Pencil,
  Phone,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
} from "@/components/ui";
import { PageHeader } from "@/components/layouts";
import { useAuth } from "@/auth";
import { OtpInput } from "@/features/auth/components/otp-input";
import { maskPhoneNumber } from "../../lib/security-utils";
import {
  requestPhoneChangeOtp,
  verifyPhoneChangeOtp,
} from "../../services/security-api";
import { MOCK_OTP_TEST_CODE } from "@/auth/mock/mockAuthApi";

const RESEND_COOLDOWN = 90; // seconds

const newPhoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "شماره موبایل جدید را وارد کنید")
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: 09121234567)"),
});

type NewPhoneFormValues = z.infer<typeof newPhoneSchema>;
type Step = "phone" | "otp" | "success";

export function PhoneChangeForm() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [step, setStep] = useState<Step>("phone");
  const [newPhone, setNewPhone] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<NewPhoneFormValues>({
    resolver: zodResolver(newPhoneSchema),
    defaultValues: { phone: "" },
  });

  // Resend countdown timer
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const handleRequestOtp = async (values: NewPhoneFormValues) => {
    if (!user) return;
    if (values.phone === user.phone) {
      setError("phone", {
        type: "manual",
        message: "شماره جدید نمی‌تواند با شماره فعلی یکسان باشد.",
      });
      return;
    }

    setRequesting(true);
    setOtpError(null);
    try {
      const res = await requestPhoneChangeOtp(
        user.id,
        user.phone,
        values.phone
      );

      if (!res.success) {
        toast.error("ارسال کد با محدودیت مواجه شد", {
          description: `لطفاً ${res.cooldownSeconds.toLocaleString("fa-IR")} ثانیه دیگر تلاش کنید.`,
        });
        setResendIn(res.cooldownSeconds);
        return;
      }

      setNewPhone(values.phone);
      setResendIn(res.cooldownSeconds || RESEND_COOLDOWN);
      setAttempts(0);
      setStep("otp");
      toast.success("کد تأیید ارسال شد", {
        description: `کد ۵ رقمی به شماره ${maskPhoneNumber(values.phone)} ارسال گردید.`,
      });
    } catch (err: any) {
      toast.error(err?.message || "خطا در ارسال کد تأیید");
    } finally {
      setRequesting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendIn > 0 || !user || !newPhone) return;
    setRequesting(true);
    setOtpError(null);
    try {
      const res = await requestPhoneChangeOtp(user.id, user.phone, newPhone);
      setResendIn(res.cooldownSeconds || RESEND_COOLDOWN);
      toast.success("کد تأیید مجدداً ارسال شد");
    } catch (err: any) {
      toast.error(err?.message || "خطا در ارسال مجدد کد تأیید");
    } finally {
      setRequesting(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify ?? otpValue;
    if (!user || code.length !== 5) {
      setOtpError("لطفاً کد ۵ رقمی را کامل وارد کنید");
      return;
    }

    if (attempts >= 5) {
      setOtpError("تعداد دفعات تلاش بیش از حد مجاز است. لطفاً کد جدید دریافت کنید.");
      return;
    }

    setVerifying(true);
    setOtpError(null);
    try {
      await verifyPhoneChangeOtp(user.id, newPhone, code);

      // Update auth session immediately
      updateUser({
        ...user,
        phone: newPhone,
      });

      setStep("success");
      toast.success("شماره موبایل با موفقیت تغییر کرد.");
    } catch (err: any) {
      setAttempts((prev) => prev + 1);
      setOtpError(err?.message || "کد تأیید صحیح نیست");
    } finally {
      setVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Link href="/account/security">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span>بازگشت به امنیت حساب</span>
          </Link>
        </Button>
      </div>

      <PageHeader
        title="تغییر شماره موبایل"
        description="شماره موبایل جدید خود را وارد کرده و با کد تأیید پیامکی احراز هویت کنید."
      />

      {/* Step 1: Enter New Phone */}
      {step === "phone" && (
        <Card className="border border-stone-200/80 bg-card shadow-xs dark:border-stone-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  ورود شماره موبایل جدید
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  کد تأیید برای این شماره ارسال خواهد شد
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="rounded-lg border border-stone-200/60 bg-stone-50/60 p-3 text-xs text-muted-foreground dark:border-stone-800/60 dark:bg-stone-900/40">
              <span className="font-medium text-foreground">شماره فعلی شما: </span>
              <span dir="ltr" className="font-mono font-semibold text-foreground">
                {maskPhoneNumber(user?.phone)}
              </span>
            </div>

            <form onSubmit={handleSubmit(handleRequestOtp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-phone-input" className="text-xs font-medium">
                  شماره موبایل جدید
                </Label>
                <div className="relative">
                  <Input
                    id="new-phone-input"
                    dir="ltr"
                    type="tel"
                    inputMode="numeric"
                    placeholder="09123456789"
                    maxLength={11}
                    autoComplete="tel"
                    {...register("phone")}
                    className="pe-10 font-mono tracking-normal text-start"
                  />
                  <Phone
                    className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60"
                    aria-hidden="true"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button asChild variant="outline">
                  <Link href="/account/security">انصراف</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={requesting}
                  className="gap-2 min-w-[130px]"
                >
                  {requesting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>در حال ارسال...</span>
                    </>
                  ) : (
                    <>
                      <span>دریافت کد تأیید</span>
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: OTP Verification */}
      {step === "otp" && (
        <Card className="border border-stone-200/80 bg-card shadow-xs dark:border-stone-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  تأیید شماره موبایل جدید
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  کد ارسال شده به شماره را وارد کنید
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/[0.03] p-3 text-xs">
              <div>
                <span className="text-muted-foreground">ارسال کد به شماره: </span>
                <span dir="ltr" className="font-mono font-semibold text-foreground">
                  {maskPhoneNumber(newPhone)}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep("phone")}
                className="h-7 gap-1 text-xs text-primary hover:text-primary/80"
              >
                <Pencil className="h-3 w-3" aria-hidden="true" />
                <span>ویرایش شماره</span>
              </Button>
            </div>

            <div className="space-y-3">
              <Label className="block text-center text-xs font-medium text-foreground">
                کد ۵ رقمی تأیید را وارد کنید
              </Label>
              <OtpInput
                onComplete={(code) => {
                  setOtpValue(code);
                  void handleVerifyOtp(code);
                }}
                onChange={() => setOtpError(null)}
                disabled={verifying}
                hasError={Boolean(otpError)}
              />

              {otpError && (
                <p className="text-center text-xs font-medium text-destructive">
                  {otpError}
                </p>
              )}

              {/* Dev hint */}
              <p className="text-center text-[11px] text-muted-foreground">
                کد آزمایشی:{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground font-semibold">
                  {MOCK_OTP_TEST_CODE}
                </code>
              </p>
            </div>

            {/* Resend & Timer */}
            <div className="flex items-center justify-center text-xs text-muted-foreground">
              {resendIn > 0 ? (
                <span className="flex items-center gap-1.5">
                  <span>ارسال مجدد کد تا</span>
                  <span dir="ltr" className="font-mono font-semibold text-foreground">
                    {formatTime(resendIn)}
                  </span>
                </span>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={requesting}
                  onClick={handleResendOtp}
                  className="gap-1.5 text-xs text-primary hover:text-primary/80"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>ارسال مجدد کد تأیید</span>
                </Button>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("phone")}
                disabled={verifying}
              >
                مرحله قبل
              </Button>
              <Button
                type="button"
                disabled={verifying}
                onClick={() => handleVerifyOtp()}
                className="gap-2 min-w-[130px]"
              >
                {verifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>در حال بررسی...</span>
                  </>
                ) : (
                  <span>تأیید و ذخیره</span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Success State */}
      {step === "success" && (
        <Card className="border border-emerald-500/30 bg-emerald-50/[0.15] text-center shadow-xs dark:border-emerald-500/20 dark:bg-emerald-950/[0.15]">
          <CardContent className="space-y-4 py-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground">
                شماره موبایل با موفقیت تغییر کرد
              </h3>
              <p className="text-xs text-muted-foreground">
                از این پس شماره{" "}
                <span dir="ltr" className="font-mono font-semibold text-foreground">
                  {newPhone}
                </span>{" "}
                شماره معتبر ورود و پیامک‌های امنیتی شما خواهد بود.
              </p>
            </div>

            <div className="pt-4">
              <Button
                asChild
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/account/security">
                  <span>بازگشت به امنیت حساب</span>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
