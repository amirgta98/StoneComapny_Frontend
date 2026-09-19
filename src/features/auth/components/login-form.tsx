"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Loader2,
  Pencil,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button, Input, Label } from "@/components/ui";
import { cn } from "@/lib/utils";
import { CINEMATIC_EASE } from "@/lib/motion";

import { phoneSchema, type PhoneFormValues } from "../schemas/login";
import {
  MOCK_OTP_TEST_CODE,
  MockAuthError,
  sendOtp,
  verifyOtp,
} from "@/auth/mock/mockAuthApi";
import { useAuth } from "@/auth";
import { OtpInput } from "./otp-input";

type Step = "phone" | "otp";

/** Persian messages for auth API error codes (contract of mockAuthApi). */
const OTP_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CODE: "کد واردشده صحیح نیست",
  CODE_EXPIRED: "کد منقضی شده است؛ کد جدید درخواست کنید",
  TOO_MANY_ATTEMPTS: "تلاش‌های بیش از حد؛ لطفاً کد جدید درخواست کنید",
  PHONE_NOT_REQUESTED: "ابتدا کد تأیید را درخواست کنید",
};

/** Only internal, same-origin paths are accepted as redirect targets. */
function getSafeRedirect(value: string | null): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/";
}

/* Shared entrance variants for both steps (slides from the inline-start in RTL). */
const stepVariants = {
  enter: (reduce: boolean) =>
    reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: (reduce: boolean) =>
    reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 },
};

/**
 * Unified login/sign-up form — no need to distinguish new vs returning users.
 *
 * Step 1: mobile number (react-hook-form + zod, Persian errors).
 * Step 2: 5-digit OTP with a resend countdown and «ویرایش شماره» back link.
 * On success: stores the AuthSession in AuthContext (`@/auth`) and redirects
 * to `redirect`/`redirectUrl` (the page the user came from) or the home page.
 *
 * All backend calls go through `@/auth/mock/mockAuthApi` (mock today, real
 * API later) so switching to live endpoints requires no changes here.
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState<Step>("phone");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [requesting, setRequesting] = useState(false);
  /** Hint shown in mock mode — the demo code. */
  const [codeHint, setCodeHint] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  const redirectUrl = useMemo(
    // Middleware sets `redirect` (skill §8.1); `redirectUrl` is the legacy param.
    () => getSafeRedirect(searchParams.get("redirect") ?? searchParams.get("redirectUrl")),
    [searchParams]
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  /* Resend countdown — ticks once per second until it hits zero.
     No setState runs synchronously inside the effect body; the decrement
     happens in the timeout callback, so the tick is async and rule-safe. */
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const handleRequestCode = async ({ phone }: PhoneFormValues) => {
    setRequesting(true);
    setOtpError(null);
    try {
      const result = await sendOtp(phone);
      if (!result.success) {
        // Resend cooldown enforced by the API layer (skill §9.7).
        toast.error("ارسال کد با خطا مواجه شد", {
          description: `لطفاً ${result.cooldownSeconds.toLocaleString("fa-IR")} ثانیه دیگر تلاش کنید.`,
        });
        return;
      }
      // MOCK-ONLY hint: reveals the fixed test code, dev builds only.
      setCodeHint(
        process.env.NODE_ENV === "development"
          ? `کد تأیید آزمایشی: ${MOCK_OTP_TEST_CODE}`
          : null
      );
      setStep("otp");
      setOtpValue("");
      setResendIn(result.cooldownSeconds);
    } catch {
      toast.error("ارسال کد با خطا مواجه شد", {
        description: "لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setRequesting(false);
    }
  };

  const handleVerify = async (code: string) => {
    if (code.length !== 5 || verifying) return;
    setOtpValue(code);
    setVerifying(true);
    setOtpError(null);
    try {
      const session = await verifyOtp(getValues("phone"), code);
      login(session); // stores AuthSession in AuthContext + mock storage
      toast.success("ورود موفق", { description: "خوش آمدید." });
      router.push(redirectUrl);
    } catch (error) {
      setOtpError(
        error instanceof MockAuthError
          ? OTP_ERROR_MESSAGES[error.code] ?? "کد واردشده صحیح نیست"
          : "کد واردشده صحیح نیست"
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = () => {
    if (resendIn > 0 || requesting) return;
    void handleRequestCode(getValues());
  };

  const handleEditPhone = () => {
    setStep("phone");
    setOtpError(null);
    setOtpValue("");
  };

  const transition = { duration: 0.35, ease: CINEMATIC_EASE };

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {step === "phone" ? (
          <motion.div
            key="phone"
            custom={reduceMotion}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">ورود / ثبت‌نام</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  شماره موبایل خود را وارد کنید؛ اگر برای اولین بار است، حساب
                  کاربری‌تان به‌صورت خودکار ساخته می‌شود.
                </p>
              </div>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="size-5" aria-hidden="true" />
              </span>
            </div>

            <form
              className="mt-6 space-y-4"
              onSubmit={handleSubmit(handleRequestCode)}
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="auth-phone">شماره موبایل</Label>
                <Input
                  id="auth-phone"
                  type="tel"
                  inputMode="numeric"
                  dir="ltr"
                  placeholder="09121234567"
                  className="h-11 text-left text-base tabular-nums"
                  aria-invalid={Boolean(errors.phone)}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={requesting}
              >
                {requesting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    در حال ارسال کد...
                  </>
                ) : (
                  <>
                    ارسال کد تأیید
                    <ArrowLeft className="size-4" aria-hidden="true" />
                  </>
                )}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                کد تأیید پیامکی برای شما ارسال می‌شود
              </p>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            custom={reduceMotion}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">کد تأیید</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  کد ۵ رقمی ارسال‌شده به شماره‌ی{" "}
                  <span dir="ltr" className="font-medium tabular-nums text-foreground">
                    {getValues("phone")}
                  </span>{" "}
                  را وارد کنید.
                </p>
              </div>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <KeyRound className="size-5" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <OtpInput
                onComplete={handleVerify}
                onChange={() => setOtpError(null)}
                disabled={verifying}
                hasError={Boolean(otpError)}
              />

              {(otpError || codeHint) && (
                <p
                  className={cn(
                    "rounded-md px-3 py-2 text-center text-xs",
                    otpError
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                  )}
                  role={otpError ? "alert" : "status"}
                >
                  {otpError ?? codeHint}
                </p>
              )}

              <Button
                type="button"
                size="lg"
                className="w-full"
                disabled={verifying || otpValue.length !== 5}
                onClick={() => void handleVerify(otpValue)}
              >
                {verifying ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    در حال ورود...
                  </>
                ) : (
                  <>
                    تایید و ورود
                    <ArrowLeft className="size-4" aria-hidden="true" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between gap-2 text-sm">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendIn > 0 || requesting}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="text-muted-foreground">ارسال مجدد کد</span>
                  {resendIn > 0 ? (
                    <span className="tabular-nums">
                      ({resendIn.toLocaleString("fa-IR")}s)
                    </span>
                  ) : (
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleEditPhone}
                  disabled={verifying}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  ویرایش شماره
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
