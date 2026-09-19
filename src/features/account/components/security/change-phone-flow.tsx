"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Loader2,
  Pencil,
  AlertCircle,
  CheckCircle2,
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
import { OtpInput } from "@/features/auth/components/otp-input";
import { useAuth } from "@/auth";
import { useSecurityStore } from "../../stores/security-store";
import {
  maskPhoneNumber,
  formatSecondsToTimer,
  toPersianDigits,
} from "../../utils/security";

const COOLDOWN_INITIAL_SECONDS = 90;
const MAX_ATTEMPTS = 5;
const MOCK_VALID_OTP = "12345";

const newPhoneSchema = z.object({
  newPhone: z
    .string()
    .trim()
    .min(1, "شماره موبایل جدید را وارد کنید")
    .regex(/^09\d{9}$/, "شماره موبایل نامعتبر است (مثال: 09121234567)"),
});

type NewPhoneFormValues = z.infer<typeof newPhoneSchema>;

export function ChangePhoneFlow() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { addSecurityEvent } = useSecurityStore();

  const currentPhone = user?.phone || "09120000004";
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [targetPhone, setTargetPhone] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<NewPhoneFormValues>({
    resolver: zodResolver(newPhoneSchema),
    defaultValues: { newPhone: "" },
  });

  // Countdown timer for OTP resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handlePhoneSubmit = async (data: NewPhoneFormValues) => {
    if (data.newPhone === currentPhone) {
      setError("newPhone", {
        type: "manual",
        message: "شماره موبایل جدید نمی‌تواند با شماره فعلی یکسان باشد",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate backend OTP dispatch
      await new Promise((res) => setTimeout(res, 800));

      setTargetPhone(data.newPhone);
      setStep("otp");
      setOtpValue("");
      setOtpError(null);
      setAttempts(0);
      setCooldown(COOLDOWN_INITIAL_SECONDS);

      toast.info(`کد تأیید به شماره ${data.newPhone} ارسال شد.`);
    } catch {
      toast.error("خطا در ارسال کد تأیید. لطفاً مجدداً تلاش نمایید.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 800));
      setCooldown(COOLDOWN_INITIAL_SECONDS);
      setOtpError(null);
      toast.info("کد تأیید مجدداً ارسال گردید.");
    } catch {
      toast.error("خطا در ارسال مجدد کد.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpValue;
    if (code.length !== 5 || loading) return;

    if (attempts >= MAX_ATTEMPTS) {
      setOtpError("تعداد تلاش‌های ناموفق بیش از حد مجاز است. لطفاً شماره را ویرایش و کد جدید دریافت کنید.");
      return;
    }

    setLoading(true);
    setOtpError(null);

    try {
      await new Promise((res) => setTimeout(res, 900));

      if (code !== MOCK_VALID_OTP) {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        if (nextAttempts >= MAX_ATTEMPTS) {
          setOtpError("تعداد دفعات ورود اشتباه بیش از حد مجاز است.");
        } else {
          setOtpError(`کد وارد شده صحیح نیست. (${MAX_ATTEMPTS - nextAttempts} تلاش باقی مانده)`);
        }
        return;
      }

      // Successful verification
      if (user) {
        updateUser({
          ...user,
          phone: targetPhone,
        });
      }

      addSecurityEvent({
        userId: user?.id || "u-user-1",
        type: "PHONE_CHANGED",
        metadata: {
          previousPhone: currentPhone,
          newPhone: targetPhone,
        },
      });

      toast.success("شماره موبایل با موفقیت تغییر کرد.");
      router.push("/account/security");
    } catch {
      setOtpError("خطا در برقراری ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Back link & breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/account/security"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
          <span>بازگشت به امنیت حساب</span>
        </Link>
      </div>

      <Card className="border border-border/80 shadow-md">
        <CardHeader className="text-start pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Phone className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">تغییر شماره موبایل</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                برای تغییر شماره موبایل، ابتدا شماره جدید را وارد کرده و کد پیامک‌شده را تأیید کنید
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {/* Current verified phone banner */}
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/40 border border-border/40 text-xs">
            <span className="text-muted-foreground">شماره موبایل فعلی شما:</span>
            <div className="flex items-center gap-2 font-mono font-bold text-foreground">
              <span dir="ltr">{maskPhoneNumber(currentPhone)}</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.form
                key="step-phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit(handlePhoneSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="newPhone" className="text-xs font-semibold">
                    شماره موبایل جدید
                  </Label>
                  <Input
                    id="newPhone"
                    type="tel"
                    dir="ltr"
                    placeholder="09121234567"
                    disabled={loading}
                    className="h-11 text-base tracking-wider font-mono placeholder:tracking-normal placeholder:font-sans"
                    {...register("newPhone")}
                  />
                  {errors.newPhone && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.newPhone.message}</span>
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 text-sm font-semibold gap-2 transition-all duration-150 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>در حال ارسال کد...</span>
                    </>
                  ) : (
                    <span>دریافت کد تأیید</span>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      کد تأیید به شماره{" "}
                      <strong className="text-foreground font-mono" dir="ltr">
                        {maskPhoneNumber(targetPhone)}
                      </strong>{" "}
                      ارسال شد.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("phone");
                      setOtpError(null);
                    }}
                    disabled={loading}
                    className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>ویرایش</span>
                  </button>
                </div>

                {/* OTP Input Component */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold block text-center mb-3">
                    کد ۵ رقمی تأیید را وارد کنید
                  </Label>

                  <OtpInput
                    disabled={loading || attempts >= MAX_ATTEMPTS}
                    hasError={Boolean(otpError)}
                    onChange={() => setOtpError(null)}
                    onComplete={(code) => {
                      setOtpValue(code);
                      void handleVerifyOtp(code);
                    }}
                  />

                  {otpError && (
                    <p className="text-xs text-destructive text-center flex items-center justify-center gap-1 mt-2 font-medium">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{otpError}</span>
                    </p>
                  )}

                  <p className="text-[11px] text-muted-foreground text-center mt-1">
                    (کد تستی جهت ارزیابی در محیط دمو: <code className="text-primary font-bold">12345</code>)
                  </p>
                </div>

                {/* Resend button & timer */}
                <div className="flex items-center justify-center text-xs text-muted-foreground pt-1">
                  {cooldown > 0 ? (
                    <span>
                      ارسال مجدد کد تا{" "}
                      <span className="font-mono font-bold text-foreground">
                        {toPersianDigits(formatSecondsToTimer(cooldown))}
                      </span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-primary hover:underline font-semibold"
                    >
                      ارسال مجدد کد تأیید
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep("phone");
                      setOtpError(null);
                    }}
                    disabled={loading}
                    className="w-full sm:w-1/3 text-xs"
                  >
                    تغییر شماره
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleVerifyOtp()}
                    disabled={otpValue.length !== 5 || loading || attempts >= MAX_ATTEMPTS}
                    className="w-full sm:w-2/3 text-xs font-semibold gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>در حال بررسی...</span>
                      </>
                    ) : (
                      <span>تأیید و ذخیره شماره</span>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
